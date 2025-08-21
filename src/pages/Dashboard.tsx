import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  X, 
  ChevronDown, 
  ExternalLink,
  Activity,
  CreditCard,
  Coins,
  BarChart3,
  Settings,
  Bell,
  RefreshCw,
  Brain,
  MessageSquare,
  Zap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Gauge,
  DollarSign,
  Clock,
  Target,
  Globe
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

// Enhanced mock wallet data with more realistic details
const mockWallets = [
  { 
    id: '1',
    name: 'MetaMask', 
    chain: 'Ethereum', 
    address: '0x2095...28b3',
    fullAddress: '0x2095a8f7c8d9e2f1a3b4c5d6e7f8a9b0c1d2e3f4',
    balance: 0.0020,
    nativeToken: 'ETH',
    status: 'connected',
    icon: '🦊',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: '2',
    name: 'Phantom', 
    chain: 'Solana', 
    address: '5D4Xz...wqEr',
    fullAddress: '5D4Xz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRq',
    balance: 15.8,
    nativeToken: 'SOL',
    status: 'connected',
    icon: '👻',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: '3',
    name: 'WalletConnect', 
    chain: 'Avalanche', 
    address: '0xaBcD...789F',
    fullAddress: '0xaBcD8ba1f109551bD432803012645Hac136c772c3c7c',
    balance: 125.5,
    nativeToken: 'AVAX',
    status: 'connected',
    icon: '🔗',
    color: 'from-red-500 to-red-600'
  },
  { 
    id: '4',
    name: 'BTC Wallet', 
    chain: 'Bitcoin', 
    address: 'bc1qxyz...',
    fullAddress: 'bc1qxyz123456789abcdefghijklmnopqrstuvwxyz',
    balance: 0.0085,
    nativeToken: 'BTC',
    status: 'disconnected',
    icon: '₿',
    color: 'from-orange-500 to-orange-600'
  }
];

// Enhanced portfolio data with per-chain breakdowns
const mockPortfolio = {
  depositedCollateral: {
    Ethereum: { amount: 5000, change24h: 2.3, apy: 8.2 },
    Avalanche: { amount: 2500, change24h: -1.2, apy: 9.1 },
    Solana: { amount: 1200, change24h: 5.7, apy: 7.8 },
    Bitcoin: { amount: 0.8, change24h: 3.1, apy: 6.5 }
  },
  outstandingLoans: {
    Ethereum: { amount: 1200, interestRate: 12.5, dueDate: '2025-10-15' },
    Avalanche: { amount: 800, interestRate: 14.2, dueDate: '2025-09-30' },
    Solana: { amount: 400, interestRate: 13.8, dueDate: '2025-11-05' }
  },
  totalCollateralUSD: 8700,
  totalLoansUSD: 2400,
  borrowingPowerUSD: 5000,
  utilizationPercent: 48,
  creditScore: 78,
  liquidationRiskPercent: 22,
  netWorthUSD: 6300,
  availableCreditUSD: 2600
};

// Enhanced activity feed with more details
const mockActivityFeed = [
  { 
    id: 1, 
    type: 'Deposit', 
    chain: 'Ethereum', 
    asset: 'USDC', 
    amount: 1000, 
    usdValue: 1000,
    timestamp: '2025-08-20 14:36',
    status: 'confirmed',
    txHash: '0x1234...5678',
    icon: '⬇️'
  },
  { 
    id: 2, 
    type: 'Borrow', 
    chain: 'Avalanche', 
    asset: 'USDC', 
    amount: 500, 
    usdValue: 500,
    timestamp: '2025-08-19 11:15',
    status: 'confirmed',
    txHash: '0xabcd...efgh',
    icon: '⬆️'
  },
  { 
    id: 3, 
    type: 'Repay', 
    chain: 'Ethereum', 
    asset: 'ZETA', 
    amount: 300, 
    usdValue: 450,
    timestamp: '2025-08-18 09:42',
    status: 'confirmed',
    txHash: '0x9876...5432',
    icon: '💳'
  },
  { 
    id: 4, 
    type: 'Liquidation Warning', 
    chain: 'Solana', 
    asset: 'SOL', 
    amount: 25, 
    usdValue: 1800,
    timestamp: '2025-08-17 16:20',
    status: 'warning',
    txHash: '0xdef0...1234',
    icon: '⚠️'
  }
];

export const WalletDashboardPage: React.FC = () => {
  const [connectedWallets, setConnectedWallets] = useState<typeof mockWallets>([]);
  const [selectedWallet, setSelectedWallet] = useState<typeof mockWallets[0] | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletsPopup, setShowWalletsPopup] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize with some connected wallets
  useEffect(() => {
    setConnectedWallets(mockWallets.filter(w => w.status === 'connected'));
    setSelectedWallet(mockWallets[0]);
  }, []);

  const connectWallet = (wallet: typeof mockWallets[0]) => {
    if (!connectedWallets.find(w => w.id === wallet.id)) {
      const updatedWallet = { ...wallet, status: 'connected' as const };
      setConnectedWallets([...connectedWallets, updatedWallet]);
      setSelectedWallet(updatedWallet);
    }
    setShowWalletModal(false);
  };

  const disconnectWallet = (walletId: string) => {
    setConnectedWallets(connectedWallets.filter(w => w.id !== walletId));
    if (selectedWallet?.id === walletId) {
      setSelectedWallet(connectedWallets[0] || null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-gray-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'Deposit': return 'text-green-500';
      case 'Borrow': return 'text-blue-500';
      case 'Repay': return 'text-purple-500';
      case 'Liquidation Warning': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header with Notifications */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Aegis Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                {notifications}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => setShowWalletsPopup(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>Connected Wallets ({connectedWallets.length})</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span onClick={() => setShowWalletModal(true)}>Add Wallet</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'ai-dashboard', label: 'AI Dashboard', icon: Brain },
            { id: 'ai-risk', label: 'AI Risk Management', icon: Shield },
            { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors capitalize flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Portfolio Summary Cards */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Globe className="w-6 h-6 text-blue-500" />
                <span>Cross-Chain Portfolio Overview</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-blue-400" />
                    <span className="text-sm text-blue-400">+2.3%</span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-2">Total Collateral</h3>
                  <p className="text-2xl font-bold">${mockPortfolio.totalCollateralUSD.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="w-8 h-8 text-purple-400" />
                    <span className="text-sm text-purple-400">Active</span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-2">Outstanding Loans</h3>
                  <p className="text-2xl font-bold">${mockPortfolio.totalLoansUSD.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <span className="text-sm text-green-400">{mockPortfolio.utilizationPercent}%</span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-2">Borrowing Power</h3>
                  <p className="text-2xl font-bold">${mockPortfolio.borrowingPowerUSD.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8 text-orange-400" />
                    <span className="text-sm text-orange-400">Good</span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-2">Credit Score</h3>
                  <p className="text-2xl font-bold">{mockPortfolio.creditScore}</p>
                </div>
              </div>
            </section>

            {/* Risk Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Risk Assessment</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-400" />
                    AI Credit Score
                  </h3>
                  <div className="text-center">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-700"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(mockPortfolio.creditScore / 100) * 352} 352`}
                          className="text-blue-500 transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{mockPortfolio.creditScore}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mt-2">Good Credit Standing</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Liquidation Risk
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Current Risk</span>
                        <span className="text-red-400">{mockPortfolio.liquidationRiskPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${mockPortfolio.liquidationRiskPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Net Worth</p>
                        <p className="text-lg font-semibold">${mockPortfolio.netWorthUSD.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm text-gray-400">Available Credit</p>
                        <p className="text-lg font-semibold">${mockPortfolio.availableCreditUSD.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cross-Chain Summary */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Globe className="w-6 h-6 text-purple-500" />
                <span>Cross-Chain Activity</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <Coins className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold">Chains Active</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">5</p>
                  <p className="text-sm text-gray-400 mt-2">Ethereum, Bitcoin, Solana, Avalanche, ZetaChain</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold">Cross-Chain Loans</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-400">3</p>
                  <p className="text-sm text-gray-400 mt-2">Active across multiple chains</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold">Omnichain Security</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">100%</p>
                  <p className="text-sm text-gray-400 mt-2">Protected by ZetaChain</p>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {mockActivityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg`}>
                            {activity.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{activity.type}</span>
                              <span className="text-sm text-gray-400">{activity.amount} {activity.asset}</span>
                              <span className="text-xs bg-gray-600 px-2 py-1 rounded">on {activity.chain}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{activity.timestamp}</span>
                              <span>•</span>
                              <span className={`${getActivityIconColor(activity.type)}`}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${activity.usdValue.toLocaleString()}</p>
                          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            View TX
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'ai-dashboard' && (
          <AIDashboardTab />
        )}

        {activeTab === 'ai-risk' && (
          <AIRiskTab />
        )}


        {/* Connected Wallets Popup */}
        {showWalletsPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">Connected Wallets</h3>
                  <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                    {connectedWallets.length} active
                  </span>
                </div>
                <button 
                  onClick={() => setShowWalletsPopup(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Connected Wallets List */}
              <div className="space-y-3 mb-6">
                {connectedWallets.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-4 bg-gray-700/60 rounded-lg hover:bg-gray-700/80 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center text-white text-lg font-medium`}>
                        {wallet.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-medium text-white truncate">{wallet.name}</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusBgColor(wallet.status)} flex-shrink-0`}></div>
                        </div>
                        <div className="text-sm text-gray-400 truncate">{wallet.address}</div>
                        <div className="text-sm text-gray-300">
                          {wallet.balance.toFixed(4)} {wallet.nativeToken}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
                        Switch
                      </button>
                      <button 
                        onClick={() => disconnectWallet(wallet.id)}
                        className="text-sm bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
                
                {connectedWallets.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No wallets connected</p>
                  </div>
                )}
              </div>
              
              {/* Add Wallet Button */}
              <button 
                onClick={() => {
                  setShowWalletsPopup(false);
                  setShowWalletModal(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Connect New Wallet</span>
              </button>
            </div>
          </div>
        )}

        {/* Wallet Connection Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Connect Wallet</h3>
                <button 
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                {mockWallets.filter(w => w.status === 'disconnected').map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => connectWallet(wallet)}
                    className="w-full flex items-center space-x-4 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center text-white text-lg`}>
                      {wallet.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{wallet.name}</p>
                      <p className="text-sm text-gray-400">{wallet.chain}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Dashboard Tab Component
const AIDashboardTab: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serviceHealth, setServiceHealth] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  interface AIInsight {
    id: string;
    type: 'credit' | 'risk' | 'recommendation' | 'analysis';
    title: string;
    content: string;
    timestamp: string;
    status: 'loading' | 'success' | 'error';
  }

  useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    try {
      const health = await geminiService.healthCheck();
      setServiceHealth('healthy');
    } catch (error) {
      setServiceHealth('unhealthy');
      console.error('Service health check failed:', error);
    }
  };

  const addInsight = (insight: Omit<AIInsight, 'id' | 'timestamp'>) => {
    const newInsight: AIInsight = {
      ...insight,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setInsights(prev => [newInsight, ...prev]);
  };

  const generateCreditScore = async () => {
    setIsGenerating(true);
    addInsight({
      type: 'credit',
      title: 'AI Credit Score Analysis',
      content: 'Analyzing your lending profile...',
      status: 'loading'
    });

    try {
      const mockUserData = {
        userAddress: '0x1234...5678',
        transactionHistory: [
          { type: 'deposit', amount: 5000, chain: 'Ethereum', timestamp: '2025-01-15' },
          { type: 'borrow', amount: 2000, chain: 'Avalanche', timestamp: '2025-01-10' },
          { type: 'repay', amount: 1500, chain: 'Ethereum', timestamp: '2025-01-05' }
        ],
        collateralValue: 8000,
        loanAmount: 2000,
        chain: 'Multiple'
      };

      const creditScore = await geminiService.getCreditScore(
        mockUserData.userAddress,
        mockUserData.transactionHistory,
        mockUserData.collateralValue,
        mockUserData.loanAmount,
        mockUserData.chain
      );

      setInsights(prev => prev.map(i => 
        i.title === 'AI Credit Score Analysis' 
          ? {
              ...i,
              content: `Credit Score: ${creditScore.creditAnalysis.creditScore}/100\nRisk Level: ${creditScore.creditAnalysis.riskLevel}\nMax Loan: $${creditScore.creditAnalysis.maxLoanAmount.toLocaleString()}`,
              status: 'success'
            }
          : i
      ));
    } catch (error) {
      setInsights(prev => prev.map(i => 
        i.title === 'AI Credit Score Analysis' 
          ? { ...i, content: 'Failed to generate credit score', status: 'error' }
          : i
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    addInsight({
      type: 'analysis',
      title: 'AI Content Generation',
      content: 'Generating content...',
      status: 'loading'
    });

    try {
      const response = await geminiService.generateContent(prompt);
      setGeneratedText(response.generatedText);
      
      setInsights(prev => prev.map(i => 
        i.title === 'AI Content Generation' 
          ? { ...i, content: response.generatedText, status: 'success' }
          : i
      ));
    } catch (error) {
      setInsights(prev => prev.map(i => 
        i.title === 'AI Content Generation' 
          ? { ...i, content: 'Failed to generate content', status: 'error' }
          : i
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Insights
          </h2>
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Leverage advanced AI to analyze your portfolio, assess risks, and get personalized recommendations
        </p>
      </div>

      {/* Service Status */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${serviceHealth === 'healthy' ? 'bg-green-500' : serviceHealth === 'checking' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="text-lg font-semibold">AI Service Status</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${serviceHealth === 'healthy' ? 'text-green-400' : serviceHealth === 'checking' ? 'text-yellow-400' : 'text-red-400'}`}>
              {serviceHealth === 'healthy' ? 'Healthy' : serviceHealth === 'checking' ? 'Checking...' : 'Unhealthy'}
            </span>
            <button 
              onClick={checkServiceHealth}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* AI Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Credit Score Analysis</span>
          </h3>
          <p className="text-gray-400 mb-4">
            Get AI-powered credit scoring based on your lending history and portfolio
          </p>
          <button 
            onClick={generateCreditScore}
            disabled={isGenerating || serviceHealth !== 'healthy'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Generate Credit Score</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            <span>Content Generation</span>
          </h3>
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI to analyze your portfolio, generate reports, or provide insights..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <button 
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim() || serviceHealth !== 'healthy'}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>AI Insights & Analysis</span>
          </h3>
        </div>
        <div className="p-6">
          {insights.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No AI insights yet</p>
              <p className="text-sm">Use the tools above to generate AI-powered analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      {insight.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                      {insight.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {insight.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                      <span className="text-xs text-gray-400">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-300 whitespace-pre-line">{insight.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// AI Risk Management Tab Component
const AIRiskTab: React.FC = () => {
  const [creditScore, setCreditScore] = useState<any>(null);
  const [liquidationRisk, setLiquidationRisk] = useState<any>(null);
  const [interestRate, setInterestRate] = useState<any>(null);
  const [portfolioRisk, setPortfolioRisk] = useState<any>(null);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock portfolio data for demonstration
  const mockPortfolio = {
    assets: [
      { symbol: 'ETH', value: 5000, chain: 'ethereum', volatility: 0.25 },
      { symbol: 'BTC', value: 3000, chain: 'bitcoin', volatility: 0.20 },
      { symbol: 'SOL', value: 2000, chain: 'solana', volatility: 0.35 },
      { symbol: 'AVAX', value: 1500, chain: 'avalanche', volatility: 0.30 }
    ],
    totalValue: 11500,
    loans: [
      { asset: 'USDC', amount: 3000, interestRate: 0.045, collateralRatio: 0.75 },
      { asset: 'ZETA', amount: 1500, interestRate: 0.052, collateralRatio: 0.80 }
    ],
    userHistory: {
      totalBorrows: 20,
      onTimeRepayments: 18,
      lateRepayments: 2,
      liquidations: 0,
      avgLoanDuration: 45
    }
  };

  useEffect(() => {
    generateRiskAssessment();
    generateMockAlerts();
  }, []);

  const generateRiskAssessment = async () => {
    setIsLoading(true);
    try {
      // Generate AI credit score
      const creditScoreData = await generateCreditScore();
      setCreditScore(creditScoreData);

      // Generate liquidation risk assessment
      const liquidationRiskData = await generateLiquidationRisk();
      setLiquidationRisk(liquidationRiskData);

      // Generate dynamic interest rate
      const interestRateData = await generateDynamicInterestRate(creditScoreData.score);
      setInterestRate(interestRateData);

      // Generate portfolio risk analysis
      const portfolioRiskData = await generatePortfolioRisk();
      setPortfolioRisk(portfolioRiskData);

    } catch (error) {
      console.error('Risk assessment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCreditScore = async () => {
    try {
      const response = await geminiService.getCreditScore(
        '0xMockUser123',
        [],
        mockPortfolio.totalValue,
        mockPortfolio.loans.reduce((sum, loan) => sum + loan.amount, 0),
        'Multiple'
      );

      if (response.success) {
        return {
          score: response.creditAnalysis.creditScore,
          riskLevel: response.creditAnalysis.riskLevel,
          factors: response.creditAnalysis.riskFactors,
          recommendations: response.creditAnalysis.recommendations,
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('AI credit scoring failed:', error);
    }

    // Fallback mock data
    return {
      score: 78,
      riskLevel: 'Medium',
      factors: ['High ETH concentration', 'Recent market volatility', 'Moderate loan utilization'],
      recommendations: ['Diversify ETH position', 'Add more stablecoin collateral', 'Monitor market conditions'],
      lastUpdated: new Date().toISOString()
    };
  };

  const generateLiquidationRisk = async () => {
    try {
      const response = await geminiService.getRiskAssessment(
        mockPortfolio,
        { marketVolatility: 'high', gasFees: 'high', correlation: 'medium' },
        { riskTolerance: 'moderate' }
      );

      if (response.success) {
        const riskScore = response.riskAnalysis.riskScore;
        const probability = Math.min(riskScore * 10, 95);
        
        return {
          probability,
          timeToLiquidation: probability > 80 ? 2 : probability > 60 ? 24 : 168,
          riskFactors: response.riskAnalysis.threats.slice(0, 3),
          mitigationActions: response.riskAnalysis.mitigation.slice(0, 3),
          urgency: probability > 80 ? 'Critical' : probability > 60 ? 'High' : probability > 30 ? 'Medium' : 'Low'
        };
      }
    } catch (error) {
      console.error('AI liquidation risk assessment failed:', error);
    }

    // Fallback mock data
    return {
      probability: 35,
      timeToLiquidation: 72,
      riskFactors: ['ETH price volatility', 'High loan utilization', 'Market correlation risk'],
      mitigationActions: ['Add stablecoin collateral', 'Reduce loan amount', 'Monitor ETH price'],
      urgency: 'Medium'
    };
  };

  const generateDynamicInterestRate = async (creditScore: number) => {
    const baseRate = 0.04;
    const riskPremium = Math.max(0, (100 - creditScore) * 0.001);
    const liquidityPremium = 0.005;
    const finalRate = baseRate + riskPremium + liquidityPremium;

    return {
      baseRate,
      riskPremium,
      liquidityPremium,
      finalRate,
      factors: [
        `Credit score: ${creditScore}/100`,
        'Market liquidity: Moderate',
        'Protocol utilization: 75%'
      ],
      lastCalculated: new Date().toISOString()
    };
  };

  const generatePortfolioRisk = async () => {
    try {
      const response = await geminiService.getRiskAssessment(
        mockPortfolio,
        { marketVolatility: 'high', correlation: 'medium', smartContractRisk: 'low' },
        { riskTolerance: 'moderate' }
      );

      if (response.success) {
        return {
          overallRisk: response.riskAnalysis.riskScore,
          chainRisks: {
            ethereum: 4,
            bitcoin: 3,
            solana: 6,
            avalanche: 5
          },
          assetRisks: {
            ETH: 5,
            BTC: 3,
            SOL: 7,
            AVAX: 6
          },
          correlationRisk: 6,
          marketRisk: 7,
          smartContractRisk: 2
        };
      }
    } catch (error) {
      console.error('AI portfolio risk assessment failed:', error);
    }

    // Fallback mock data
    return {
      overallRisk: 5,
      chainRisks: { ethereum: 4, bitcoin: 3, solana: 6, avalanche: 5 },
      assetRisks: { ETH: 5, BTC: 3, SOL: 7, AVAX: 6 },
      correlationRisk: 6,
      marketRisk: 7,
      smartContractRisk: 2
    };
  };

  const generateMockAlerts = () => {
    const alerts = [
      {
        id: '1',
        type: 'liquidation',
        severity: 'warning',
        message: 'ETH collateral value decreased by 8% in last 24h',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionRequired: true,
        actionDescription: 'Consider adding collateral or repaying loans'
      },
      {
        id: '2',
        type: 'credit',
        severity: 'info',
        message: 'Credit score improved by 5 points due to on-time repayment',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        actionRequired: false
      },
      {
        id: '3',
        type: 'market',
        severity: 'warning',
        message: 'High correlation detected between ETH and SOL positions',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        actionRequired: true,
        actionDescription: 'Consider diversifying across uncorrelated assets'
      }
    ];
    setRiskAlerts(alerts);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'High': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Analyzing portfolio risks with AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Risk Management Dashboard
          </h2>
          <Shield className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-time AI-powered risk assessment, credit scoring, and predictive liquidation analysis
        </p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Credit Score */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold">AI Credit Score</h3>
          </div>
          {creditScore && (
            <>
              <p className={`text-3xl font-bold ${getRiskLevelColor(creditScore.riskLevel)}`}>
                {creditScore.score}/100
              </p>
              <p className={`text-sm font-medium ${getRiskLevelColor(creditScore.riskLevel)}`}>
                {creditScore.riskLevel} Risk
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Updated: {new Date(creditScore.lastUpdated).toLocaleTimeString()}
              </p>
            </>
          )}
        </div>

        {/* Liquidation Risk */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold">Liquidation Risk</h3>
          </div>
          {liquidationRisk && (
            <>
              <p className={`text-3xl font-bold ${getRiskLevelColor(liquidationRisk.urgency)}`}>
                {liquidationRisk.probability.toFixed(1)}%
              </p>
              <p className={`text-sm font-medium ${getRiskLevelColor(liquidationRisk.urgency)}`}>
                {liquidationRisk.urgency} Urgency
              </p>
              <p className="text-xs text-gray-400 mt-2">
                ~{liquidationRisk.timeToLiquidation}h to liquidation
              </p>
            </>
          )}
        </div>

        {/* Dynamic Interest Rate */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold">Interest Rate</h3>
          </div>
          {interestRate && (
            <>
              <p className="text-3xl font-bold text-green-400">
                {(interestRate.finalRate * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-gray-400">
                Base: {(interestRate.baseRate * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Risk Premium: +{(interestRate.riskPremium * 100).toFixed(2)}%
              </p>
            </>
          )}
        </div>

        {/* Portfolio Risk */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <Gauge className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold">Portfolio Risk</h3>
          </div>
          {portfolioRisk && (
            <>
              <p className={`text-3xl font-bold ${getRiskLevelColor(portfolioRisk.overallRisk <= 3 ? 'Low' : portfolioRisk.overallRisk <= 6 ? 'Medium' : 'High')}`}>
                {portfolioRisk.overallRisk}/10
              </p>
              <p className="text-sm text-gray-400">
                Overall Risk Score
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Market Risk: {portfolioRisk.marketRisk}/10
              </p>
            </>
          )}
        </div>
      </div>

      {/* AI Risk Assessment */}
      {liquidationRisk && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl border border-orange-500/30">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 p-6 pb-0">
            {getUrgencyIcon(liquidationRisk.urgency)}
            <span>AI Liquidation Risk Assessment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Risk Factors</p>
              <ul className="space-y-1">
                {liquidationRisk.riskFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Mitigation Actions</p>
              <ul className="space-y-1">
                {liquidationRisk.mitigationActions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Risk Alerts */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span>Risk Alerts & Notifications</span>
          </h3>
        </div>
        <div className="p-6">
          {riskAlerts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active risk alerts</p>
          ) : (
            <div className="space-y-4">
              {riskAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                      {alert.actionRequired && alert.actionDescription && (
                        <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                          <p className="text-sm font-medium">Action Required:</p>
                          <p className="text-sm">{alert.actionDescription}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {alert.actionRequired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={generateRiskAssessment}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Refresh Risk Assessment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WalletDashboardPage;
