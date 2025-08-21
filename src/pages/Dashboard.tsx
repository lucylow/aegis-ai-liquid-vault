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
  RefreshCw
} from 'lucide-react';

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
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span onClick={() => setShowWalletModal(true)}>Add Wallet</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-8">
          {['overview', 'portfolio', 'activity', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md transition-colors capitalize ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Portfolio Summary Cards */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Portfolio Overview</h2>
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

        {/* Wallet Management Section - Bottom Right */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600 shadow-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Connected Wallets</h3>
              </div>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                {connectedWallets.length} active
              </span>
            </div>
            
            {/* Connected Wallets List */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {connectedWallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-700/60 rounded-lg hover:bg-gray-700/80 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center text-white text-sm font-medium`}>
                      {wallet.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white truncate">{wallet.name}</span>
                        <div className={`w-2 h-2 rounded-full ${getStatusBgColor(wallet.status)} flex-shrink-0`}></div>
                      </div>
                      <div className="text-xs text-gray-400 truncate">{wallet.address}</div>
                      <div className="text-xs text-gray-300">
                        {wallet.balance.toFixed(4)} {wallet.nativeToken}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 ml-2">
                    <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors">
                      Switch
                    </button>
                    <button 
                      onClick={() => disconnectWallet(wallet.id)}
                      className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Wallet Button */}
            <button 
              onClick={() => setShowWalletModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Connect New Wallet</span>
            </button>
          </div>
        </div>

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

export default WalletDashboardPage;
