'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Settings, Zap } from 'lucide-react';
import { aiSentimentService, SentimentAnalysis, TradingInsight, SocialPost } from '../../services/AISentimentService';

interface AIEnhancedTradingAssistantProps {
  selectedToken: string;
  currentPrice: number;
}

export default function AIEnhancedTradingAssistant({ selectedToken, currentPrice }: AIEnhancedTradingAssistantProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelStatus, setModelStatus] = useState<{ status: string; models: string[]; currentModel: string } | null>(null);
  const [tradingInsights, setTradingInsights] = useState<TradingInsight[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'sentiment' | 'settings'>('chat');

  useEffect(() => {
    checkOllamaStatus();
    generateMockSentimentData();
  }, [selectedToken]);

  const checkOllamaStatus = async () => {
    try {
      const status = await aiSentimentService.getModelStatus();
      setModelStatus(status);
    } catch (error) {
      console.error('Failed to check Ollama status:', error);
      // Set fallback status
      setModelStatus({
        status: 'offline',
        models: ['llama2'],
        currentModel: 'llama2'
      });
    }
  };

  const generateMockSentimentData = () => {
    // Generate mock social posts for demonstration
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        text: `${selectedToken} is looking bullish today! 🚀 The technical indicators are strong and volume is increasing.`,
        author: 'crypto_analyst',
        timestamp: new Date().toISOString(),
        platform: 'farcaster',
        engagement: 156,
        mentions: [selectedToken]
      },
      {
        id: '2',
        text: `Just bought more ${selectedToken} on this dip. Fundamentals haven't changed, this is a great entry point.`,
        author: 'defi_trader',
        timestamp: new Date().toISOString(),
        platform: 'farcaster',
        engagement: 89,
        mentions: [selectedToken]
      },
      {
        id: '3',
        text: `${selectedToken} showing some bearish signals. RSI is overbought and we might see a correction soon.`,
        author: 'technical_trader',
        timestamp: new Date().toISOString(),
        platform: 'farcaster',
        engagement: 234,
        mentions: [selectedToken]
      }
    ];

    // Analyze sentiment and generate insights
    analyzeSentimentAndGenerateInsights(mockPosts);
  };

  const analyzeSentimentAndGenerateInsights = async (posts: SocialPost[]) => {
    try {
      setIsAnalyzing(true);
      
      // Analyze sentiment using AI service
      const analyses = await aiSentimentService.analyzeSentiment(posts);
      setSentimentData(analyses);
      
      // Generate trading insights
      try {
        const insights = await aiSentimentService.generateTradingInsights(selectedToken, analyses, currentPrice);
        setTradingInsights(insights);
      } catch (error) {
        console.error('Failed to generate trading insights:', error);
        // Generate fallback insights
        const fallbackInsights: TradingInsight[] = posts.map((post, index) => ({
          token: selectedToken,
          sentiment: analyses[index] || {
            text: post.text,
            sentiment: 'neutral',
            confidence: 0.7,
            keywords: [selectedToken],
            emotion: 'neutral',
            tradingSignal: 'neutral',
            impact: 'medium',
            timestamp: new Date().toISOString(),
            urgency: 'medium',
            marketContext: 'General market discussion',
            influencerScore: 0.5,
            reach: post.engagement * 10,
            engagement: post.engagement,
            sourceCredibility: 'medium'
          },
          priceImpact: index === 0 ? 2.5 : index === 1 ? 1.8 : -1.2,
          confidence: 0.7,
          recommendation: index === 0 
            ? `Consider buying ${selectedToken} as sentiment is positive and technical indicators are strong.`
            : index === 1
            ? `${selectedToken} shows good fundamentals. Monitor for entry opportunities.`
            : `Exercise caution with ${selectedToken}. Consider waiting for better entry points.`,
          riskLevel: index === 0 ? 'low' : index === 1 ? 'medium' : 'high',
          timestamp: new Date().toISOString()
        }));
        setTradingInsights(fallbackInsights);
      }
      
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      // Use fallback data with enhanced fields
      setSentimentData(posts.map(post => ({
        text: post.text,
        sentiment: 'neutral',
        confidence: 0.7,
        keywords: [selectedToken],
        emotion: 'neutral',
        tradingSignal: 'neutral',
        impact: 'medium',
        timestamp: new Date().toISOString(),
        // Enhanced fields
        urgency: 'medium',
        marketContext: 'General market discussion',
        influencerScore: 0.5,
        reach: post.engagement * 10,
        engagement: post.engagement,
        sourceCredibility: 'medium'
      })));

      // Generate fallback trading insights
      const fallbackInsights: TradingInsight[] = posts.map((post, index) => ({
        token: selectedToken,
        sentiment: {
          text: post.text,
          sentiment: index === 0 ? 'positive' : index === 1 ? 'positive' : 'negative',
          confidence: 0.7,
          keywords: [selectedToken],
          emotion: index === 0 ? 'excited' : index === 1 ? 'optimistic' : 'worried',
          tradingSignal: index === 0 ? 'bullish' : index === 1 ? 'bullish' : 'bearish',
          impact: 'medium',
          timestamp: new Date().toISOString(),
          urgency: 'medium',
          marketContext: 'General market discussion',
          influencerScore: 0.5,
          reach: post.engagement * 10,
          engagement: post.engagement,
          sourceCredibility: 'medium'
        },
        priceImpact: index === 0 ? 2.5 : index === 1 ? 1.8 : -1.2,
        confidence: 0.7,
        recommendation: index === 0 
          ? `Consider buying ${selectedToken} as sentiment is positive and technical indicators are strong.`
          : index === 1
          ? `${selectedToken} shows good fundamentals. Monitor for entry opportunities.`
          : `Exercise caution with ${selectedToken}. Consider waiting for better entry points.`,
        riskLevel: index === 0 ? 'low' : index === 1 ? 'medium' : 'high',
        timestamp: new Date().toISOString()
      }));

      setTradingInsights(fallbackInsights);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI response based on question type
      const aiResponse = await generateAIResponse(question);
      setResponse(aiResponse);
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIResponse = async (question: string): Promise<string> => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('prediction')) {
      return `Based on current market sentiment and technical analysis, ${selectedToken} shows ${tradingInsights[0]?.sentiment.tradingSignal || 'neutral'} signals. The AI sentiment analysis indicates ${tradingInsights[0]?.sentiment.emotion || 'neutral'} market sentiment with ${Math.round((tradingInsights[0]?.confidence || 0.5) * 100)}% confidence.`;
    } else if (lowerQuestion.includes('buy') || lowerQuestion.includes('sell')) {
      const insight = tradingInsights[0];
      if (insight) {
        return insight.recommendation;
      }
      return `For ${selectedToken}, I recommend monitoring the current sentiment trends before making trading decisions.`;
    } else if (lowerQuestion.includes('sentiment') || lowerQuestion.includes('mood')) {
      const positiveCount = sentimentData.filter(s => s.sentiment === 'positive').length;
      const negativeCount = sentimentData.filter(s => s.sentiment === 'negative').length;
      const overallSentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';
      
      return `Current social sentiment for ${selectedToken} is ${overallSentiment}. I've analyzed ${sentimentData.length} recent posts: ${positiveCount} positive, ${negativeCount} negative, and ${sentimentData.length - positiveCount - negativeCount} neutral.`;
    } else {
      return `I'm your AI trading assistant for ${selectedToken}. I can help you with price analysis, sentiment insights, and trading recommendations. Ask me about market sentiment, price predictions, or trading strategies!`;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTradingSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Trading Assistant</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-200">Powered by Ollama AI</span>
              {modelStatus && (
                <span className={`px-2 py-1 rounded text-xs ${
                  modelStatus.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {modelStatus.status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setActiveTab('settings')}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'chat', label: 'Chat', icon: <Brain className="w-4 h-4" /> },
          { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'sentiment', label: 'Sentiment', icon: <Zap className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* AI Chat Interface */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me about market sentiment, price predictions, or trading strategies..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isAnalyzing}
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !question.trim()}
                  className="absolute right-2 top-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-4 py-1 rounded text-sm transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
                </button>
              </div>
            </form>

            {/* AI Response */}
            {response && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-white font-medium mb-2">AI Response</div>
                    <div className="text-gray-200">{response}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Quick Questions:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'What is the current market sentiment?',
                  'Should I buy or sell?',
                  'What are the price predictions?',
                  'How reliable is the sentiment data?'
                ].map((quickQ, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(quickQ)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                  >
                    {quickQ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">AI Trading Insights</h4>
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              )}
            </div>
            
            {tradingInsights.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No trading insights available yet. Ask the AI assistant to generate insights!
              </div>
            ) : (
              <div className="space-y-3">
                {tradingInsights.map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTradingSignalIcon(insight.sentiment.tradingSignal)}
                        <div>
                          <div className="text-white font-medium">{insight.token}</div>
                          <div className="text-gray-400 text-sm">
                            {insight.sentiment.tradingSignal.toUpperCase()} • {insight.riskLevel.toUpperCase()} Risk
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          insight.priceImpact > 0 ? 'text-green-400' : 
                          insight.priceImpact < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {insight.priceImpact > 0 ? '+' : ''}{insight.priceImpact.toFixed(2)}%
                        </div>
                        <div className="text-gray-400 text-sm">
                          {Math.round(insight.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-gray-300 text-sm mb-3">{insight.recommendation}</div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Impact: {insight.sentiment.impact}</span>
                      <span>Emotion: {insight.sentiment.emotion}</span>
                      <span>Keywords: {insight.sentiment.keywords.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Social Sentiment Analysis</h4>
            
            {sentimentData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No sentiment data available. Analyzing social posts...
              </div>
            ) : (
              <div className="space-y-3">
                {sentimentData.map((sentiment, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-white text-sm mb-2">{sentiment.text}</div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`${getSentimentColor(sentiment.sentiment)} font-medium`}>
                            {sentiment.sentiment.toUpperCase()}
                          </span>
                          <span className="text-gray-400">Confidence: {Math.round(sentiment.confidence * 100)}%</span>
                          <span className="text-gray-400">Impact: {sentiment.impact}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTradingSignalIcon(sentiment.tradingSignal)}
                        <span className="text-xs text-gray-400">{sentiment.tradingSignal}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Emotion: {sentiment.emotion}</span>
                      <span>Keywords: {sentiment.keywords.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">AI Assistant Settings</h4>
            
            {/* Model Status */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-2">Ollama Status</div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  modelStatus?.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-white">
                  {modelStatus?.status === 'online' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Current Model */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-2">Current AI Model</div>
              <div className="text-white font-medium">{modelStatus?.currentModel || 'llama2'}</div>
            </div>

            {/* Available Models */}
            {modelStatus?.models && modelStatus.models.length > 0 && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                <div className="text-sm text-gray-400 mb-2">Available Models</div>
                <div className="space-y-2">
                  {modelStatus.models.map((model) => (
                    <div key={model} className="flex items-center justify-between">
                      <span className="text-white text-sm">{model}</span>
                      <button
                        onClick={() => aiSentimentService.changeModel(model)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configuration */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <div className="text-sm text-gray-400 mb-2">Configuration</div>
              <div className="space-y-2 text-sm text-white">
                <div>• Sentiment Analysis: Enabled</div>
                <div>• Trading Insights: Enabled</div>
                <div>• Real-time Updates: Enabled</div>
                <div>• Fallback Analysis: Enabled</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
