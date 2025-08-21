import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import DashboardWidget from '../components/DashboardWidget';
import AssetMonitor from '../components/AssetMonitor';
import SecurityControls from '../components/SecurityControls';

interface PortfolioSummary {
  totalValue: string;
  totalChange24h: number;
  totalCollateral: string;
  totalBorrowed: string;
  borrowingPower: string;
  utilization: number;
}

interface CreditScore {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  factors: string[];
  lastUpdated: string;
}

interface LiquidationRisk {
  risk: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  warnings: string[];
  recommendations: string[];
}

interface RecentActivity {
  id: string;
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay' | 'liquidation';
  asset: string;
  amount: string;
  chain: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

const Dashboard = () => {
  const { address, isConnected } = useWallet();
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: '$0',
    totalChange24h: 0,
    totalCollateral: '$0',
    totalBorrowed: '$0',
    borrowingPower: '$0',
    utilization: 0
  });
  const [creditScore, setCreditScore] = useState<CreditScore>({
    score: 0,
    level: 'poor',
    factors: [],
    lastUpdated: new Date().toISOString()
  });
  const [liquidationRisk, setLiquidationRisk] = useState<LiquidationRisk>({
    risk: 'low',
    score: 0,
    warnings: [],
    recommendations: []
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected, address]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - in production these would be real API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setPortfolioSummary({
        totalValue: '$124,567.89',
        totalChange24h: 2.4,
        totalCollateral: '$89,234.56',
        totalBorrowed: '$35,333.33',
        borrowingPower: '$53,901.23',
        utilization: 39.6
      });

      setCreditScore({
        score: 87,
        level: 'good',
        factors: [
          'Diversified collateral across 4 chains',
          'Consistent repayment history',
          'Low utilization ratio',
          'Strong portfolio performance'
        ],
        lastUpdated: new Date().toISOString()
      });

      setLiquidationRisk({
        risk: 'low',
        score: 23,
        warnings: [],
        recommendations: [
          'Consider adding more stablecoin collateral',
          'Monitor BTC price volatility',
          'Maintain utilization below 70%'
        ]
      });

      setRecentActivity([
        {
          id: '1',
          type: 'deposit',
          asset: 'BTC',
          amount: '0.5 BTC',
          chain: 'Bitcoin',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '2',
          type: 'borrow',
          asset: 'USDC',
          amount: '10,000 USDC',
          chain: 'Ethereum',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '3',
          type: 'repay',
          asset: 'ETH',
          amount: '2.5 ETH',
          chain: 'Ethereum',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight size={16} className="text-green-400" />;
      case 'withdraw': return <ArrowUpRight size={16} className="text-blue-400" />;
      case 'borrow': return <TrendingUp size={16} className="text-yellow-400" />;
      case 'repay': return <TrendingDown size={16} className="text-green-400" />;
      case 'liquidation': return <AlertTriangle size={16} className="text-red-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Shield size={64} className="mx-auto mb-6 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Your cross-chain portfolio overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            {showSensitiveInfo ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSensitiveInfo ? 'Hide' : 'Show'} Info
          </button>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Portfolio Value"
          value={portfolioSummary.totalValue}
          subtitle={`${portfolioSummary.totalChange24h >= 0 ? '+' : ''}${portfolioSummary.totalChange24h}% (24h)`}
          icon={DollarSign}
          color="#10b981"
          trend={portfolioSummary.totalChange24h > 0 ? { value: Math.abs(portfolioSummary.totalChange24h), isPositive: true } : undefined}
        />
        <DashboardWidget
          title="Total Collateral"
          value={portfolioSummary.totalCollateral}
          subtitle="Across all chains"
          icon={Shield}
          color="#3b82f6"
        />
        <DashboardWidget
          title="Total Borrowed"
          value={portfolioSummary.totalBorrowed}
          subtitle={`${portfolioSummary.utilization.toFixed(1)}% utilization`}
          icon={TrendingUp}
          color="#f59e0b"
        />
        <DashboardWidget
          title="Borrowing Power"
          value={portfolioSummary.borrowingPower}
          subtitle="Available to borrow"
          icon={Activity}
          color="#8b5cf6"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Credit Score & Risk */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Credit Score */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Credit Score</h3>
              <span className={`text-sm font-medium ${getCreditScoreColor(creditScore.score)}`}>
                {creditScore.score}/100
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    creditScore.score >= 90 ? 'bg-green-400' :
                    creditScore.score >= 80 ? 'bg-blue-400' :
                    creditScore.score >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${creditScore.score}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                creditScore.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                creditScore.level === 'good' ? 'bg-blue-500/20 text-blue-400' :
                creditScore.level === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {creditScore.level === 'excellent' ? <CheckCircle size={16} /> :
                 creditScore.level === 'good' ? <Shield size={16} /> :
                 creditScore.level === 'fair' ? <AlertTriangle size={16} /> :
                 <AlertTriangle size={16} />}
                {creditScore.level.charAt(0).toUpperCase() + creditScore.level.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Positive Factors:</h4>
              {creditScore.factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-green-400" />
                  {factor}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(creditScore.lastUpdated).toLocaleString()}
            </div>
          </div>

          {/* Liquidation Risk */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Liquidation Risk</h3>
              <span className={`text-sm font-medium ${getRiskColor(liquidationRisk.risk)}`}>
                {liquidationRisk.risk.toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    liquidationRisk.risk === 'low' ? 'bg-green-400' :
                    liquidationRisk.risk === 'medium' ? 'bg-yellow-400' :
                    liquidationRisk.risk === 'high' ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${100 - liquidationRisk.score}%` }}
                />
              </div>
              <div className="text-center text-sm text-gray-400 mt-2">
                Risk Score: {liquidationRisk.score}/100
              </div>
            </div>

            {liquidationRisk.warnings.length > 0 && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="text-sm font-medium text-red-400 mb-2">Warnings:</h4>
                {liquidationRisk.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-300">
                    <AlertTriangle size={14} />
                    {warning}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Recommendations:</h4>
              {liquidationRisk.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield size={14} className="text-blue-400" />
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Asset Monitor */}
        <div className="lg:col-span-1">
          <AssetMonitor connectedWallet={address} />
        </div>

        {/* Right Column - Security Controls */}
        <div className="lg:col-span-1">
          <SecurityControls 
            contractAddress="0x1234567890123456789012345678901234567890"
            connectedWallet={address}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-effect border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{activity.type}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-white">{activity.amount}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{activity.asset}</span>
                  </div>
                  <div className="text-sm text-gray-400">{activity.chain}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${getActivityStatusColor(activity.status)}`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
