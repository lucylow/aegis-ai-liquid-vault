import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  network: string | null;
  balance: string | null;
  connectionError: string | null;
  isDemoMode: boolean;
  zetaNetwork: 'mainnet' | 'testnet';
  setZetaNetwork: (network: 'mainnet' | 'testnet') => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  enableDemoMode: () => void;
  isMetaMaskInstalled: () => boolean;
  isMetaMaskUnlocked: () => Promise<boolean>;
  getMetaMaskProvider: () => any;
  getAccountInfo: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
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

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [zetaNetwork, setZetaNetwork] = useState<'mainnet' | 'testnet'>('mainnet');

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
  }, [isMetaMaskInstalled]);

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
        setBalance((parseInt(balance, 16) / 1e18).toFixed(4));
        
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

      // Request accounts (this will trigger the popup)
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
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
        setBalance((parseInt(balance, 16) / 1e18).toFixed(4));
        
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
        
        console.log('Wallet connected successfully:', account);
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      
      if (error.code === 4001) {
        setConnectionError('User rejected the connection request');
      } else if (error.code === -32002) {
        setConnectionError('MetaMask is already processing a request. Please check MetaMask and try again.');
      } else {
        setConnectionError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, getMetaMaskProvider]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    setNetwork(null);
    setBalance(null);
    setConnectionError(null);
    console.log('Wallet disconnected');
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!isConnected || !address) return;

    try {
      const provider = getMetaMaskProvider();
      if (!provider) return;

      const balance = await provider.request({ 
        method: 'eth_getBalance', 
        params: [address, 'latest'] 
      });
      setBalance((parseInt(balance, 16) / 1e18).toFixed(4));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  }, [isConnected, address, getMetaMaskProvider]);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!isConnected) return;

    try {
      const provider = getMetaMaskProvider();
      if (!provider) return;

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      // Refresh account info after network switch
      await getAccountInfo();
    } catch (error: any) {
      console.error('Error switching network:', error);
      
      if (error.code === 4902) {
        // Chain not added to MetaMask
        setConnectionError('Network not found in MetaMask. Please add it manually.');
      } else {
        setConnectionError('Failed to switch network');
      }
    }
  }, [isConnected, getMetaMaskProvider, getAccountInfo]);

  // Enable demo mode
  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setAddress('0x742d35Cc6634C0532925a3b8D16C09025A2f3c2E'); // Demo address
    setChainId(1);
    setNetwork('Demo Mode');
    setBalance('1.0000');
    console.log('Demo mode enabled');
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setConnectionError(null);
  }, []);

  // Listen for account changes - DISABLED on landing page to prevent automatic popups
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only enable wallet listeners if user has explicitly connected
    if (!isConnected) return;

    const provider = getMetaMaskProvider();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else if (accounts[0] !== address) {
        // Account changed - just update the address and refresh info
        setAddress(accounts[0]);
        // Refresh account info for the new address
        if (provider) {
          refreshBalance();
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Update chain ID without reloading the page
      setChainId(parseInt(chainId, 16));
      
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
      setNetwork(networkNames[parseInt(chainId, 16)] || `Chain ID: ${parseInt(chainId, 16)}`);
      
      // Refresh balance for new chain
      if (address) {
        refreshBalance();
      }
    };

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address, disconnect, isConnected]); // Added isConnected dependency

  // Auto-connect if MetaMask is already unlocked - DISABLED to prevent automatic popups
  // useEffect(() => {
  //   const autoConnect = async () => {
  //     if (isMetaMaskInstalled() && await isMetaMaskUnlocked()) {
  //       getAccountInfo();
  //     }
  //   };

  //   autoConnect();
  // }, []); // Only run once on mount

  // Auto-refresh balance every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [isConnected, refreshBalance]);

  const value: WalletContextType = {
    address,
    isConnected,
    isConnecting,
    chainId,
    network,
    balance,
    connectionError,
    isDemoMode,
    connect,
    disconnect,
    enableDemoMode,
    isMetaMaskInstalled,
    isMetaMaskUnlocked,
    getMetaMaskProvider,
    getAccountInfo,
    refreshBalance,
    switchNetwork,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
