import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnect: React.FC = () => {
  const { address, isConnected, isConnecting, balance, chainId, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon',
      '0xa': 'Optimism',
      '0xa4b1': 'Arbitrum One',
      '0x38': 'BSC',
      '0x137': 'Polygon Mumbai',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
    };
    return networks[chainId] || `Chain ID: ${parseInt(chainId, 16)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400 font-medium">Connected</span>
          </div>
          <div className="text-sm text-white/80">
            {formatAddress(address)}
          </div>
          {chainId && (
            <div className="text-xs text-white/60">
              {getNetworkName(chainId)}
            </div>
          )}
        </div>
        
        {balance && (
          <div className="text-right">
            <div className="text-sm font-medium text-white">
              {balance} ETH
            </div>
            <div className="text-xs text-white/60">Balance</div>
          </div>
        )}
        
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-sm text-red-400 font-medium">Not Connected</span>
        </div>
        <div className="text-sm text-white/80">
          Connect your MetaMask wallet to continue
        </div>
      </div>
      
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 14H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    </div>
  );
};

export default WalletConnect;
