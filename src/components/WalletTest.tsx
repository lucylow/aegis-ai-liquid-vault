import React, { useState } from 'react';
import { Wallet, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletTest = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    chainId, 
    network, 
    balance, 
    connectionError,
    connect, 
    disconnect, 
    isMetaMaskInstalled,
    isKeplrInstalled,
    isPhantomInstalled,
    isCoinbaseWalletInstalled,
    isBraveWalletInstalled,
    clearError 
  } = useWallet();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleConnect = async (walletType: string) => {
    try {
      clearError();
      await connect(walletType);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', isInstalled: isMetaMaskInstalled() },
    { id: 'keplr', name: 'Keplr', icon: '🔮', isInstalled: isKeplrInstalled() },
    { id: 'phantom', name: 'Phantom', icon: '👻', isInstalled: isPhantomInstalled() },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🪙', isInstalled: isCoinbaseWalletInstalled() },
    { id: 'brave', name: 'Brave Wallet', icon: '🦁', isInstalled: isBraveWalletInstalled() },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Wallet Connection Test</h2>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            {isConnected ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <span className="text-lg font-medium text-white">
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isConnected && (
            <div className="space-y-2 text-sm text-gray-300">
              <div>Address: {address}</div>
              <div>Network: {network}</div>
              <div>Chain ID: {chainId}</div>
              <div>Balance: {balance} ETH</div>
            </div>
          )}
        </div>

        {/* Wallet Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 rounded-lg border transition-all ${
                wallet.isInstalled
                  ? 'bg-gray-800 border-gray-600 hover:border-blue-500'
                  : 'bg-gray-800/50 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h3 className="font-medium text-white">{wallet.name}</h3>
                  <div className="flex items-center gap-1">
                    {wallet.isInstalled ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">Installed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">Not Installed</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting || !wallet.isInstalled}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  wallet.isInstalled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Connect {wallet.name}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Disconnect Button */}
        {isConnected && (
          <div className="flex justify-center">
            <button
              onClick={handleDisconnect}
              disabled={isConnecting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Disconnect Wallet
            </button>
          </div>
        )}

        {/* Error Display */}
        {connectionError && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <h4 className="font-medium text-red-400">Connection Error</h4>
                <p className="text-red-300 text-sm">{connectionError}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="font-medium text-white mb-2">Debug Information</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>MetaMask: {isMetaMaskInstalled() ? 'Installed' : 'Not Installed'}</div>
            <div>Keplr: {isKeplrInstalled() ? 'Installed' : 'Not Installed'}</div>
            <div>Phantom: {isPhantomInstalled() ? 'Installed' : 'Not Installed'}</div>
            <div>Coinbase Wallet: {isCoinbaseWalletInstalled() ? 'Installed' : 'Not Installed'}</div>
            <div>Brave Wallet: {isBraveWalletInstalled() ? 'Installed' : 'Not Installed'}</div>
            <div>Is Connecting: {isConnecting ? 'Yes' : 'No'}</div>
            <div>Is Connected: {isConnected ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTest;
