import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
  network: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  isConnecting: boolean;
  connectionError: string | null;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<string>('Not Connected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Check for MetaMask specifically, not just any ethereum provider
    const ethereum = (window as any).ethereum;
    return ethereum && ethereum.isMetaMask === true;
  }, []);

  // Check if MetaMask is unlocked
  const isMetaMaskUnlocked = useCallback(async () => {
    if (!isMetaMaskInstalled()) return false;
    
    try {
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      return accounts && accounts.length > 0;
    } catch {
      return false;
    }
  }, []);

  // Get the correct MetaMask provider
  const getMetaMaskProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const ethereum = (window as any).ethereum;
    
    // Check if there are multiple providers and find MetaMask
    if (ethereum && ethereum.providers) {
      const metaMaskProvider = ethereum.providers.find((provider: any) => provider.isMetaMask);
      if (metaMaskProvider) return metaMaskProvider;
    }
    
    // Return the main ethereum object if it's MetaMask
    if (ethereum && ethereum.isMetaMask) {
      return ethereum;
    }
    
    return null;
  }, []);

  // Get account info without triggering popups
  const getAccountInfo = useCallback(async () => {
    const provider = getMetaMaskProvider();
    if (!provider) return;

    try {
      // Use eth_accounts instead of eth_requestAccounts to avoid popup
      const accounts = await provider.request({ method: 'eth_accounts' });
      
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setAddress(account);
        setIsConnected(true);
        
        // Get chain ID
        const chainId = await provider.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));
        
        // Get balance
        const balance = await provider.request({ 
          method: 'eth_getBalance', 
          params: [account, 'latest'] 
        });
        setBalance(parseFloat(parseInt(balance, 16) / 1e18).toFixed(4));
        
        // Set network name
        const networkNames: { [key: number]: string } = {
          1: 'Ethereum Mainnet',
          137: 'Polygon',
          56: 'Binance Smart Chain',
          42161: 'Arbitrum',
          10: 'Optimism',
          8453: 'Base',
          59144: 'Linea'
        };
        setNetwork(networkNames[parseInt(chainId, 16)] || `Chain ID: ${parseInt(chainId, 16)}`);
      } else {
        // No accounts, but MetaMask is available
        setIsConnected(false);
        setAddress(null);
      }
    } catch (error) {
      console.error('Error getting account info:', error);
      setConnectionError('Failed to get account information');
    }
  }, [getMetaMaskProvider]);

  // Connect wallet with minimal popup
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setConnectionError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const provider = getMetaMaskProvider();
      if (!provider) {
        throw new Error('MetaMask provider not found');
      }

      // Check if already connected
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        // Already connected, just get account info
        await getAccountInfo();
        return;
      }

      // Request accounts (this will show the popup)
      const newAccounts = await provider.request({ method: 'eth_requestAccounts' });
      
      if (newAccounts && newAccounts.length > 0) {
        await getAccountInfo();
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      
      if (error.code === 4001) {
        setConnectionError('Connection rejected by user');
      } else if (error.code === -32002) {
        setConnectionError('Connection request already pending. Please check MetaMask.');
      } else {
        setConnectionError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, getMetaMaskProvider, getAccountInfo]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    setBalance('0');
    setNetwork('Not Connected');
    setConnectionError(null);
    
    // Clear any stored connection state
    localStorage.removeItem('aegis-wallet-connected');
  }, []);

  // Switch network with minimal popup
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!isConnected) return;

    try {
      const provider = getMetaMaskProvider();
      if (!provider) return;

      // Try to switch network
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      // Update local state
      setChainId(targetChainId);
      
      // Update network name
      const networkNames: { [key: number]: string } = {
        1: 'Ethereum Mainnet',
        137: 'Polygon',
        56: 'Binance Smart Chain',
        42161: 'Arbitrum',
        10: 'Optimism',
        8453: 'Base',
        59144: 'Linea'
      };
      setNetwork(networkNames[targetChainId] || `Chain ID: ${targetChainId}`);
      
    } catch (error: any) {
      console.error('Network switch error:', error);
      
      if (error.code === 4902) {
        // Chain not added, try to add it
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: `Chain ${targetChainId}`,
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.example.com'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add chain:', addError);
          setConnectionError('Failed to add new network');
        }
      } else {
        setConnectionError('Failed to switch network');
      }
    }
  }, [isConnected, getMetaMaskProvider]);

  // Clear connection errors
  const clearError = useCallback(() => {
    setConnectionError(null);
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('aegis-wallet-connected');
    
    if (wasConnected && isMetaMaskInstalled()) {
      // Check if MetaMask is unlocked and has accounts
      isMetaMaskUnlocked().then((unlocked) => {
        if (unlocked) {
          getAccountInfo();
        }
      });
    }
  }, [isMetaMaskInstalled, isMetaMaskUnlocked, getAccountInfo]);

  // Listen for account changes
  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else {
        // Account changed
        setAddress(accounts[0]);
        getAccountInfo();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
      if (address) {
        getAccountInfo();
      }
    };

    const handleDisconnect = () => {
      disconnect();
    };

    // Add event listeners
    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    // Store connection state
    if (isConnected) {
      localStorage.setItem('aegis-wallet-connected', 'true');
    }

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
      provider.removeListener('disconnect', handleDisconnect);
    };
  }, [getMetaMaskProvider, isConnected, address, getAccountInfo, disconnect]);

  const value: WalletContextType = {
    address,
    isConnected,
    chainId,
    balance,
    network,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
    connectionError,
    clearError
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
