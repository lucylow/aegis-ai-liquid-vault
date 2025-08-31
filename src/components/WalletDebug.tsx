import React, { useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletDebug = () => {
  const { 
    isMetaMaskInstalled,
    isKeplrInstalled,
    isPhantomInstalled,
    isCoinbaseWalletInstalled,
    isBraveWalletInstalled,
    connect,
    isConnecting,
    connectionError,
    clearError
  } = useWallet();

  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [isTesting, setIsTesting] = useState(false);

  const walletTests = [
    { id: 'metamask', name: 'MetaMask', test: isMetaMaskInstalled },
    { id: 'keplr', name: 'Keplr', test: isKeplrInstalled },
    { id: 'phantom', name: 'Phantom', test: isPhantomInstalled },
    { id: 'coinbase', name: 'Coinbase Wallet', test: isCoinbaseWalletInstalled },
    { id: 'brave', name: 'Brave Wallet', test: isBraveWalletInstalled },
  ];

  const runWalletTests = () => {
    setIsTesting(true);
    const results: {[key: string]: boolean} = {};
    
    walletTests.forEach(wallet => {
      try {
        results[wallet.id] = wallet.test();
      } catch (error) {
        console.error(`Error testing ${wallet.name}:`, error);
        results[wallet.id] = false;
      }
    });
    
    setTestResults(results);
    setIsTesting(false);
  };

  const testConnection = async (walletId: string) => {
    try {
      console.log(`Testing connection to ${walletId}...`);
      await connect(walletId);
      console.log(`Successfully connected to ${walletId}`);
    } catch (error) {
      console.error(`Failed to connect to ${walletId}:`, error);
    }
  };

  const getWalletStatusIcon = (isInstalled: boolean) => {
    return isInstalled ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getWalletStatusColor = (isInstalled: boolean) => {
    return isInstalled ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Wallet Connection Debug</h2>
        
        {/* Test Results */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={runWalletTests}
              disabled={isTesting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isTesting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isTesting ? 'Testing...' : 'Run Wallet Tests'}
            </button>
            <span className="text-sm text-gray-400">
              Click to test wallet detection
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {walletTests.map((wallet) => {
              const isInstalled = testResults[wallet.id] || false;
              return (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isInstalled
                      ? 'bg-gray-800 border-green-500/30'
                      : 'bg-gray-800/50 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {getWalletStatusIcon(isInstalled)}
                    <div>
                      <h3 className="font-medium text-white">{wallet.name}</h3>
                      <span className={`text-sm ${getWalletStatusColor(isInstalled)}`}>
                        {isInstalled ? 'Installed' : 'Not Installed'}
                      </span>
                    </div>
                  </div>
                  
                  {isInstalled && (
                    <button
                      onClick={() => testConnection(wallet.id)}
                      disabled={isConnecting}
                      className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? 'Connecting...' : `Test ${wallet.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-400" />
              <div>
                <h4 className="font-medium text-red-400">Connection Error</h4>
                <p className="text-red-300 text-sm">{connectionError}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="font-medium text-white mb-2">Debug Information</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Window object exists: {typeof window !== 'undefined' ? 'Yes' : 'No'}</div>
            <div>Ethereum object exists: {typeof window !== 'undefined' && (window as any).ethereum ? 'Yes' : 'No'}</div>
            <div>Solana object exists: {typeof window !== 'undefined' && (window as any).solana ? 'Yes' : 'No'}</div>
            <div>Keplr object exists: {typeof window !== 'undefined' && (window as any).keplr ? 'Yes' : 'No'}</div>
            <div>Is Connecting: {isConnecting ? 'Yes' : 'No'}</div>
            <div>Has Connection Error: {connectionError ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Troubleshooting Steps</h4>
          <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
            <li>Make sure you have a wallet extension installed (MetaMask, Keplr, etc.)</li>
            <li>Ensure the wallet extension is unlocked and not processing other requests</li>
            <li>Check the browser console for detailed error messages</li>
            <li>Try refreshing the page and testing again</li>
            <li>Make sure you're not in an incognito/private browsing mode</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WalletDebug;
