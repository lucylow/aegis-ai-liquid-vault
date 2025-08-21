import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  TrendingUp, 
  Lock, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';
import WalletConnect from '../components/WalletConnect';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'AI-Shielded Liquidity',
      description: 'Advanced AI algorithms protect your assets across all chains with real-time risk monitoring'
    },
    {
      icon: Globe,
      title: 'Cross-Chain Native',
      description: 'Deposit BTC, borrow ETH, collateralize SOL - all through ZetaChain\'s universal contracts'
    },
    {
      icon: Brain,
      title: 'Smart Credit Scoring',
      description: 'AI-powered credit assessment that adapts to market conditions and your portfolio health'
    },
    {
      icon: Zap,
      title: 'Instant Cross-Chain',
      description: 'Lightning-fast asset transfers between chains with zero bridging fees'
    },
    {
      icon: TrendingUp,
      title: 'Dynamic Rates',
      description: 'Interest rates that automatically adjust based on risk, liquidity, and market conditions'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Multi-signature governance, circuit breakers, and real-time threat detection'
    }
  ];

  const stats = [
    { label: 'Total Value Locked', value: '$2.4B+', icon: DollarSign },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Supported Chains', value: '15+', icon: Globe },
    { label: 'Security Score', value: '99.9%', icon: Shield }
  ];

  const chains = [
    { name: 'Bitcoin', color: '#f7931a' },
    { name: 'Ethereum', color: '#627eea' },
    { name: 'Solana', color: '#9945ff' },
    { name: 'Polygon', color: '#8247e5' },
    { name: 'Avalanche', color: '#e84142' },
    { name: 'Arbitrum', color: '#28a0f0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker to-dark text-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AEGIS
            </span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
              <Star size={16} />
              AI-Powered Cross-Chain Lending
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI-Shielded
              </span>
              <br />
              Liquidity Across
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                All Chains
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The first cross-chain lending platform that uses AI to protect your assets, 
              optimize your borrowing power, and provide instant liquidity across any blockchain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </div>

          {/* Chain logos */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {chains.map((chain) => (
              <div key={chain.name} className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }}></div>
                <span className="text-sm">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Aegis?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built on ZetaChain with enterprise-grade security and AI-powered risk management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Aegis transforms native assets into tokenized collateral across chains, uses AI to optimize risk parameters, 
              and distributes loans efficiently across multiple blockchains—all powered by ZetaChain's universal interoperability.
            </p>
          </div>

          {/* Interactive Demo Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">Interactive Demo</h3>
            
            {/* Step 1: Deposit BTC */}
            <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <div className="w-6 h-6 h-6 text-white font-bold">₿</div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Deposit Native BTC</h4>
                  <p className="text-gray-400">Lock native asset</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Users can deposit their native Bitcoin (BTC) directly into the Aegis protocol. The protocol locks the native asset securely on its home chain (Bitcoin network) without requiring users to swap or bridge it.
              </p>
            </div>

            {/* Step 2: Tokenize Collateral */}
            <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <div className="w-6 h-6 h-6 text-white font-bold">🪙</div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Collateral Token Creation</h4>
                  <p className="text-gray-400">Tokenize collateral</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Once the native asset is locked, Aegis creates a tokenized representation of the collateral on another blockchain. This token acts as proof of the locked asset and can be used seamlessly within the DeFi ecosystem.
              </p>
            </div>

            {/* Step 3: AI Risk Analysis */}
            <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">AI Risk Analysis</h4>
                  <p className="text-gray-400">AI-optimized risk parameters</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Aegis leverages real-time AI-powered risk analysis to assess creditworthiness and liquidation risk. The AI considers wallet history, behavioral patterns, and liquidity profiles across chains.
              </p>
            </div>

            {/* Step 4: Loan Distribution */}
            <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Loan Distribution</h4>
                  <p className="text-gray-400">Cross-chain lending</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Loans are distributed seamlessly across multiple blockchains based on collateral and AI risk assessment. Users can borrow on different chains without manual bridging.
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-primary">Key Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-400">Asset Security</h4>
                    <p className="text-gray-300 text-sm">Native assets remain on their home chain, preserving security and integrity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-400">Cross-Chain Efficiency</h4>
                    <p className="text-gray-300 text-sm">Access liquidity across multiple blockchains without manual bridging</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-400">AI Optimization</h4>
                    <p className="text-gray-300 text-sm">Dynamic risk parameters continuously optimized for safety and access</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Technical Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300">Bitcoin Network - Native BTC Locking</span>
                </div>
                <div className="w-5 h-5 text-gray-500 mx-auto">↓</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">ZetaChain - Cross-Chain Communication</span>
                </div>
                <div className="w-5 h-5 text-gray-500 mx-auto">↓</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Target Chains - Tokenized Collateral & Loans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Future of Lending?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users already benefiting from AI-shielded cross-chain liquidity
          </p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mx-auto group"
          >
            Launch App
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold">AEGIS</span>
          </div>
          <p className="mb-4">AI-Powered Cross-Chain Lending Platform</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
            <a href="#" className="hover:text-white transition-colors">Governance</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
