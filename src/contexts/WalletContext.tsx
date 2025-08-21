import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    // Check for the real MetaMask specifically
    const hasEthereum = typeof window !== 'undefined' && window.ethereum;
    const isRealMetaMask = hasEthereum && window.ethereum.isMetaMask === true;
    
    // Additional check to ensure it's not PLUG WALLET or other wallets
    const isPlugWallet = hasEthereum && (
      (window.ethereum as any).isPlugWallet || 
      (window.ethereum as any).isPlug || 
      (window.ethereum as any).providers?.some((provider: any) => provider.isPlugWallet)
    );
    
    const installed = isRealMetaMask && !isPlugWallet;
    
    if (hasEthereum) {
      console.log('🦊 MetaMask detection:', { 
        isRealMetaMask,
        isPlugWallet,
        installed: installed ? '✅ Found' : '❌ Not found'
      });
    }
    
    return installed;
  };

  // Get the correct MetaMask provider
  const getMetaMaskProvider = () => {
    if (typeof window === 'undefined') return null;
    
    // If there are multiple providers, find MetaMask specifically
    if ((window.ethereum as any)?.providers) {
      const metaMaskProvider = (window.ethereum as any).providers.find(
        (provider: any) => provider.isMetaMask === true && !provider.isPlugWallet
      );
      return metaMaskProvider || null;
    }
    
    // Single provider case - ensure it's MetaMask
    if (window.ethereum?.isMetaMask === true && !(window.ethereum as any).isPlugWallet) {
      return window.ethereum;
    }
    
    return null;
  };

  // Check if MetaMask is unlocked
  const isMetaMaskUnlocked = async () => {
    const provider = getMetaMaskProvider();
    if (!provider) return false;
    
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      console.log('MetaMask unlock check - accounts:', accounts);
      return accounts.length > 0;
    } catch (error) {
      console.log('MetaMask unlock check - error:', error);
      return false;
    }
  };

  // Get current account and chain info
  const getAccountInfo = async () => {
    if (!isMetaMaskInstalled()) return;

    const provider = getMetaMaskProvider();
    if (!provider) return;

    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      const chainId = await provider.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setChainId(chainId);
        
        // Get balance
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInEth = (parseInt(balance, 16) / 10**18).toFixed(4);
        setBalance(balanceInEth);
      }
    } catch (error) {
      console.error('Error getting account info:', error);
    }
  };

  // Connect to MetaMask
  const connect = async () => {
    console.log('🦊 Attempting to connect to MetaMask...');
    
    if (!isMetaMaskInstalled()) {
      alert('🦊 MetaMask is not installed.\n\nPlease install MetaMask from https://metamask.io and refresh the page.');
      return;
    }

    const provider = getMetaMaskProvider();
    if (!provider) {
      alert('🦊 MetaMask provider not found.\n\nPlease ensure MetaMask is properly installed and refresh the page.');
      return;
    }

    // Check if MetaMask is unlocked
    const unlocked = await isMetaMaskUnlocked();
    if (!unlocked) {
      alert('🔒 Please unlock your MetaMask wallet and try again.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainId = await provider.request({ method: 'eth_chainId' });
        setChainId(chainId);
        
        // Get balance
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInEth = (parseInt(balance, 16) / 10**18).toFixed(4);
        setBalance(balanceInEth);
        
        console.log('✅ Successfully connected to MetaMask!', { 
          address: accounts[0].substring(0, 6) + '...' + accounts[0].substring(38), 
          chainId, 
          balance: balanceInEth 
        });
      }
    } catch (error: any) {
      console.error('❌ MetaMask connection error:', error);
      if (error.code === 4001) {
        alert('🚫 Connection rejected.\n\nPlease approve the connection request in MetaMask to continue.');
      } else if (error.code === -32002) {
        alert('⏳ Connection request pending.\n\nPlease check your MetaMask extension and approve the pending request.');
      } else {
        alert('❌ Failed to connect to MetaMask.\n\nPlease try again or refresh the page.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    setBalance(null);
  };

  // Switch network
  const switchNetwork = async (targetChainId: string) => {
    if (!isMetaMaskInstalled()) return;

    const provider = getMetaMaskProvider();
    if (!provider) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        alert('Please add this network to MetaMask first.');
      } else {
        console.error('Error switching network:', error);
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const provider = getMetaMaskProvider();
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        getAccountInfo();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
      if (address) {
        getAccountInfo();
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    // Get initial account info
    getAccountInfo();

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, [address]);

  const value: WalletContextType = {
    address,
    isConnected,
    isConnecting,
    chainId,
    balance,
    connect,
    disconnect,
    switchNetwork,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
