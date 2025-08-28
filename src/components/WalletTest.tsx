import React, { useState } from 'react';
import { Wallet, Network, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { SUPPORTED_BLOCKCHAINS, getMainnetBlockchains, getTestnetBlockchains } from '../config/blockchains';

const WalletTest: React.FC = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    chainId, 
    network, 
    balance, 
    connectionError, 
    currentBlockchain,
    connect, 
    disconnect, 
    switchToBlockchain,
    clearError 
  } = useWallet();

  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    connection: boolean;
    zetaChain: boolean;
    networkSwitch: boolean;
    balance: boolean;
  }>({
    connection: false,
    zetaChain: false,
    networkSwitch: false,
    balance: false
  });

  const mainnetBlockchains = getMainnetBlockchains();
  const testnetBlockchains = getTestnetBlockchains();

  const runConnectionTest = async () => {
    if (!isConnected) {
      try {
        await connect();
        setTestResults(prev => ({ ...prev, connection: true }));
      } catch (error) {
        console.error('Connection test failed:', error);
        setTestResults(prev => ({ ...prev, connection: false }));
      }
    } else {
      setTestResults(prev => ({ ...prev, connection: true }));
    }
  };

  const testZetaChainConnection = async () => {
    if (!isConnected) {
      setSwitchError('Please connect wallet first');
      return;
    }

    setIsSwitching(true);
    setSwitchError(null);

    try {
      // Try to switch to ZetaChain mainnet
      const zetaChain = SUPPORTED_BLOCKCHAINS.find(chain => chain.id === 'zetachain');
      if (zetaChain) {
        await switchToBlockchain(zetaChain);
        setTestResults(prev => ({ ...prev, zetaChain: true }));
        console.log('Successfully connected to ZetaChain');
      }
    } catch (error: any) {
      console.error('ZetaChain connection test failed:', error);
      setSwitchError(error.message || 'Failed to connect to ZetaChain');
      setTestResults(prev => ({ ...prev, zetaChain: false }));
    } finally {
      setIsSwitching(false);
    }
  };

  const testNetworkSwitch = async (blockchain: any) => {
    if (!isConnected) {
      setSwitchError('Please connect wallet first');
      return;
    }

    setIsSwitching(true);
    setSwitchError(null);

    try {
      await switchToBlockchain(blockchain);
      setTestResults(prev => ({ ...prev, networkSwitch: true }));
      console.log(`Successfully switched to ${blockchain.name}`);
    } catch (error: any) {
      console.error('Network switch test failed:', error);
      setSwitchError(error.message || 'Failed to switch network');
      setTestResults(prev => ({ ...prev, networkSwitch: false }));
    } finally {
      setIsSwitching(false);
    }
  };

  const runAllTests = async () => {
    setTestResults({
      connection: false,
      zetaChain: false,
      networkSwitch: false,
      balance: false
    });

    // Test 1: Connection
    await runConnectionTest();

    // Test 2: ZetaChain connection
    if (isConnected) {
      await testZetaChainConnection();
    }

    // Test 3: Network switching
    if (isConnected) {
      const ethereum = SUPPORTED_BLOCKCHAINS.find(chain => chain.id === 'ethereum');
      if (ethereum) {
        await testNetworkSwitch(ethereum);
      }
    }

    // Test 4: Balance check
    if (isConnected && balance) {
      setTestResults(prev => ({ ...prev, balance: true }));
    }
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Wallet Connection & Blockchain Switching Test</h1>
      
      {/* Current Status */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Current Wallet Status
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {isConnected ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600">Connected</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">
              {chainId ? `Chain ${chainId}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Chain ID</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">
              {network || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Network</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">
              {balance ? `${balance} ETH` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Balance</div>
          </div>
        </div>

        {address && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">Address:</div>
            <div className="font-mono text-sm bg-gray-100 p-2 rounded">
              {address}
            </div>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={runAllTests}
          disabled={isConnecting || isSwitching}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Run All Tests
        </button>

        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Disconnect
          </button>
        )}

        <button
          onClick={testZetaChainConnection}
          disabled={!isConnected || isSwitching}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSwitching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Network className="w-5 h-5" />}
          Test ZetaChain
        </button>
      </div>

      {/* Test Results */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Test Results
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Wallet Connection</span>
            {getTestStatusIcon(testResults.connection)}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">ZetaChain Connection</span>
            {getTestStatusIcon(testResults.zetaChain)}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Network Switching</span>
            {getTestStatusIcon(testResults.networkSwitch)}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Balance Retrieval</span>
            {getTestStatusIcon(testResults.balance)}
          </div>
        </div>
      </div>

      {/* Blockchain List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mainnet Blockchains */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">Mainnet Networks</h3>
          <div className="space-y-2">
            {mainnetBlockchains.map((blockchain) => (
              <button
                key={blockchain.id}
                onClick={() => testNetworkSwitch(blockchain)}
                disabled={!isConnected || isSwitching}
                className={`w-full p-3 rounded-lg border transition-colors text-left ${
                  currentBlockchain?.id === blockchain.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{blockchain.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{blockchain.name}</div>
                    <div className="text-sm text-gray-600">
                      Chain ID: {blockchain.chainId} • {blockchain.nativeCurrency.symbol}
                    </div>
                  </div>
                  {currentBlockchain?.id === blockchain.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Testnet Blockchains */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-600">Testnet Networks</h3>
          <div className="space-y-2">
            {testnetBlockchains.map((blockchain) => (
              <button
                key={blockchain.id}
                onClick={() => testNetworkSwitch(blockchain)}
                disabled={!isConnected || isSwitching}
                className={`w-full p-3 rounded-lg border transition-colors text-left ${
                  currentBlockchain?.id === blockchain.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{blockchain.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{blockchain.name}</div>
                    <div className="text-sm text-gray-600">
                      Chain ID: {blockchain.chainId} • {blockchain.nativeCurrency.symbol}
                    </div>
                  </div>
                  {currentBlockchain?.id === blockchain.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(connectionError || switchError) && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Errors:</h3>
          {connectionError && (
            <div className="text-red-700 mb-2">
              <strong>Connection Error:</strong> {connectionError}
            </div>
          )}
          {switchError && (
            <div className="text-red-700 mb-2">
              <strong>Switch Error:</strong> {switchError}
            </div>
          )}
          <button
            onClick={() => { clearError(); setSwitchError(null); }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Clear Errors
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
          <li>Click "Connect Wallet" to connect your MetaMask</li>
          <li>Click "Run All Tests" to perform comprehensive testing</li>
          <li>Test ZetaChain connection specifically</li>
          <li>Try switching between different networks</li>
          <li>Check that all test results show green checkmarks</li>
        </ol>
      </div>
    </div>
  );
};

export default WalletTest;
