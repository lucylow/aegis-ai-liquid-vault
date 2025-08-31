import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { getActiveBlockchains, BlockchainConfig } from '../../config/blockchains';

interface ChainSelectorProps {
  className?: string;
  showTestnets?: boolean;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ 
  className = '', 
  showTestnets = false 
}) => {
  const { currentBlockchain, switchToBlockchain, isConnected } = useWallet();
  
  const activeChains = getActiveBlockchains().filter(chain => 
    showTestnets ? true : !chain.isTestnet
  );

  const handleChainSwitch = async (blockchain: BlockchainConfig) => {
    if (!isConnected) return;
    
    try {
      await switchToBlockchain(blockchain);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  return (
    <div className={`chain-selector ${className}`}>
      <div className="flex flex-wrap gap-3">
        {activeChains.map(chain => (
          <button
            key={chain.id}
            onClick={() => handleChainSwitch(chain)}
            disabled={!isConnected}
            className={`
              chain-btn flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium
              ${currentBlockchain.id === chain.id 
                ? 'border-blue-400 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/25 backdrop-blur-sm' 
                : 'border-white/20 bg-white/10 text-gray-200 hover:border-white/30 hover:bg-white/15 hover:text-white hover:shadow-lg hover:shadow-white/10'
              }
              ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={`Switch to ${chain.name}`}
          >
            <span className="text-xl">{chain.icon}</span>
            <span className="font-semibold">{chain.name}</span>
            {chain.isTestnet && (
              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30 font-medium">
                TEST
              </span>
            )}
          </button>
        ))}
      </div>
      
      {!isConnected && (
        <p className="text-sm text-gray-400 mt-4 text-center bg-white/5 px-4 py-3 rounded-lg border border-white/10">
          Connect your wallet to switch chains
        </p>
      )}
    </div>
  );
};

export default ChainSelector;
