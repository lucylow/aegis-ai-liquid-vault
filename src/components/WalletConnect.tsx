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
    clearError 
  } = useWallet();
  
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
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

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Wallet size={16} />
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
        
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
        
        {/* MetaMask Download Link */}
        <div className="text-center mt-2">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
          >
            Don't have MetaMask? Download here
            <ExternalLink size={12} />
          </a>
        </div>
        
        <div className="text-center mt-1">
          <span className="text-xs text-yellow-400">⚠️ Only MetaMask is supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">3</span>
          </div>
        </button>

        {/* Wallet Status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium text-green-400">Connected</span>
        </div>

        {/* Wallet Info */}
        <div className="text-right">
          <div className="text-sm font-medium text-white">
            {address?.substring(0, 6)}...{address?.substring(38)}
          </div>
          <div className="text-xs text-gray-400">{balance} ETH</div>
        </div>

        {/* Network Info */}
        <div className="text-right">
          <div className="text-sm text-white">{network}</div>
          <button
            onClick={() => setShowNetworkSelector(!showNetworkSelector)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Switch Network
          </button>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>

      {/* Network Selector Dropdown */}
      {showNetworkSelector && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-white/10 rounded-lg p-3 z-50">
          <div className="text-sm font-medium text-white mb-3">Select Network</div>
          <div className="space-y-2">
            {[1, 137, 56, 42161, 10, 8453, 59144].map((chainId) => (
              <button
                key={chainId}
                onClick={() => handleNetworkSwitch(chainId)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNetworkColor(chainId) }}
                ></div>
                <span className="text-sm text-white">{getNetworkName(chainId)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
