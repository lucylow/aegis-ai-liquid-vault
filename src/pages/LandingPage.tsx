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
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple 3-step process to access cross-chain liquidity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Deposit</h3>
              <p className="text-gray-400">
                Connect your wallet and deposit any supported asset as collateral across multiple chains
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Assessment</h3>
              <p className="text-gray-400">
                Our AI analyzes your portfolio and provides optimal borrowing power and rates
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Borrow Instantly</h3>
              <p className="text-gray-400">
                Borrow any supported asset on any chain with real-time risk monitoring
              </p>
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
