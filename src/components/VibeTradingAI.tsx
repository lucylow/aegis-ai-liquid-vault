'use client';

import React, { useState, useEffect } from 'react';
import TradingChart from './VibeTrading/TradingChart';
import TokenSelector from './VibeTrading/TokenSelector';
import OllamaTradingAssistant from './VibeTrading/OllamaTradingAssistant';
import SystemStatusRow from './VibeTrading/SystemStatusRow';
import TradeForm from './VibeTrading/TradeForm';
import AegisSecurityDashboard from './VibeTrading/AegisSecurityDashboard';
import AIEnhancedTradingAssistant from './VibeTrading/AIEnhancedTradingAssistant';
import AIMarketAnalysisDashboard from './VibeTrading/AIMarketAnalysisDashboard';
import AIErrorBoundary from './VibeTrading/AIErrorBoundary';

interface TrendingData {
  analysis: {
    totalCasts: number;
    totalTokenMentions: number;
    channelsAnalyzed: number;
  };
  trendingTokens: {
    baseChain: Array<{
      token: string;
      mentionCount: number;
      casts: number;
      sampleText: string[];
    }>;
  };
}

export default function VibeTradingAI() {
  const [trendingData, setTrendingData] = useState<TrendingData>({
    analysis: { totalCasts: 0, totalTokenMentions: 0, channelsAnalyzed: 0 },
    trendingTokens: { baseChain: [] }
  });
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d' | '90d'>('1h');
  const [currentMentionIndex, setCurrentMentionIndex] = useState(0);
  const [highlightedMentionIndex, setHighlightedMentionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMentions, setFilteredMentions] = useState<any[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Navigation functions for social mentions
  const nextMention = () => {
    if (filteredMentions.length > 0) {
      const maxIndex = filteredMentions.length - 1;
      const newIndex = currentMentionIndex < maxIndex ? currentMentionIndex + 1 : 0;
      setCurrentMentionIndex(newIndex);
      setHighlightedMentionIndex(newIndex);
    }
  };

  const prevMention = () => {
    if (filteredMentions.length > 0) {
      const maxIndex = filteredMentions.length - 1;
      const newIndex = currentMentionIndex > 0 ? currentMentionIndex - 1 : maxIndex;
      setCurrentMentionIndex(newIndex);
      setHighlightedMentionIndex(newIndex);
    }
  };

  // Function to handle mention selection from chart
  const handleMentionSelect = (index: number) => {
    if (index >= 0 && index < filteredMentions.length) {
      setCurrentMentionIndex(index);
      setHighlightedMentionIndex(index);
    }
  };

  useEffect(() => {
    // Check if required dependencies are available
    const checkDependencies = () => {
      const missingDeps = [];
      
      // Check if Chart.js is available
      if (typeof window !== 'undefined' && !(window as any).Chart) {
        missingDeps.push('Chart.js');
      }
      
      // Check if Ollama endpoint is accessible
      fetch('http://localhost:11434/api/tags')
        .catch(() => missingDeps.push('Ollama AI'));
      
      if (missingDeps.length > 0) {
        console.warn('Missing dependencies:', missingDeps);
      }
    };
    
    checkDependencies();
    fetchTrendingTokens();
  }, []);

  // Refetch data when time range changes
  useEffect(() => {
    if (trendingData.trendingTokens.baseChain.length > 0) {
      fetchTrendingTokens();
    }
  }, [timeRange]);

  const fetchTrendingTokens = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      
      // For now, we'll use mock data until the backend is set up
      // In production, this would fetch from your AEGIS backend
      const mockData = {
        analysis: {
          totalCasts: 150,
          totalTokenMentions: 89,
          channelsAnalyzed: 3
        },
        trendingTokens: {
          baseChain: [{
            token: 'ETH',
            mentionCount: 89,
            casts: 150,
            sampleText: [
              "ETH is looking bullish today! 🚀",
              "Great entry point for ETH right now",
              "ETH sentiment is very positive"
            ]
          }]
        }
      };
      
      setTrendingData(mockData);
      setSelectedToken('ETH');
      
      // Mock mentions data
      const mockMentions = Array.from({ length: 89 }, (_, i) => ({
        id: i,
        text: `ETH mention ${i + 1}`,
        timestamp: new Date(Date.now() - i * 60000),
        sentiment: ['positive', 'negative', 'neutral'][i % 3] as 'positive' | 'negative' | 'neutral'
      }));
      
      setFilteredMentions(mockMentions);
      setCurrentMentionIndex(0);
      setHighlightedMentionIndex(0);
      
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch trending tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSelect = (token: string) => {
    if (token && typeof token === 'string') {
      setSelectedToken(token);
    }
  };

  // Open Base Mini App trade interface
  const openBaseTrade = async (token: string) => {
    try {
      console.log(`Opening Base trade for ${token}`);
      
      // For now, redirect to a trading interface
      // In production, this would use Base's trading SDK
      const tradeUrl = `https://app.uniswap.org/swap?chain=base&inputCurrency=ETH&outputCurrency=${token}`;
      window.open(tradeUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Failed to open Base trade:', error);
      return false;
    }
  };

  // Error fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Component Error</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-blue-700 font-medium">Analyzing Base chain for trending tokens...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 shadow-sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <button
            onClick={fetchTrendingTokens}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!trendingData) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 shadow-sm">
        <p className="text-center text-red-600 font-medium">Failed to load trending data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4">
      {/* Unified Trending & Controls Panel - Mobile-First Design */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 shadow-sm">
        {/* Compact Title */}
        <div className="text-center mb-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">🔥 Trending $ETH mentions on Farcaster</h2>
        </div>
        
        {/* Inline Controls - Single Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm min-h-[40px] min-w-[60px] shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">1H</option>
            <option value="24h">24H</option>
            <option value="7d">7D</option>
            <option value="30d">30D</option>
            <option value="90d">90D</option>
          </select>

          {/* Token Selector */}
          <TokenSelector
            selectedToken={selectedToken}
            onTokenSelect={handleTokenSelect}
            trendingTokens={trendingData.trendingTokens.baseChain}
          />

          {/* Trade Button */}
          <button
            onClick={() => selectedToken && openBaseTrade(selectedToken)}
            disabled={!selectedToken}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed shadow-sm"
          >
            Trade {selectedToken || 'Token'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{trendingData.analysis.totalCasts}</div>
            <div className="text-xs text-gray-600 font-medium">Total Casts</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{trendingData.analysis.totalTokenMentions}</div>
            <div className="text-xs text-gray-600 font-medium">Mentions</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{trendingData.analysis.channelsAnalyzed}</div>
            <div className="text-xs text-gray-600 font-medium">Channels</div>
          </div>
        </div>
      </div>

      {/* Trading Chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <TradingChart
          selectedToken={selectedToken || 'ETH'}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onMentionSelect={handleMentionSelect}
          currentMentionIndex={currentMentionIndex}
          highlightedMentionIndex={highlightedMentionIndex}
        />
      </div>

      {/* Social Mentions Panel */}
      {filteredMentions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Social Sentiment Analysis</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMention}
                className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300 shadow-sm"
              >
                ←
              </button>
              <span className="text-gray-700 text-sm font-medium">
                {currentMentionIndex + 1} / {filteredMentions.length}
              </span>
              <button
                onClick={nextMention}
                className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg transition-colors border border-gray-300 shadow-sm"
              >
                →
              </button>
            </div>
          </div>

          {filteredMentions[currentMentionIndex] && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  filteredMentions[currentMentionIndex].sentiment === 'positive' ? 'bg-green-500' :
                  filteredMentions[currentMentionIndex].sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-700 text-sm capitalize font-medium">
                  {filteredMentions[currentMentionIndex].sentiment} sentiment
                </span>
                <span className="text-gray-500 text-xs">
                  {filteredMentions[currentMentionIndex].timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 text-lg">
                "{filteredMentions[currentMentionIndex].text}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced AI Trading Assistant */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200 shadow-sm">
        <AIErrorBoundary>
          <AIEnhancedTradingAssistant 
            selectedToken={selectedToken || 'ETH'} 
            currentPrice={2500}
          />
        </AIErrorBoundary>
      </div>

      {/* AI Market Analysis Dashboard */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200 shadow-sm">
        <AIErrorBoundary>
          <AIMarketAnalysisDashboard 
            selectedToken={selectedToken || 'ETH'} 
            currentPrice={2500}
          />
        </AIErrorBoundary>
      </div>

      {/* Security-Integrated Trading Form */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 shadow-sm">
        <AIErrorBoundary>
          <TradeForm 
            selectedToken={selectedToken || 'ETH'} 
            onTradeExecute={(trade) => {
              console.log('Trade executed with AEGIS security:', trade);
              // Here you would integrate with Base chain trading
            }}
          />
        </AIErrorBoundary>
      </div>

      {/* AEGIS Security Dashboard */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200 shadow-sm">
        <AIErrorBoundary>
          <AegisSecurityDashboard />
        </AIErrorBoundary>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
        <SystemStatusRow />
      </div>
    </div>
  );
}
