import { ethers } from 'ethers';

export interface ConnectedWallet {
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

export interface PortfolioSummary {
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

export interface ChainPortfolio {
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

export interface ActivityEvent {
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

export interface DashboardOverview {
  totalWallets: number;
  totalChains: number;
  totalCollateralUSD: number;
  totalLoansUSD: number;
  activeLoans: number;
  recentActivity: ActivityEvent[];
  lastUpdated: string;
}

export interface WalletBalance {
  [asset: string]: number;
}

export interface CreditScore {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  factors: string[];
  lastUpdated: string;
}

export interface CrossChainStats {
  totalUsers: number;
  totalVolume24h: number;
  activeLoans: number;
  totalCollateral: number;
  averageAPY: number;
  liquidationRate: number;
  chains: string[];
  lastUpdated: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class DashboardService {
  private apiBaseUrl: string;
  private zetaConfig: any;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_DASHBOARD_API_URL || 'http://localhost:4004';
    this.zetaConfig = {
      rpcUrl: 'https://rpc.zetachain.net',
      chainId: 7000
    };
  }

  // Get dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/overview`);
      const result: ApiResponse<DashboardOverview> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard overview');
      }
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      return this.getMockDashboardOverview();
    }
  }

  // Get connected wallets
  async getConnectedWallets(): Promise<ConnectedWallet[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets`);
      const result: ApiResponse<ConnectedWallet[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch connected wallets');
      }
    } catch (error) {
      console.error('Error fetching connected wallets:', error);
      return this.getMockConnectedWallets();
    }
  }

  // Connect new wallet
  async connectWallet(walletType: string, address: string, chain: string): Promise<ConnectedWallet> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletType, address, chain }),
      });
      
      const result: ApiResponse<ConnectedWallet> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet(walletId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets/${walletId}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        return true;
      } else {
        throw new Error(result.error || 'Failed to disconnect wallet');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }

  // Get portfolio summary
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/portfolio/summary`);
      const result: ApiResponse<PortfolioSummary> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch portfolio summary');
      }
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      return this.getMockPortfolioSummary();
    }
  }

  // Get chain portfolios
  async getChainPortfolios(): Promise<ChainPortfolio[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/portfolio/chains`);
      const result: ApiResponse<ChainPortfolio[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch chain portfolios');
      }
    } catch (error) {
      console.error('Error fetching chain portfolios:', error);
      return this.getMockChainPortfolios();
    }
  }

  // Get activity feed
  async getActivityFeed(limit?: number, wallet?: string): Promise<ActivityEvent[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (wallet) params.append('wallet', wallet);
      
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/activity?${params}`);
      const result: ApiResponse<ActivityEvent[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch activity feed');
      }
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return this.getMockActivityFeed();
    }
  }

  // Get wallet balance
  async getWalletBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets/${address}/balance`);
      const result: ApiResponse<WalletBalance> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return this.getMockWalletBalance(address);
    }
  }

  // Get credit score
  async getCreditScore(address: string): Promise<CreditScore> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets/${address}/credit-score`);
      const result: ApiResponse<CreditScore> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch credit score');
      }
    } catch (error) {
      console.error('Error fetching credit score:', error);
      return this.getMockCreditScore(address);
    }
  }

  // Update portfolio data
  async updatePortfolio(chain: string, asset: string, type: string, amount: number, usdValue: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/portfolio/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain, asset, type, amount, usdValue }),
      });
      
      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        return true;
      } else {
        throw new Error(result.error || 'Failed to update portfolio');
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  // Refresh wallet data
  async refreshWalletData(address: string): Promise<ConnectedWallet> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/wallets/${address}/refresh`, {
        method: 'POST',
      });
      
      const result: ApiResponse<ConnectedWallet> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to refresh wallet data');
      }
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
      throw error;
    }
  }

  // Get cross-chain statistics
  async getCrossChainStats(): Promise<CrossChainStats> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/dashboard/statistics`);
      const result: ApiResponse<CrossChainStats> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch cross-chain statistics');
      }
    } catch (error) {
      console.error('Error fetching cross-chain statistics:', error);
      return this.getMockCrossChainStats();
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);
      const result = await response.json();
      return result.status === 'healthy';
    } catch (error) {
      console.error('Dashboard service health check failed:', error);
      return false;
    }
  }

  // Mock data methods for development
  getMockDashboardOverview(): DashboardOverview {
    return {
      totalWallets: 3,
      totalChains: 6,
      totalCollateralUSD: 15420,
      totalLoansUSD: 8200,
      activeLoans: 4,
      recentActivity: this.getMockActivityFeed().slice(0, 5),
      lastUpdated: new Date().toISOString()
    };
  }

  getMockConnectedWallets(): ConnectedWallet[] {
    return [
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
  }

  getMockPortfolioSummary(): PortfolioSummary {
    return {
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
  }

  getMockChainPortfolios(): ChainPortfolio[] {
    return [
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
  }

  getMockActivityFeed(): ActivityEvent[] {
    return [
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
  }

  getMockWalletBalance(address: string): WalletBalance {
    const balances: { [key: string]: WalletBalance } = {
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6': {
        ETH: 2.45,
        USDC: 5000,
        WBTC: 0.15
      },
      '5D4Xz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRq': {
        SOL: 15.8,
        USDC: 800
      },
      '0x8ba1f109551bD432803012645Hac136c772c3c7c': {
        AVAX: 125.5
      }
    };
    
    return balances[address] || {};
  }

  getMockCreditScore(address: string): CreditScore {
    const scores: { [key: string]: CreditScore } = {
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6': {
        score: 82,
        level: 'good',
        factors: ['Diversified collateral', 'Consistent repayment history', 'Low utilization ratio'],
        lastUpdated: new Date().toISOString()
      },
      '5D4Xz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRqXz8JcRq': {
        score: 75,
        level: 'fair',
        factors: ['Growing portfolio', 'Recent activity'],
        lastUpdated: new Date().toISOString()
      },
      '0x8ba1f109551bD432803012645Hac136c772c3c7c': {
        score: 68,
        level: 'fair',
        factors: ['New user', 'Limited history'],
        lastUpdated: new Date().toISOString()
      }
    };
    
    return scores[address] || {
      score: 70,
      level: 'fair',
      factors: ['New wallet connection'],
      lastUpdated: new Date().toISOString()
    };
  }

  getMockCrossChainStats(): CrossChainStats {
    return {
      totalUsers: 12500,
      totalVolume24h: 2500000,
      activeLoans: 4500,
      totalCollateral: 45000000,
      averageAPY: 8.5,
      liquidationRate: 0.02,
      chains: ['Ethereum', 'Solana', 'Avalanche', 'Base', 'Polygon', 'ZetaChain'],
      lastUpdated: new Date().toISOString()
    };
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatAddress(address: string): string {
    if (address.length > 20) {
      return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }
    return address;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getHealthStatusColor(status: string): string {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getActivityTypeIcon(type: string): string {
    switch (type) {
      case 'deposit': return '📥';
      case 'withdraw': return '📤';
      case 'borrow': return '💳';
      case 'repay': return '✅';
      case 'liquidation': return '⚠️';
      case 'collateral_adjustment': return '⚙️';
      default: return '📊';
    }
  }

  // ZetaChain integration methods
  async getZetaChainProvider(): Promise<ethers.Provider | null> {
    try {
      return new ethers.JsonRpcProvider(this.zetaConfig.rpcUrl);
    } catch (error) {
      console.error('Error creating ZetaChain provider:', error);
      return null;
    }
  }

  async simulateRealTimeUpdates(): Promise<void> {
    // Simulate real-time data updates
    setInterval(async () => {
      try {
        // Update portfolio data
        await this.updatePortfolio('Ethereum', 'ETH', 'deposit', 0.1, 180);
      } catch (error) {
        console.error('Error in real-time update simulation:', error);
      }
    }, 30000); // Update every 30 seconds
  }
}

export default new DashboardService();
