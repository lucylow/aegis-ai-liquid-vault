import React, { useState } from 'react';
import ChainSelector from './ui/ChainSelector';
import MultiChainPortfolio from './MultiChainPortfolio';
import CrossChainTxTracker from './CrossChainTxTracker';
import { useWallet } from '../contexts/WalletContext';
import { getActiveBlockchains, getMainnetBlockchains, getTestnetBlockchains } from '../config/blockchains';

interface MultiChainDashboardProps {
  className?: string;
}

const MultiChainDashboard: React.FC<MultiChainDashboardProps> = ({ className = '' }) => {
  const { isConnected, currentBlockchain } = useWallet();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'overview'>('overview');
  const [showTestnets, setShowTestnets] = useState(false);

  const activeChains = getActiveBlockchains().filter(chain => 
    showTestnets ? true : !chain.isTestnet
  );
  const mainnetChains = getMainnetBlockchains();
  const testnetChains = getTestnetBlockchains();

  const renderOverview = () => (
    <div className="overview-section space-y-6">
      {/* Chain Status Overview */}
      <div className="chain-status-overview">
        <h3 className="text-xl font-semibold text-white mb-6">Blockchain Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChains.map(chain => (
            <div key={chain.id} className="chain-status-card p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{chain.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{chain.name}</h4>
                    <p className="text-blue-200 text-sm">Chain ID: {chain.chainId}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${
                  chain.isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                }`}></div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Native Token:</span>
                  <span className="font-semibold text-white">{chain.nativeCurrency.symbol}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Gas Token:</span>
                  <span className="font-semibold text-white">{chain.gasToken}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Type:</span>
                  <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                    chain.isTestnet 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {chain.isTestnet ? 'Testnet' : 'Mainnet'}
                  </span>
                </div>
              </div>

              {chain.isActive && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-xs text-blue-200 mb-3 font-medium">Estimated Gas Costs</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-gray-300">Deposit:</span>
                      <span className="text-white font-medium ml-1">{chain.estimatedGas.deposit} {chain.gasToken}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-gray-300">Borrow:</span>
                      <span className="text-white font-medium ml-1">{chain.estimatedGas.borrow} {chain.gasToken}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-gray-300">Repay:</span>
                      <span className="text-white font-medium ml-1">{chain.estimatedGas.repay} {chain.gasToken}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-gray-300">Liquidate:</span>
                      <span className="text-white font-medium ml-1">{chain.estimatedGas.liquidation} {chain.gasToken}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="quick-action-btn p-6 border border-blue-500/30 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 text-left backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/25">
            <div className="text-3xl mb-3">💱</div>
            <h4 className="font-semibold text-white text-lg mb-2">Cross-Chain Swap</h4>
            <p className="text-blue-200">Swap assets between different blockchains</p>
          </button>
          
          <button className="quick-action-btn p-6 border border-green-500/30 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 text-left backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/25">
            <div className="text-3xl mb-3">🏦</div>
            <h4 className="font-semibold text-white text-lg mb-2">Multi-Chain Lending</h4>
            <p className="text-green-200">Borrow against collateral on any chain</p>
          </button>
          
          <button className="quick-action-btn p-6 border border-purple-500/30 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 text-left backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/25">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold text-white text-lg mb-2">Security Settings</h4>
            <p className="text-purple-200">Configure cross-chain security policies</p>
          </button>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="network-statistics">
        <h3 className="text-xl font-semibold text-white mb-6">Network Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stat-card p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm shadow-lg">
            <div className="text-3xl font-bold text-blue-300 mb-2">{mainnetChains.length}</div>
            <div className="text-blue-200 font-medium">Mainnet Chains</div>
          </div>
          
          <div className="stat-card p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm shadow-lg">
            <div className="text-3xl font-bold text-green-300 mb-2">{testnetChains.length}</div>
            <div className="text-green-200 font-medium">Testnet Chains</div>
          </div>
          
          <div className="stat-card p-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm shadow-lg">
            <div className="text-3xl font-bold text-purple-300 mb-2">{activeChains.length}</div>
            <div className="text-purple-200 font-medium">Active Chains</div>
          </div>
          
          <div className="stat-card p-6 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/30 backdrop-blur-sm shadow-lg">
            <div className="text-3xl font-bold text-orange-300 mb-2">24/7</div>
            <div className="text-orange-200 font-medium">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="dashboard-tabs mb-8">
      <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'portfolio', label: 'Portfolio', icon: '💼' },
          { key: 'transactions', label: 'Transactions', icon: '📋' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === key
                ? 'bg-white/20 text-white shadow-lg shadow-white/20 border border-white/30'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className={`multi-chain-dashboard ${className} min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6`}>
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔗</div>
          <h2 className="text-4xl font-bold text-white mb-4">Multi-Chain Dashboard</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Connect your wallet to access the full multi-chain experience with AI-powered security and cross-chain asset management
          </p>
          <div className="max-w-md mx-auto">
            <ChainSelector className="mb-6" />
            <p className="text-sm text-gray-300">
              Support for Ethereum, ZetaChain, Solana, Bitcoin, Base, and Avalanche
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`multi-chain-dashboard ${className} min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6`}>
      {/* Header */}
      <div className="dashboard-header mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Multi-Chain Dashboard</h1>
            <p className="text-blue-200 text-lg">
              Currently connected to <span className="font-semibold text-white">{currentBlockchain.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <input
                type="checkbox"
                checked={showTestnets}
                onChange={(e) => setShowTestnets(e.target.checked)}
                className="rounded border-white/30 bg-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              Show Testnets
            </label>
          </div>
        </div>

        {/* Chain Selector */}
        <ChainSelector className="mb-8" showTestnets={showTestnets} />
      </div>

      {/* Tabs */}
      {renderTabs()}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'portfolio' && <MultiChainPortfolio showTestnets={showTestnets} />}
        {activeTab === 'transactions' && <CrossChainTxTracker />}
      </div>

      {/* Footer */}
      <div className="dashboard-footer mt-16 pt-8 border-t border-white/20">
        <div className="text-center text-sm text-gray-300">
          <p className="text-white font-medium">Powered by AEGIS AI • Multi-Chain Security & Asset Management</p>
          <p className="mt-2">
            Supporting {activeChains.length} blockchain{activeChains.length !== 1 ? 's' : ''} • 
            Real-time monitoring • AI-powered risk assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiChainDashboard;
