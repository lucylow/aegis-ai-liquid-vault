import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Loader2,
  Globe,
  Coins,
  Wallet,
  Zap
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ChainInfo {
  id: string;
  name: string;
  icon: string;
  rpcUrl: string;
  nativeCurrency: string;
  blockExplorer: string;
}

interface AssetInfo {
  symbol: string;
  name: string;
  decimals: number;
  chain: string;
  price: number;
  collateralFactor: number;
  borrowFactor: number;
}

interface LoanPosition {
  id: string;
  chain: string;
  collateralAsset: string;
  collateralAmount: number;
  borrowedAsset: string;
  borrowedAmount: number;
  interestRate: number;
  liquidationThreshold: number;
  healthFactor: number;
  status: 'active' | 'warning' | 'liquidated';
}

const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '🔷',
    rpcUrl: 'https://eth.llamarpc.com',
    nativeCurrency: 'ETH',
    blockExplorer: 'https://etherscan.io'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    icon: '❄️',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    nativeCurrency: 'AVAX',
    blockExplorer: 'https://snowtrace.io'
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: '☀️',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    nativeCurrency: 'SOL',
    blockExplorer: 'https://solscan.io'
  },
  {
    id: 'base',
    name: 'Base',
    icon: '🔵',
    rpcUrl: 'https://mainnet.base.org',
    nativeCurrency: 'ETH',
    blockExplorer: 'https://basescan.org'
  },
  {
    id: 'zetachain',
    name: 'ZetaChain',
    icon: '⚡',
    rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
    nativeCurrency: 'ZETA',
    blockExplorer: 'https://explorer.zetachain.com'
  }
];

const SUPPORTED_ASSETS: AssetInfo[] = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, chain: 'ethereum', price: 3200, collateralFactor: 0.8, borrowFactor: 0.75 },
  { symbol: 'BTC', name: 'Bitcoin', decimals: 8, chain: 'bitcoin', price: 45000, collateralFactor: 0.75, borrowFactor: 0.7 },
  { symbol: 'SOL', name: 'Solana', decimals: 9, chain: 'solana', price: 95, collateralFactor: 0.7, borrowFactor: 0.65 },
  { symbol: 'AVAX', name: 'Avalanche', decimals: 18, chain: 'avalanche', price: 35, collateralFactor: 0.7, borrowFactor: 0.65 },
  { symbol: 'ZETA', name: 'ZetaChain', decimals: 18, chain: 'zetachain', price: 2.5, collateralFactor: 0.8, borrowFactor: 0.75 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, chain: 'ethereum', price: 1, collateralFactor: 0.9, borrowFactor: 0.85 }
];

const CrossChainLending: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [selectedAsset, setSelectedAsset] = useState<string>('ETH');
  const [amount, setAmount] = useState<string>('');
  const [action, setAction] = useState<'deposit' | 'borrow'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [aiRiskScore, setAiRiskScore] = useState<number | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'borrow' | 'repay'>('deposit');
  const [loanPositions, setLoanPositions] = useState<LoanPosition[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [healthFactor, setHealthFactor] = useState(0);

  // Mock loan positions for demonstration
  useEffect(() => {
    const mockPositions: LoanPosition[] = [
      {
        id: '1',
        chain: 'ethereum',
        collateralAsset: 'ETH',
        collateralAmount: 2.5,
        borrowedAsset: 'USDC',
        borrowedAmount: 3000,
        interestRate: 0.045,
        liquidationThreshold: 0.75,
        healthFactor: 1.85,
        status: 'active'
      },
      {
        id: '2',
        chain: 'avalanche',
        collateralAsset: 'AVAX',
        collateralAmount: 50,
        borrowedAsset: 'USDC',
        borrowedAmount: 1000,
        interestRate: 0.052,
        liquidationThreshold: 0.75,
        healthFactor: 1.45,
        status: 'warning'
      }
    ];
    setLoanPositions(mockPositions);
    
    // Calculate portfolio metrics
    const totalCollateral = mockPositions.reduce((sum, pos) => {
      const asset = SUPPORTED_ASSETS.find(a => a.symbol === pos.collateralAsset);
      return sum + (pos.collateralAmount * (asset?.price || 0));
    }, 0);
    
    const totalBorrowedValue = mockPositions.reduce((sum, pos) => sum + pos.borrowedAmount, 0);
    
    setPortfolioValue(totalCollateral);
    setTotalBorrowed(totalBorrowedValue);
    setHealthFactor(totalCollateral > 0 ? totalCollateral / totalBorrowedValue : 0);
  }, []);

  const getChainInfo = (chainId: string) => SUPPORTED_CHAINS.find(c => c.id === chainId);
  const getAssetInfo = (symbol: string) => SUPPORTED_ASSETS.find(a => a.symbol === symbol);

  const calculateCollateralValue = () => {
    const asset = getAssetInfo(selectedAsset);
    const numAmount = parseFloat(amount) || 0;
    return asset ? numAmount * asset.price : 0;
  };

  const calculateBorrowLimit = () => {
    const asset = getAssetInfo(selectedAsset);
    const collateralValue = calculateCollateralValue();
    return asset ? collateralValue * asset.collateralFactor : 0;
  };

  const getHealthFactorColor = (factor: number) => {
    if (factor >= 2) return 'text-green-600';
    if (factor >= 1.5) return 'text-yellow-600';
    if (factor >= 1.1) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: LoanPosition['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'liquidated':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const openModal = (type: 'deposit' | 'borrow' | 'repay') => {
    setModalType(type);
    setShowModal(true);
    setAmount('');
    setTxHash('');
  };

  const closeModal = () => {
    setShowModal(false);
    setIsProcessing(false);
  };

  const simulateTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTxHash(mockTxHash);
      
      // Trigger AI risk assessment
      await triggerAIRiskAssessment();
      
      // Update portfolio if deposit
      if (modalType === 'deposit') {
        const newPosition: LoanPosition = {
          id: Date.now().toString(),
          chain: selectedChain,
          collateralAsset: selectedAsset,
          collateralAmount: parseFloat(amount),
          borrowedAsset: 'USDC',
          borrowedAmount: 0,
          interestRate: 0.045,
          liquidationThreshold: 0.75,
          healthFactor: 2.0,
          status: 'active'
        };
        setLoanPositions(prev => [...prev, newPosition]);
      }
      
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerAIRiskAssessment = async () => {
    try {
      const mockPortfolio = {
        assets: loanPositions.map(pos => ({
          symbol: pos.collateralAsset,
          value: pos.collateralAmount * (getAssetInfo(pos.collateralAsset)?.price || 0),
          allocation: 0
        })),
        totalValue: portfolioValue,
        chains: [...new Set(loanPositions.map(pos => pos.chain))]
      };

      const riskAssessment = await geminiService.getRiskAssessment(
        mockPortfolio,
        { marketVolatility: 'medium', gasFees: 'high' },
        { riskTolerance: 'moderate' }
      );

      if (riskAssessment.success) {
        setAiRiskScore(riskAssessment.riskAnalysis.riskScore);
        setAiRecommendations(riskAssessment.riskAnalysis.optimization);
      }
    } catch (error) {
      console.error('AI risk assessment failed:', error);
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'deposit':
        return 'Deposit Collateral';
      case 'borrow':
        return 'Borrow Assets';
      case 'repay':
        return 'Repay Loan';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Globe className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cross-Chain Lending
          </h1>
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Deposit collateral on any chain and borrow assets across the entire ecosystem. 
          Powered by ZetaChain's omnichain infrastructure and AI-powered risk management.
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Coins className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Portfolio Value</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${portfolioValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">Total Borrowed</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${totalBorrowed.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Health Factor</h3>
          </div>
          <p className={`text-2xl font-bold ${getHealthFactorColor(healthFactor)}`}>
            {healthFactor.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Wallet className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold">Active Loans</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {loanPositions.length}
          </p>
        </div>
      </div>

      {/* AI Risk Assessment */}
      {aiRiskScore !== null && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <span>AI Risk Assessment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Risk Score (1-10)</p>
              <p className={`text-3xl font-bold ${aiRiskScore <= 3 ? 'text-green-600' : aiRiskScore <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                {aiRiskScore}/10
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">AI Recommendations</p>
              <ul className="space-y-1">
                {aiRecommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => openModal('deposit')}
          className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Coins className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Deposit Collateral</h3>
          <p className="text-green-100 text-sm">Lock assets on any chain to borrow</p>
        </button>

        <button
          onClick={() => openModal('borrow')}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Borrow Assets</h3>
          <p className="text-blue-100 text-sm">Get instant loans across chains</p>
        </button>

        <button
          onClick={() => openModal('repay')}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Repay Loans</h3>
          <p className="text-purple-100 text-sm">Reduce debt and improve health</p>
        </button>
      </div>

      {/* Active Loan Positions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Active Loan Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collateral</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Factor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loanPositions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getChainInfo(position.chain)?.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getChainInfo(position.chain)?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {position.collateralAmount} {position.collateralAsset}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${(position.collateralAmount * (getAssetInfo(position.collateralAsset)?.price || 0)).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${position.borrowedAmount.toLocaleString()} {position.borrowedAsset}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(position.interestRate * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getHealthFactorColor(position.healthFactor)}`}>
                      {position.healthFactor.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(position.status)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {position.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Chain Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Chain</label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SUPPORTED_ASSETS.filter(asset => asset.chain === selectedChain || asset.chain === 'ethereum').map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
                {amount && (
                  <p className="text-sm text-gray-500 mt-1">
                    Value: ${calculateCollateralValue().toLocaleString()}
                    {modalType === 'deposit' && (
                      <span className="ml-2">
                        | Borrow Limit: ${calculateBorrowLimit().toLocaleString()}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Transaction Status */}
              {isProcessing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing transaction...</span>
                </div>
              )}

              {txHash && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Success!</strong> Transaction hash: {txHash.substring(0, 10)}...
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={simulateTransaction}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : `Confirm ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
              </button>
            </div>
          </div>
                 </div>
       )}
     </div>
   );
 };

export default CrossChainLending;
