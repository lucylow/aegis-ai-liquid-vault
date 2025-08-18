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
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Get current account and chain info
  const getAccountInfo = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setChainId(chainId);
        
        // Get balance
        const balance = await window.ethereum!.request({
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
    if (!isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install MetaMask to use this app.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
        setChainId(chainId);
        
        // Get balance
        const balance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInEth = (parseInt(balance, 16) / 10**18).toFixed(4);
        setBalance(balanceInEth);
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        alert('Please connect your MetaMask wallet to continue.');
      } else {
        alert('Failed to connect to MetaMask. Please try again.');
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

    try {
      await window.ethereum!.request({
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

    window.ethereum!.on('accountsChanged', handleAccountsChanged);
    window.ethereum!.on('chainChanged', handleChainChanged);

    // Get initial account info
    getAccountInfo();

    return () => {
      window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum!.removeListener('chainChanged', handleChainChanged);
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
