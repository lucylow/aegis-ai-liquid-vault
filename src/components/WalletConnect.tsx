import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, ExternalLink } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { address, isConnected, isConnecting, balance, chainId, connect, disconnect, switchNetwork } = useWallet();

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
          <div className="text-xs text-white/60 flex items-center gap-2">
            <span>{getNetworkName(chainId)}</span>
            <button
              onClick={() => {
                const newChainId = chainId === '0x1' ? '0x89' : '0x1';
                switchNetwork(newChainId);
              }}
              className="text-blue-400 hover:text-blue-300 text-xs underline"
            >
              Switch Network
            </button>
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
        <div className="text-xs text-white/60 mt-1">
          <span className="text-yellow-400">⚠️ Only MetaMask is supported</span>
        </div>
        <div className="text-xs text-white/60 mt-1">
          Don't have MetaMask? <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
          >
            Download here <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect MetaMask
          </>
        )}
      </button>
    </div>
  );
};

export default WalletConnect;
