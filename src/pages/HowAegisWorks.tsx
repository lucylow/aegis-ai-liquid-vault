import React, { useState } from 'react';
import { 
  Bitcoin, 
  Coins, 
  Brain, 
  Network, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  Lock,
  Sparkles,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

export const HowAegisWorks: React.FC = () => {
  const [btcDeposit, setBtcDeposit] = useState('');
  const [tokenizedCollateral, setTokenizedCollateral] = useState(false);
  const [aiRisk, setAiRisk] = useState<{ creditLimit: number; liquidationRisk: number } | null>(null);
  const [loanDistributed, setLoanDistributed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Simulated API calls
  const handleDepositBTC = async () => {
    if (!btcDeposit || +btcDeposit <= 0) return alert('Enter a valid BTC amount');
    alert(`Deposited ${btcDeposit} BTC and locked as native collateral.`);
    setTokenizedCollateral(false);
    setAiRisk(null);
    setLoanDistributed(false);
    setCurrentStep(2);
  };

  const handleCreateCollateralToken = () => {
    setTokenizedCollateral(true);
    setCurrentStep(3);
  };

  const handleFetchAIRisk = () => {
    // Mock risk results
    setAiRisk({ creditLimit: 5000, liquidationRisk: 12 });
    setCurrentStep(4);
  };

  const handleDistributeLoan = () => {
    if (!aiRisk) return alert('Fetch AI risk parameters first');
    setLoanDistributed(true);
  };

  const steps = [
    {
      id: 1,
      title: "Deposit Native BTC",
      subtitle: "Lock native asset",
      icon: Bitcoin,
      color: "from-orange-500 to-orange-600",
      description: "Users can deposit their native Bitcoin (BTC) directly into the Aegis protocol. The protocol locks the native asset securely on its home chain (Bitcoin network) without requiring users to swap or bridge it."
    },
    {
      id: 2,
      title: "Collateral Token Creation",
      subtitle: "Tokenize collateral",
      icon: Coins,
      color: "from-green-500 to-green-600",
      description: "Once the native asset is locked, Aegis creates a tokenized representation of the collateral on another blockchain. This token acts as proof of the locked asset and can be used seamlessly within the DeFi ecosystem."
    },
    {
      id: 3,
      title: "AI Risk Analysis",
      subtitle: "AI-optimized risk parameters",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      description: "Aegis leverages real-time AI-powered risk analysis to assess creditworthiness and liquidation risk. The AI considers wallet history, behavioral patterns, and liquidity profiles across chains."
    },
    {
      id: 4,
      title: "Loan Distribution",
      subtitle: "Cross-chain lending",
      icon: Network,
      color: "from-blue-500 to-blue-600",
      description: "Loans are distributed seamlessly across multiple blockchains based on collateral and AI risk assessment. Users can borrow on different chains without manual bridging."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              How Aegis Works
            </h1>
            <Sparkles className="w-12 h-12 text-secondary ml-4" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aegis transforms native assets into tokenized collateral across chains, uses AI to optimize risk parameters, 
            and distributes loans efficiently across multiple blockchains—all powered by ZetaChain's universal interoperability.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-primary">Interactive Demo</h2>
          
          {/* Step 1: Deposit BTC */}
          <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${steps[0].color} flex items-center justify-center`}>
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{steps[0].title}</h3>
                <p className="text-gray-400">{steps[0].subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                placeholder="Amount BTC"
                value={btcDeposit}
                onChange={(e) => setBtcDeposit(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white p-3 rounded-lg w-40"
                min="0"
                step="any"
              />
              <button
                onClick={handleDepositBTC}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Deposit BTC
              </button>
            </div>
            
            <p className="text-gray-300 text-sm">{steps[0].description}</p>
          </div>

          {/* Step 2: Tokenize Collateral */}
          <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${steps[1].color} flex items-center justify-center`}>
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{steps[1].title}</h3>
                <p className="text-gray-400">{steps[1].subtitle}</p>
              </div>
            </div>
            
            <button
              onClick={handleCreateCollateralToken}
              disabled={!btcDeposit || !+btcDeposit}
              className={`px-6 py-3 rounded-lg transition-all ${
                tokenizedCollateral 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              {tokenizedCollateral ? 'Collateral Token Created ✓' : 'Create Collateral Token'}
            </button>
            
            <p className="text-gray-300 text-sm mt-4">{steps[1].description}</p>
          </div>

          {/* Step 3: AI Risk Analysis */}
          <div className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${steps[2].color} flex items-center justify-center`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{steps[2].title}</h3>
                <p className="text-gray-400">{steps[2].subtitle}</p>
              </div>
            </div>
            
            <button
              onClick={handleFetchAIRisk}
              disabled={!tokenizedCollateral}
              className={`px-6 py-3 rounded-lg transition-all ${
                aiRisk 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              }`}
            >
              {aiRisk ? 'AI Risk Parameters Fetched ✓' : 'Fetch AI Risk Parameters'}
            </button>
            
            {aiRisk && (
              <div className="mt-4 bg-purple-900/30 p-4 rounded-lg border border-purple-500/30 max-w-sm">
                <p className="text-purple-200"><b>Credit Limit: </b>${aiRisk.creditLimit.toLocaleString()}</p>
                <p className="text-purple-200"><b>Liquidation Risk:</b> {aiRisk.liquidationRisk}%</p>
              </div>
            )}
            
            <p className="text-gray-300 text-sm mt-4">{steps[2].description}</p>
          </div>

          {/* Step 4: Loan Distribution */}
          <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${steps[3].color} flex items-center justify-center`}>
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{steps[3].title}</h3>
                <p className="text-gray-400">{steps[3].subtitle}</p>
              </div>
            </div>
            
            <button
              onClick={handleDistributeLoan}
              disabled={!aiRisk}
              className={`px-6 py-3 rounded-lg transition-all ${
                loanDistributed 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {loanDistributed ? 'Loan Distributed Across Chains ✓' : 'Distribute Loan'}
            </button>
            
            {loanDistributed && (
              <div className="mt-4 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30 max-w-xl">
                <p className="text-blue-200">
                  Loan is seamlessly allocated across multiple chains (e.g., borrow USDC on Avalanche, ZETA on Base) using ZetaChain's interoperability.
                </p>
              </div>
            )}
            
            <p className="text-gray-300 text-sm mt-4">{steps[3].description}</p>
          </div>
        </div>

        {/* Detailed Explanation */}
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
              <ArrowDown className="w-5 h-5 text-gray-500 mx-auto" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">ZetaChain - Cross-Chain Communication</span>
              </div>
              <ArrowDown className="w-5 h-5 text-gray-500 mx-auto" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Target Chains - Tokenized Collateral & Loans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowAegisWorks;
