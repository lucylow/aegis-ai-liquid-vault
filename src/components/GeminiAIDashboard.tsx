import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Zap, 
  Activity,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  geminiService, 
  type CreditAnalysis, 
  type RiskAnalysis 
} from '../services/geminiService';

interface AIInsight {
  id: string;
  type: 'credit' | 'risk' | 'recommendation' | 'analysis';
  title: string;
  content: string;
  timestamp: string;
  status: 'loading' | 'success' | 'error';
}

const GeminiAIDashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [serviceHealth, setServiceHealth] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  // Check service health on component mount
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

      const insight = insights.find(i => i.title === 'AI Credit Score Analysis');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? {
                ...i,
                content: `Credit Score: ${creditScore.creditAnalysis.creditScore}/100\nRisk Level: ${creditScore.creditAnalysis.riskLevel}\nMax Loan: $${creditScore.creditAnalysis.maxLoanAmount.toLocaleString()}`,
                status: 'success'
              }
            : i
        ));
      }
    } catch (error) {
      const insight = insights.find(i => i.title === 'AI Credit Score Analysis');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: 'Failed to generate credit score', status: 'error' }
            : i
        ));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRiskAssessment = async () => {
    setIsGenerating(true);
    addInsight({
      type: 'risk',
      title: 'Portfolio Risk Assessment',
      content: 'Analyzing portfolio risks...',
      status: 'loading'
    });

    try {
      const mockPortfolio = {
        assets: [
          { symbol: 'ETH', value: 5000, allocation: 40 },
          { symbol: 'BTC', value: 3000, allocation: 24 },
          { symbol: 'SOL', value: 2000, allocation: 16 },
          { symbol: 'USDC', value: 2500, allocation: 20 }
        ],
        totalValue: 12500,
        chains: ['Ethereum', 'Solana', 'Avalanche']
      };

      const riskAssessment = await geminiService.getRiskAssessment(
        mockPortfolio,
        { marketVolatility: 'medium', gasFees: 'high' },
        { riskTolerance: 'moderate' }
      );

      const insight = insights.find(i => i.title === 'Portfolio Risk Assessment');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? {
                ...i,
                content: `Risk Score: ${riskAssessment.riskAnalysis.riskScore}/10\nThreats: ${riskAssessment.riskAnalysis.threats.slice(0, 2).join(', ')}`,
                status: 'success'
              }
            : i
        ));
      }
    } catch (error) {
      const insight = insights.find(i => i.title === 'Portfolio Risk Assessment');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: 'Failed to generate risk assessment', status: 'error' }
            : i
        ));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLendingRecommendations = async () => {
    setIsGenerating(true);
    addInsight({
      type: 'recommendation',
      title: 'AI Lending Recommendations',
      content: 'Generating personalized recommendations...',
      status: 'loading'
    });

    try {
      const mockUserProfile = {
        creditScore: 78,
        totalCollateral: 8000,
        activeLoans: 2,
        preferredChains: ['Ethereum', 'Avalanche']
      };

      const mockMarketData = {
        ethPrice: 3200,
        btcPrice: 45000,
        avgInterestRate: 0.045,
        marketTrend: 'bullish'
      };

      const recommendations = await geminiService.getLendingRecommendations(
        mockUserProfile,
        mockMarketData
      );

      const insight = insights.find(i => i.title === 'AI Lending Recommendations');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: recommendations, status: 'success' }
            : i
        ));
      }
    } catch (error) {
      const insight = insights.find(i => i.title === 'AI Lending Recommendations');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: 'Failed to generate recommendations', status: 'error' }
            : i
        ));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    addInsight({
      type: 'analysis',
      title: 'Custom AI Analysis',
      content: 'Processing your request...',
      status: 'loading'
    });

    try {
      const response = await geminiService.generateContent(prompt, 'gemini-2.0-flash', 800, 0.7);
      setGeneratedText(response.generatedText);

      const insight = insights.find(i => i.title === 'Custom AI Analysis');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: response.generatedText, status: 'success' }
            : i
        ));
      }
    } catch (error) {
      const insight = insights.find(i => i.title === 'Custom AI Analysis');
      if (insight) {
        setInsights(prev => prev.map(i => 
          i.id === insight.id 
            ? { ...i, content: 'Failed to process custom prompt', status: 'error' }
            : i
        ));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: AIInsight['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'credit':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'risk':
        return <Shield className="w-5 h-5 text-orange-500" />;
      case 'recommendation':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'analysis':
        return <Brain className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gemini AI Dashboard
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          AI-powered insights for your DeFi portfolio. Get real-time credit scoring, risk assessment, 
          and personalized recommendations powered by Google's Gemini AI.
        </p>
        
        {/* Service Status */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            serviceHealth === 'healthy' ? 'bg-green-500' : 
            serviceHealth === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <span className="text-sm text-gray-600">
            AI Service: {serviceHealth === 'healthy' ? 'Online' : 
                        serviceHealth === 'unhealthy' ? 'Offline' : 'Checking...'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={generateCreditScore}
          disabled={isGenerating || serviceHealth !== 'healthy'}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">AI Credit Score</h3>
          <p className="text-blue-100 text-sm">Get instant AI-powered credit assessment</p>
        </button>

        <button
          onClick={generateRiskAssessment}
          disabled={isGenerating || serviceHealth !== 'healthy'}
          className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Shield className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
          <p className="text-orange-100 text-sm">Analyze portfolio risks with AI</p>
        </button>

        <button
          onClick={generateLendingRecommendations}
          disabled={isGenerating || serviceHealth !== 'healthy'}
          className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Zap className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
          <p className="text-yellow-100 text-sm">Get personalized lending advice</p>
        </button>
      </div>

      {/* Custom Prompt */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <span>Custom AI Analysis</span>
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Gemini AI anything about your portfolio, DeFi strategies, or market analysis..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating || serviceHealth !== 'healthy'}
          />
          <button
            onClick={handleCustomPrompt}
            disabled={!prompt.trim() || isGenerating || serviceHealth !== 'healthy'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask AI'}
          </button>
        </div>
        {generatedText && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">AI Response:</h4>
            <p className="text-purple-700 whitespace-pre-wrap">{generatedText}</p>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <span>AI Insights & Analysis</span>
        </h3>
        
        {insights.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No AI insights yet. Use the quick actions above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      {getStatusIcon(insight.status)}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{insight.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(insight.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Information */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">About Gemini AI Integration</h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          This dashboard uses Google's Gemini 2.0 Flash model to provide real-time AI analysis. 
          All requests are securely proxied through our backend to protect your API keys. 
          The AI can analyze your DeFi portfolio, assess risks, generate credit scores, and provide 
          personalized recommendations for optimal lending strategies.
        </p>
      </div>
         </div>
   );
 };

export default GeminiAIDashboard;
