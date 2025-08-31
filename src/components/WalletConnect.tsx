import React, { useState } from 'react';
import { Wallet, ExternalLink, AlertTriangle, X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnect = () => {
  const { 
    address, 
    isConnected, 
    balance, 
    network, 
    connect, 
    disconnect, 
    switchNetwork, 
    isConnecting, 
    connectionError, 
    clearError,
    isDemoMode,
    enableDemoMode
  } = useWallet();
  
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const handleConnect = async (walletType: string = 'metamask') => {
    try {
      clearError();
      await connect(walletType);
      setShowWalletOptions(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleDemoMode = () => {
    enableDemoMode();
    setShowWalletOptions(false);
  };

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchNetwork(chainId);
      setShowNetworkSelector(false);
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  };

  const getNetworkName = (chainId: number) => {
    const networkNames: { [key: number]: string } = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      42161: 'Arbitrum',
      10: 'Optimism',
      8453: 'Base',
      59144: 'Linea'
    };
    return networkNames[chainId] || `Chain ${chainId}`;
  };

  const getNetworkColor = (chainId: number) => {
    const networkColors: { [key: number]: string } = {
      1: '#627eea',
      137: '#8247e5',
      56: '#f0b90b',
      42161: '#28a0f0',
      10: '#ff0420',
      8453: '#0052ff',
      59144: '#61dafb'
    };
    return networkColors[chainId] || '#666';
  };

  return (
    <div className="relative">
      {!isConnected ? (
        <button
          onClick={() => setShowWalletOptions(!showWalletOptions)}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white`}
        >
          <Wallet size={16} />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <button
          onClick={handleDisconnect}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            isDemoMode 
              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30' 
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
          }`}
        >
          <Wallet size={16} />
          {isDemoMode ? 'Demo Mode' : 'Disconnect'}
        </button>
      )}
      
      {/* Wallet Options Dropdown */}
      {showWalletOptions && !isConnected && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg p-4 z-50 shadow-xl">
          <h4 className="font-medium text-white mb-3">Choose Wallet</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleConnect('metamask')}
              disabled={isConnecting}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <span className="text-lg">🦊</span>
              <div>
                <div className="text-white text-sm font-medium">MetaMask</div>
                <div className="text-gray-400 text-xs">Most popular Ethereum wallet</div>
              </div>
            </button>
            <button
              onClick={() => handleConnect('coinbase')}
              disabled={isConnecting}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <span className="text-lg">🪙</span>
              <div>
                <div className="text-white text-sm font-medium">Coinbase Wallet</div>
                <div className="text-gray-400 text-xs">Multi-chain support</div>
              </div>
            </button>
            <button
              onClick={() => handleConnect('phantom')}
              disabled={isConnecting}
              className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <span className="text-lg">👻</span>
              <div>
                <div className="text-white text-sm font-medium">Phantom</div>
                <div className="text-gray-400 text-xs">Solana ecosystem</div>
              </div>
            </button>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <button
                onClick={handleDemoMode}
                disabled={isConnecting}
                className="w-full flex items-center gap-3 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-lg transition-colors text-left"
              >
                <span className="text-lg">🎭</span>
                <div>
                  <div className="text-cyan-400 text-sm font-medium">Demo Mode</div>
                  <div className="text-cyan-300 text-xs">Test without real wallet</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Connection Error Toast */}
      {connectionError && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-red-500/90 backdrop-blur-sm border border-red-400 rounded-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-200 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-100 mb-1">Connection Error</h4>
              <p className="text-sm text-red-200 mb-3">{connectionError}</p>
              <div className="flex gap-2">
                <button
                  onClick={clearError}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Dismiss
                </button>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                >
                  Download MetaMask
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
