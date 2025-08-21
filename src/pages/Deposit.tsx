import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Globe, 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface Asset {
  symbol: string;
  name: string;
  icon: any;
  color: string;
  decimals: number;
  price: number;
  change24h: number;
}

interface Chain {
  id: string;
  name: string;
  icon: any;
  color: string;
  status: 'healthy' | 'warning' | 'critical';
  gasPrice: string;
  confirmationTime: string;
}

interface DepositForm {
  selectedAsset: Asset | null;
  selectedChain: Chain | null;
  amount: string;
  estimatedValue: number;
}

const Deposit = () => {
  const { address, isConnected } = useWallet();
  const [depositForm, setDepositForm] = useState<DepositForm>({
    selectedAsset: null,
    selectedChain: null,
    amount: '',
    estimatedValue: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const assets: Asset[] = [
    { symbol: 'BTC', name: 'Bitcoin', icon: DollarSign, color: '#f7931a', decimals: 8, price: 52400, change24h: 2.4 },
    { symbol: 'ETH', name: 'Ethereum', icon: DollarSign, color: '#627eea', decimals: 18, price: 2500, change24h: -1.2 },
    { symbol: 'SOL', name: 'Solana', icon: DollarSign, color: '#9945ff', decimals: 9, price: 93, change24h: 5.8 },
    { symbol: 'USDC', name: 'USD Coin', icon: DollarSign, color: '#4cc9f0', decimals: 6, price: 1, change24h: 0.1 },
    { symbol: 'MATIC', name: 'Polygon', icon: DollarSign, color: '#8247e5', decimals: 18, price: 0.75, change24h: 3.2 },
    { symbol: 'AVAX', name: 'Avalanche', icon: DollarSign, color: '#e84142', decimals: 18, price: 18.50, change24h: -0.8 }
  ];

  const chains: Chain[] = [
    { id: 'bitcoin', name: 'Bitcoin', icon: Globe, color: '#f7931a', status: 'healthy', gasPrice: '1-5 sat/vB', confirmationTime: '~10 min' },
    { id: 'ethereum', name: 'Ethereum', icon: Globe, color: '#627eea', status: 'healthy', gasPrice: '15-25 gwei', confirmationTime: '~12 sec' },
    { id: 'solana', name: 'Solana', icon: Globe, color: '#9945ff', status: 'healthy', gasPrice: '0.000005 SOL', confirmationTime: '~400ms' },
    { id: 'polygon', name: 'Polygon', icon: Globe, color: '#8247e5', status: 'warning', gasPrice: '30-50 gwei', confirmationTime: '~2 sec' },
    { id: 'avalanche', name: 'Avalanche', icon: Globe, color: '#e84142', status: 'healthy', gasPrice: '25-35 gwei', confirmationTime: '~3 sec' },
    { id: 'arbitrum', name: 'Arbitrum', icon: Globe, color: '#28a0f0', status: 'healthy', gasPrice: '0.1-0.3 gwei', confirmationTime: '~1 sec' }
  ];

  useEffect(() => {
    if (isConnected) {
      loadDepositHistory();
    }
  }, [isConnected]);

  const loadDepositHistory = async () => {
    // Mock data - in production this would fetch from API
    setDepositHistory([
      {
        id: '1',
        asset: 'BTC',
        amount: '0.5 BTC',
        chain: 'Bitcoin',
        value: '$26,200',
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        txHash: '0x1234...5678'
      },
      {
        id: '2',
        asset: 'ETH',
        amount: '10 ETH',
        chain: 'Ethereum',
        value: '$25,000',
        status: 'pending',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        txHash: '0x8765...4321'
      }
    ]);
  };

  const handleAssetSelect = (asset: Asset) => {
    setDepositForm(prev => ({
      ...prev,
      selectedAsset: asset,
      estimatedValue: prev.amount ? parseFloat(prev.amount) * asset.price : 0
    }));
  };

  const handleChainSelect = (chain: Chain) => {
    setDepositForm(prev => ({ ...prev, selectedChain: chain }));
  };

  const handleAmountChange = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    const estimatedValue = depositForm.selectedAsset ? numAmount * depositForm.selectedAsset.price : 0;
    
    setDepositForm(prev => ({
      ...prev,
      amount,
      estimatedValue
    }));
  };

  const handleDeposit = async () => {
    if (!depositForm.selectedAsset || !depositForm.selectedChain || !depositForm.amount) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate deposit transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add to history
      const newDeposit = {
        id: Date.now().toString(),
        asset: depositForm.selectedAsset.symbol,
        amount: `${depositForm.amount} ${depositForm.selectedAsset.symbol}`,
        chain: depositForm.selectedChain.name,
        value: `$${depositForm.estimatedValue.toLocaleString()}`,
        status: 'pending' as const,
        timestamp: new Date().toISOString(),
        txHash: '0x' + Math.random().toString(36).substring(2, 15)
      };
      
      setDepositHistory(prev => [newDeposit, ...prev]);
      
      // Reset form
      setDepositForm({
        selectedAsset: null,
        selectedChain: null,
        amount: '',
        estimatedValue: 0
      });
      
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canDeposit = depositForm.selectedAsset && 
                    depositForm.selectedChain && 
                    depositForm.amount && 
                    parseFloat(depositForm.amount) > 0;

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Wallet size={64} className="mx-auto mb-6 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to deposit collateral</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Deposit Collateral</h1>
        <p className="text-gray-400">Deposit assets across multiple chains to unlock borrowing power</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <div className="space-y-6">
          {/* Asset Selection */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Select Asset</h3>
            <div className="grid grid-cols-2 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => handleAssetSelect(asset)}
                  className={`p-4 rounded-lg border transition-all ${
                    depositForm.selectedAsset?.symbol === asset.symbol
                      ? 'border-primary bg-primary/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                    >
                      <asset.icon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-gray-400">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">${asset.price.toLocaleString()}</div>
                    <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chain Selection */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Select Chain</h3>
            <div className="grid grid-cols-2 gap-3">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                  className={`p-4 rounded-lg border transition-all ${
                    depositForm.selectedChain?.id === chain.id
                      ? 'border-primary bg-primary/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${chain.color}20`, color: chain.color }}
                    >
                      <chain.icon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{chain.name}</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          chain.status === 'healthy' ? 'bg-green-400' :
                          chain.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-xs text-gray-400 capitalize">{chain.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left text-xs text-gray-400">
                    <div>Gas: {chain.gasPrice}</div>
                    <div>Time: {chain.confirmationTime}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Deposit Amount</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {depositForm.selectedAsset && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {depositForm.selectedAsset.symbol}
                    </div>
                  )}
                </div>
              </div>

              {depositForm.estimatedValue > 0 && (
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estimated Value:</span>
                    <span className="text-white font-medium">
                      ${depositForm.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={!canDeposit || isLoading}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Deposit Collateral
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold">Advanced Options</h3>
              <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                <ArrowRight size={20} />
              </div>
            </button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Auto-compound rewards</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Enable margin trading</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deposit History & Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Deposit Benefits</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-green-400" />
                </div>
                <div>
                  <div className="font-medium">Earn Yield</div>
                  <div className="text-sm text-gray-400">Up to 8% APY on stable assets</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">Borrowing Power</div>
                  <div className="text-sm text-gray-400">Unlock up to 80% LTV</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Globe size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Cross-Chain</div>
                  <div className="text-sm text-gray-400">Use collateral on any chain</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="glass-effect border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Deposits</h3>
            <div className="space-y-3">
              {depositHistory.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <DollarSign size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{deposit.amount}</div>
                      <div className="text-sm text-gray-400">{deposit.chain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{deposit.value}</div>
                    <div className={`text-xs ${
                      deposit.status === 'completed' ? 'text-green-400' :
                      deposit.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="glass-effect border border-yellow-500/30 rounded-xl p-6 bg-yellow-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Security Notice</h4>
                <p className="text-sm text-yellow-300 mb-3">
                  Your collateral is secured by ZetaChain's universal contracts with multi-signature governance and real-time threat detection.
                </p>
                <button className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                  Learn more <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
