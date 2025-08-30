'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '../../contexts/WalletContext';
import { useAegisSecurity } from '../../contexts/AegisSecurityContext';

interface PriceData {
  price: number;
  timestamp: Date;
}

interface SentimentData {
  timestamp: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  text: string;
  author: {
    username: string;
    displayName: string;
  };
}

interface TradingChartProps {
  selectedToken: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '1h' | '24h' | '7d' | '30d' | '90d') => void;
  onMentionSelect?: (index: number) => void;
  currentMentionIndex?: number;
  highlightedMentionIndex?: number | null;
}

export default function TradingChart({ 
  selectedToken, 
  timeRange, 
  onTimeRangeChange, 
  onMentionSelect, 
  currentMentionIndex, 
  highlightedMentionIndex 
}: TradingChartProps) {
  // AEGIS Integration
  const { currentBlockchain, isConnected, address } = useWallet();
  const { securityStatus, activeThreats } = useAegisSecurity();

  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [displayToken, setDisplayToken] = useState<string>(selectedToken);
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        fetchChartData();
        fetchSentimentData();
        
        // Refresh data every 2 minutes
        const interval = setInterval(() => {
          fetchChartData();
          fetchSentimentData();
          setLastUpdate(new Date());
        }, 2 * 60 * 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error in TradingChart useEffect:', error);
        setHasError(true);
      }
    }
  }, [selectedToken, timeRange, mounted]);

  // Update when blockchain changes
  useEffect(() => {
    if (mounted && currentBlockchain) {
      setBlockchainInfo(currentBlockchain);
      fetchChartData();
      fetchSentimentData();
    }
  }, [currentBlockchain, mounted]);

  const fetchChartData = async () => {
    try {
      // Use real blockchain data from AEGIS
      const chain = currentBlockchain;
      if (!chain) {
        console.log('No blockchain selected, using mock data');
        generateMockPriceData();
        return;
      }

      // For now, generate mock price data based on blockchain
      // In production, this would fetch from your AEGIS backend
      const hoursMap: Record<'1h' | '24h' | '7d' | '30d' | '90d', number> = { 
        '1h': 1, '24h': 24, '7d': 24*7, '30d': 24*30, '90d': 24*90 
      };
      const hours = hoursMap[timeRange];
      const now = new Date();
      
      // Generate realistic price data based on blockchain
      const basePrice = getBasePriceForBlockchain(chain.id);
      const volatility = getVolatilityForBlockchain(chain.id);
      
      const mockPrices = Array.from({ length: hours * 60 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (hours * 60 - i) * 60000);
        const randomChange = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + randomChange);
        
        return {
          price: parseFloat(price.toFixed(6)),
          timestamp
        };
      });
      
      setPriceData(mockPrices);
      
      if (mockPrices.length > 0) {
        const latest = mockPrices[mockPrices.length - 1];
        const earliest = mockPrices[0];
        setCurrentPrice(latest.price);
        setPriceChange(((latest.price - earliest.price) / earliest.price) * 100);
      }
      
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setHasError(true);
    }
  };

  const generateMockPriceData = () => {
    const hoursMap: Record<'1h' | '24h' | '7d' | '30d' | '90d', number> = { 
      '1h': 1, '24h': 24, '7d': 24*7, '30d': 24*30, '90d': 24*90 
    };
    const hours = hoursMap[timeRange];
    const now = new Date();
    
    const mockPrices = Array.from({ length: hours * 60 }, (_, i) => {
      const timestamp = new Date(now.getTime() - (hours * 60 - i) * 60000);
      const basePrice = 2500; // Default ETH price
      const volatility = 0.02; // 2% volatility
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange);
      
      return {
        price: parseFloat(price.toFixed(2)),
        timestamp
      };
    });
    
    setPriceData(mockPrices);
    
    if (mockPrices.length > 0) {
      const latest = mockPrices[mockPrices.length - 1];
      const earliest = mockPrices[0];
      setCurrentPrice(latest.price);
      setPriceChange(((latest.price - earliest.price) / earliest.price) * 100);
    }
  };

  const getBasePriceForBlockchain = (chainId: string): number => {
    const priceMap: Record<string, number> = {
      'ethereum': 2500,
      'base': 2500,
      'zetachain': 1.2,
      'avalanche': 25,
      'solana': 100,
      'bitcoin': 45000,
      'polygon': 0.8,
      'arbitrum': 2500
    };
    return priceMap[chainId] || 2500;
  };

  const getVolatilityForBlockchain = (chainId: string): number => {
    const volatilityMap: Record<string, number> = {
      'ethereum': 0.03,
      'base': 0.025,
      'zetachain': 0.05,
      'avalanche': 0.04,
      'solana': 0.06,
      'bitcoin': 0.035,
      'polygon': 0.045,
      'arbitrum': 0.03
    };
    return volatilityMap[chainId] || 0.03;
  };

  const fetchSentimentData = async () => {
    try {
      // Mock sentiment data based on current blockchain
      const chain = currentBlockchain;
      const mockSentiments = Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 300000), // 5 min intervals
        sentiment: ['positive', 'negative', 'neutral'][i % 3] as 'positive' | 'negative' | 'neutral',
        text: `Sample sentiment for ${selectedToken} on ${chain?.name || 'blockchain'} ${i + 1}`,
        author: {
          username: `user${i + 1}`,
          displayName: `User ${i + 1}`
        }
      }));
      
      setSentimentData(mockSentiments);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="bg-white/5 rounded-lg p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-200">Initializing chart...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-200 mb-4">Failed to load chart data</p>
        <button 
          onClick={() => {
            setHasError(false);
            fetchChartData();
            fetchSentimentData();
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-lg p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-200">Loading chart data...</p>
      </div>
    );
  }

  try {
    return (
      <div className="space-y-4">
        {/* Chart Header with Blockchain Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">
              ${selectedToken} Price Chart
            </h3>
            {blockchainInfo && (
              <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-lg">
                <span className="text-lg">{blockchainInfo.icon}</span>
                <span className="text-sm text-gray-300">{blockchainInfo.name}</span>
              </div>
            )}
            {currentPrice && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  ${currentPrice.toFixed(6)}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  priceChange >= 0 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Last updated:</span>
            <span className="text-sm text-white">
              {mounted ? formatDistanceToNow(lastUpdate, { addSuffix: true }) : '...'}
            </span>
          </div>
        </div>

        {/* Blockchain Status */}
        {blockchainInfo && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Network:</span>
                <span className="text-white font-medium">{blockchainInfo.name}</span>
                <span className="text-gray-400">Chain ID:</span>
                <span className="text-white font-medium">{blockchainInfo.chainId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Status */}
        {securityStatus !== 'secure' && (
          <div className={`bg-gradient-to-r ${
            securityStatus === 'warning' 
              ? 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30' 
              : 'from-red-600/20 to-pink-600/20 border-red-500/30'
          } rounded-lg p-3 border`}>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-medium ${
                securityStatus === 'warning' ? 'text-yellow-200' : 'text-red-200'
              }`}>
                ⚠️ Security Alert: {securityStatus.toUpperCase()}
              </span>
              <span className="text-gray-400">
                ({activeThreats.length} active threats)
              </span>
            </div>
          </div>
        )}

        {/* Simplified Chart Display */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/20">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-white mb-2">Price Chart</h4>
            <p className="text-gray-300 text-sm">
              Chart visualization for {selectedToken} on {blockchainInfo?.name || 'blockchain'}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              {priceData.length} data points loaded for {timeRange} timeframe
            </p>
            {blockchainInfo && (
              <div className="mt-3 p-2 bg-white/5 rounded text-xs text-gray-400">
                <div>Gas Token: {blockchainInfo.gasToken}</div>
                <div>Estimated Gas: {blockchainInfo.estimatedGas?.deposit || 'N/A'} {blockchainInfo.gasToken}</div>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Overview */}
        {sentimentData.length > 0 && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">Recent Sentiment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['positive', 'negative', 'neutral'].map((sentiment) => {
                const count = sentimentData.filter(s => s.sentiment === sentiment).length;
                const percentage = (count / sentimentData.length) * 100;
                
                return (
                  <div key={sentiment} className="text-center">
                    <div className={`text-2xl font-bold ${
                      sentiment === 'positive' ? 'text-green-400' :
                      sentiment === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {count}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{sentiment}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        {onTimeRangeChange && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">Time Range:</span>
            {(['1h', '24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}

        {/* Wallet Connection Status */}
        {!isConnected && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
            <p className="text-blue-200 text-sm">
              🔗 Connect your wallet to view real-time trading data and execute trades
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering TradingChart:', error);
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-200 mb-4">Error rendering chart</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Reload Page
        </button>
      </div>
    );
  }
}
