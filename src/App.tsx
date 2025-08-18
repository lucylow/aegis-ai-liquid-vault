import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';
import { usePortfolio } from './hooks/usePortfolio';
import { useAI } from './hooks/useAI';

// Portfolio Overview Component
const PortfolioOverview: React.FC = () => {
  const { portfolio, positions, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="p-6 bg-white/10 rounded-xl border border-white/20">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/20 rounded-xl border border-red-500/30">
        <div className="text-red-400 text-center">
          <p className="font-medium">Error loading portfolio</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="p-6 bg-white/10 rounded-xl border border-white/20">
        <div className="text-center text-white/60">
          <p>No portfolio data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/10 rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold mb-4">Portfolio Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">${portfolio.totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-300">Total Value</div>
        </div>
        <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">${portfolio.totalPnl.toLocaleString()}</div>
          <div className="text-sm text-blue-300">Total P&L</div>
        </div>
        <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{portfolio.chains.length}</div>
          <div className="text-sm text-purple-300">Chains</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium text-white/80">Positions</h4>
        {positions.map((position, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {position.asset.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{position.asset}</div>
                <div className="text-sm text-white/60">{position.chain}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${position.value.toLocaleString()}</div>
              <div className={`text-sm ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Insights Component
const AIInsights: React.FC = () => {
  const { insights, alerts, loading, error } = useAI();

  if (loading) {
    return (
      <div className="p-6 bg-white/10 rounded-xl border border-white/20">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/20 rounded-xl border border-red-500/30">
        <div className="text-red-400 text-center">
          <p className="font-medium">Error loading AI insights</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/10 rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold mb-4">AI Insights & Security</h3>
      
      {insights && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="font-medium">Risk Assessment</span>
            <span className="ml-auto text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
              Score: {insights.riskScore}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-white/80">Recommendations:</h4>
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="text-sm text-white/70 bg-white/5 p-2 rounded">
                • {rec}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80">Threats:</h4>
            {insights.threats.map((threat, index) => (
              <div key={index} className={`text-sm p-2 rounded ${
                threat.level === 'high' ? 'bg-red-500/20 text-red-400' :
                threat.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {threat.level.toUpperCase()}: {threat.description}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {alerts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-3">Security Alerts:</h4>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`text-sm p-3 rounded ${
                alert.type === 'error' ? 'bg-red-500/20 text-red-400' :
                alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                alert.type === 'success' ? 'bg-green-500/20 text-green-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'error' ? 'bg-red-400' :
                    alert.type === 'warning' ? 'bg-yellow-400' :
                    alert.type === 'success' ? 'bg-green-400' :
                    'bg-blue-400'
                  }`}></div>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-dark text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 14H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold">Aegis AI</h1>
              </div>
              
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Intelligent Security & Cross-Chain Management</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience the future of AI-powered DeFi security with our advanced multi-agent system. 
                Monitor threats, manage cross-chain operations, and optimize your portfolio with intelligent automation.
              </p>
            </div>

            {/* Portfolio and AI Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioOverview />
              <AIInsights />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Security</h3>
                <p className="text-white/70">24/7 threat detection and automated protective measures using advanced AI agents.</p>
              </div>

              <div className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cross-Chain Operations</h3>
                <p className="text-white/70">Seamless asset management across multiple blockchain networks with intelligent optimization.</p>
              </div>

              <div className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Portfolio Management</h3>
                <p className="text-white/70">Real-time monitoring, risk assessment, and AI-driven optimization recommendations.</p>
              </div>
            </div>

            {/* System Status */}
            <div className="p-6 bg-white/10 rounded-xl border border-white/20">
              <h3 className="text-xl font-semibold mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-400">AI Agents</span>
                  </div>
                  <p className="text-sm text-white/80">All systems operational</p>
                </div>
                
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-400">Security</span>
                  </div>
                  <p className="text-sm text-white/80">Threat level: Low</p>
                </div>
                
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-400">Cross-Chain</span>
                  </div>
                  <p className="text-sm text-white/80">Connected to 5 networks</p>
                </div>
                
                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-400">Performance</span>
                  </div>
                  <p className="text-sm text-white/80">99.9% uptime</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </WalletProvider>
  );
}

export default App; 