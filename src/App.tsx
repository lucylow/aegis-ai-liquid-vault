import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';

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
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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