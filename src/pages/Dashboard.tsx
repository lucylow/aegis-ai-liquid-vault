import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  X, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  BarChart3,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Bitcoin,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface ConnectedWallet {
  id: string;
  name: string;
  type: 'evm' | 'solana' | 'bitcoin' | 'walletconnect';
  chain: string;
  address: string;
  status: 'connected' | 'connecting' | 'disconnected';
  balance: number;
  nativeToken: string;
  isActive: boolean;
  lastActivity: string;
  icon: string;
}

interface PortfolioSummary {
  totalCollateralUSD: number;
  totalLoansUSD: number;
  borrowingPowerUSD: number;
  utilizationPercent: number;
  creditScore: number;
  liquidationRiskPercent: number;
  netWorthUSD: number;
  availableCreditUSD: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
}

interface ChainPortfolio {
  chain: string;
  collateral: {
    [asset: string]: {
      amount: number;
      usdValue: number;
      apy: number;
      change24h: number;
    };
  };
  loans: {
    [asset: string]: {
      amount: number;
      usdValue: number;
      interestRate: number;
      dueDate: string;
    };
  };
  totalCollateralUSD: number;
  totalLoansUSD: number;
  borrowingPowerUSD: number;
}

interface ActivityEvent {
  id: string;
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay' | 'liquidation' | 'collateral_adjustment';
  chain: string;
  asset: string;
  amount: number;
  usdValue: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  txHash?: string;
  wallet: string;
  details: string;
}

interface WalletConnectionModal {
  isOpen: boolean;
  walletType?: string;
}

const Dashboard = () => {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [chainPortfolios, setChainPortfolios] = useState<ChainPortfolio[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [connectionModal, setConnectionModal] = useState<WalletConnectionModal>({ isOpen: false });
  const [selectedWallet, setSelectedWallet] = useState<ConnectedWallet | null>(null);

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock connected wallets
      const mockConnectedWallets: ConnectedWallet[] = [
        {
          id: '1',
          name: 'MetaMask',
          type: 'evm',
          chain: 'Ethereum',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          status: 'connected',
          balance: 2.45,
          nativeToken: 'ETH',
          isActive: true,
          lastActivity: new Date().toISOString(),
          icon: '🦊'
        },
        {
          id: '2',
          name: 'Phantom',
          type: 'solana',
          chain: 'Solana',
          address: '5D4Xz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRq',
          status: 'connected',
          balance: 15.8,
          nativeToken: 'SOL',
          isActive: false,
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          icon: '👻'
        },
        {
          id: '3',
          name: 'WalletConnect',
          type: 'walletconnect',
          chain: 'Avalanche',
          address: '0x8ba1f109551bD432803012645Hac136c772c3c7c',
          status: 'connected',
          balance: 125.5,
          nativeToken: 'AVAX',
          isActive: false,
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          icon: '🔗'
        }
      ];
      setConnectedWallets(mockConnectedWallets);

      // Mock portfolio summary
      const mockPortfolioSummary: PortfolioSummary = {
        totalCollateralUSD: 15420,
        totalLoansUSD: 8200,
        borrowingPowerUSD: 12500,
        utilizationPercent: 65.6,
        creditScore: 82,
        liquidationRiskPercent: 18,
        netWorthUSD: 7220,
        availableCreditUSD: 4300,
        healthStatus: 'healthy'
      };
      setPortfolioSummary(mockPortfolioSummary);

      // Mock chain portfolios
      const mockChainPortfolios: ChainPortfolio[] = [
        {
          chain: 'Ethereum',
          collateral: {
            'USDC': { amount: 5000, usdValue: 5000, apy: 8.2, change24h: 0.1 },
            'ETH': { amount: 2.5, usdValue: 4500, apy: 6.8, change24h: -2.3 },
            'WBTC': { amount: 0.15, usdValue: 3200, apy: 7.5, change24h: 1.8 }
          },
          loans: {
            'USDC': { amount: 3000, usdValue: 3000, interestRate: 12.5, dueDate: '2025-10-15' },
            'ETH': { amount: 1.2, usdValue: 2200, interestRate: 11.8, dueDate: '2025-09-30' }
          },
          totalCollateralUSD: 12700,
          totalLoansUSD: 5200,
          borrowingPowerUSD: 8500
        },
        {
          chain: 'Solana',
          collateral: {
            'SOL': { amount: 25, usdValue: 1800, apy: 9.1, change24h: 3.2 },
            'USDC': { amount: 800, usdValue: 800, apy: 8.5, change24h: 0.1 }
          },
          loans: {
            'USDC': { amount: 500, usdValue: 500, interestRate: 13.2, dueDate: '2025-10-20' }
          },
          totalCollateralUSD: 2600,
          totalLoansUSD: 500,
          borrowingPowerUSD: 2000
        },
        {
          chain: 'Avalanche',
          collateral: {
            'AVAX': { amount: 50, usdValue: 120, apy: 7.8, change24h: -1.5 }
          },
          loans: {
            'USDC': { amount: 2500, usdValue: 2500, interestRate: 14.1, dueDate: '2025-11-05' }
          },
          totalCollateralUSD: 120,
          totalLoansUSD: 2500,
          borrowingPowerUSD: 2000
        }
      ];
      setChainPortfolios(mockChainPortfolios);

      // Mock activity feed
      const mockActivityFeed: ActivityEvent[] = [
        {
          id: '1',
          type: 'deposit',
          chain: 'Ethereum',
          asset: 'USDC',
          amount: 1000,
          usdValue: 1000,
          status: 'confirmed',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          details: 'Deposited USDC as collateral'
        },
        {
          id: '2',
          type: 'borrow',
          chain: 'Avalanche',
          asset: 'USDC',
          amount: 500,
          usdValue: 500,
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          wallet: '0x8ba1f109551bD432803012645Hac136c772c3c7c',
          details: 'Borrowed USDC against AVAX collateral'
        },
        {
          id: '3',
          type: 'repay',
          chain: 'Ethereum',
          asset: 'ETH',
          amount: 0.5,
          usdValue: 900,
          status: 'confirmed',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
          wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          details: 'Repaid ETH loan'
        },
        {
          id: '4',
          type: 'collateral_adjustment',
          chain: 'Solana',
          asset: 'SOL',
          amount: 5,
          usdValue: 360,
          status: 'confirmed',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          txHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
          wallet: '5D4Xz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRq',
          details: 'Added SOL collateral'
        }
      ];
      setActivityFeed(mockActivityFeed);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletType: string) => {
    try {
      setConnectionModal({ isOpen: true, walletType });
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWallet: ConnectedWallet = {
        id: Date.now().toString(),
        name: walletType === 'evm' ? 'MetaMask' : walletType === 'solana' ? 'Phantom' : 'WalletConnect',
        type: walletType as any,
        chain: walletType === 'evm' ? 'Ethereum' : walletType === 'solana' ? 'Solana' : 'Avalanche',
        address: walletType === 'evm' ? '0x' + Math.random().toString(16).substr(2, 40) : 
                walletType === 'solana' ? Math.random().toString(36).substr(2, 44) : 
                '0x' + Math.random().toString(16).substr(2, 40),
        status: 'connected',
        balance: Math.random() * 100,
        nativeToken: walletType === 'evm' ? 'ETH' : walletType === 'solana' ? 'SOL' : 'AVAX',
        isActive: true,
        lastActivity: new Date().toISOString(),
        icon: walletType === 'evm' ? '🦊' : walletType === 'solana' ? '👻' : '🔗'
      };
      
      setConnectedWallets(prev => [...prev, newWallet]);
      setConnectionModal({ isOpen: false });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnectionModal({ isOpen: false });
    }
  };

  const disconnectWallet = (walletId: string) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
    if (selectedWallet?.id === walletId) {
      setSelectedWallet(null);
    }
  };

  const setActiveWallet = (wallet: ConnectedWallet) => {
    setConnectedWallets(prev => prev.map(w => ({ ...w, isActive: w.id === wallet.id })));
    setSelectedWallet(wallet);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Plus className="w-4 h-4 text-green-500" />;
      case 'withdraw': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'borrow': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'repay': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'liquidation': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'collateral_adjustment': return <Settings className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }
    return address;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600">Please connect your wallet to view the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wallet Dashboard</h1>
          <p className="text-gray-300">Manage multiple wallets and monitor your cross-chain portfolio</p>
        </div>

        {/* Wallet Connection Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Wallet className="w-6 h-6 mr-3" />
              Connected Wallets
            </h2>
            <button
              onClick={() => setConnectionModal({ isOpen: true })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Wallet</span>
            </button>
          </div>

          {connectedWallets.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400 mb-4">No wallets connected</p>
              <button
                onClick={() => setConnectionModal({ isOpen: true })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Connect Your First Wallet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    wallet.isActive
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
                  }`}
                  onClick={() => setActiveWallet(wallet)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <h3 className="font-semibold text-white">{wallet.name}</h3>
                        <p className="text-sm text-gray-400">{wallet.chain}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnectWallet(wallet.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Address:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-mono">{formatAddress(wallet.address)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAddress(wallet.address);
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white">
                        {showBalances ? `${wallet.balance.toFixed(4)} ${wallet.nativeToken}` : '••••'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wallet.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {wallet.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Summary */}
        {portfolioSummary && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                Portfolio Summary
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {showBalances ? formatCurrency(portfolioSummary.totalCollateralUSD) : '••••'}
                </div>
                <div className="text-sm text-gray-400">Total Collateral</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  {showBalances ? formatCurrency(portfolioSummary.totalLoansUSD) : '••••'}
                </div>
                <div className="text-sm text-gray-400">Outstanding Loans</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {showBalances ? formatCurrency(portfolioSummary.borrowingPowerUSD) : '••••'}
                </div>
                <div className="text-sm text-gray-400">Borrowing Power</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {showBalances ? formatCurrency(portfolioSummary.netWorthUSD) : '••••'}
                </div>
                <div className="text-sm text-gray-400">Net Worth</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Credit Score</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(portfolioSummary.healthStatus)}`}>
                    {portfolioSummary.healthStatus.toUpperCase()}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{portfolioSummary.creditScore}</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${portfolioSummary.creditScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-gray-400 mb-2">Liquidation Risk</div>
                <div className="text-3xl font-bold text-red-400 mb-2">{portfolioSummary.liquidationRiskPercent}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${portfolioSummary.liquidationRiskPercent}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-gray-400 mb-2">Utilization</div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{portfolioSummary.utilizationPercent}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${portfolioSummary.utilizationPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chain Portfolios */}
        {chainPortfolios.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3" />
              Chain Portfolios
            </h2>
            
            <div className="space-y-6">
              {chainPortfolios.map((chainPortfolio) => (
                <div key={chainPortfolio.chain} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{chainPortfolio.chain}</h3>
                    <div className="flex space-x-4 text-sm">
                      <div>
                        <span className="text-gray-400">Collateral: </span>
                        <span className="text-white">{formatCurrency(chainPortfolio.totalCollateralUSD)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Loans: </span>
                        <span className="text-white">{formatCurrency(chainPortfolio.totalLoansUSD)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Power: </span>
                        <span className="text-white">{formatCurrency(chainPortfolio.borrowingPowerUSD)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-white mb-3">Collateral Assets</h4>
                      <div className="space-y-2">
                        {Object.entries(chainPortfolio.collateral).map(([asset, data]) => (
                          <div key={asset} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                            <span className="text-white">{asset}</span>
                            <div className="text-right">
                              <div className="text-white">{data.amount.toFixed(4)}</div>
                              <div className="text-sm text-gray-400">{formatCurrency(data.usdValue)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-3">Active Loans</h4>
                      <div className="space-y-2">
                        {Object.entries(chainPortfolio.loans).map(([asset, data]) => (
                          <div key={asset} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                            <span className="text-white">{asset}</span>
                            <div className="text-right">
                              <div className="text-white">{data.amount.toFixed(4)}</div>
                              <div className="text-sm text-gray-400">{formatCurrency(data.usdValue)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Feed */}
        {activityFeed.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3" />
              Recent Activity
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityFeed.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getActivityTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white capitalize">{event.type}</div>
                        <div className="text-sm text-gray-400">{event.details}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{event.amount} {event.asset}</div>
                        <div className="text-sm text-gray-400">{formatCurrency(event.usdValue)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {event.chain}
                        </span>
                        <span className="flex items-center">
                          <Wallet className="w-3 h-3 mr-1" />
                          {formatAddress(event.wallet)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Connection Modal */}
        {connectionModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Connect Wallet</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => connectWallet('evm')}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <span className="text-2xl">🦊</span>
                  <div className="text-left">
                    <div className="font-medium text-white">MetaMask</div>
                    <div className="text-sm text-gray-400">Ethereum & EVM chains</div>
                  </div>
                </button>
                
                <button
                  onClick={() => connectWallet('solana')}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <span className="text-2xl">👻</span>
                  <div className="text-left">
                    <div className="font-medium text-white">Phantom</div>
                    <div className="text-sm text-gray-400">Solana ecosystem</div>
                  </div>
                </button>
                
                <button
                  onClick={() => connectWallet('walletconnect')}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <span className="text-2xl">🔗</span>
                  <div className="text-left">
                    <div className="font-medium text-white">WalletConnect</div>
                    <div className="text-sm text-gray-400">Multi-chain support</div>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setConnectionModal({ isOpen: false })}
                className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
