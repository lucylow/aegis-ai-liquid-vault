import React, { useState, useEffect } from 'react';
import { fetchMarketData } from '../../services/api';

interface MarketData {
  btcPrice: number;
  ethPrice: number;
  solPrice: number;
  maticPrice: number;
  marketCap: number;
  volume24h: number;
  fearGreedIndex: number;
  volatilityIndex: number;
}

const MarketTrends: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketData();
        setMarketData(data as MarketData);
      } catch (error) {
        console.error('Error loading market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const getFearGreedLabel = (index: number) => {
    if (index >= 80) return 'Extreme Greed';
    if (index >= 70) return 'Greed';
    if (index >= 50) return 'Neutral';
    if (index >= 30) return 'Fear';
    if (index >= 20) return 'Extreme Fear';
    return 'Extreme Fear';
  };

  const getFearGreedColor = (index: number) => {
    if (index >= 70) return 'text-green-600 bg-green-100';
    if (index >= 50) return 'text-yellow-600 bg-yellow-100';
    if (index >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getVolatilityColor = (index: number) => {
    if (index <= 20) return 'text-green-600 bg-green-100';
    if (index <= 40) return 'text-yellow-600 bg-yellow-100';
    if (index <= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Market Trends</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Market Cap</p>
          <p className="text-lg font-bold text-gray-800">
            ${(marketData.marketCap / 1000000000).toFixed(1)}B
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">24h Volume</p>
          <p className="text-lg font-bold text-gray-800">
            ${(marketData.volume24h / 1000000000).toFixed(1)}B
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Fear & Greed</p>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getFearGreedColor(marketData.fearGreedIndex)}`}>
            {marketData.fearGreedIndex}
          </span>
          <p className="text-xs text-gray-500 mt-1">{getFearGreedLabel(marketData.fearGreedIndex)}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Volatility</p>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getVolatilityColor(marketData.volatilityIndex)}`}>
            {marketData.volatilityIndex}
          </span>
        </div>
      </div>

      {/* Asset Prices */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Asset Prices</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">₿</span>
              <div>
                <p className="font-semibold text-gray-800">Bitcoin (BTC)</p>
                <p className="text-sm text-gray-600">Dominant cryptocurrency</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">${marketData.btcPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Market leader</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">Ξ</span>
              <div>
                <p className="font-semibold text-gray-800">Ethereum (ETH)</p>
                <p className="text-sm text-gray-600">Smart contract platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">${marketData.ethPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-600">DeFi ecosystem</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">◎</span>
              <div>
                <p className="font-semibold text-gray-800">Solana (SOL)</p>
                <p className="text-sm text-gray-600">High-performance blockchain</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">${marketData.solPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Fast & cheap</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⬢</span>
              <div>
                <p className="font-semibold text-gray-800">Polygon (MATIC)</p>
                <p className="text-sm text-gray-600">Ethereum scaling solution</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">${marketData.maticPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Layer 2 solution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Sentiment */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Market Sentiment</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Fear & Greed Index</span>
              <span className="text-sm text-gray-500">{marketData.fearGreedIndex}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  marketData.fearGreedIndex >= 70 ? 'bg-green-500' :
                  marketData.fearGreedIndex >= 50 ? 'bg-yellow-500' :
                  marketData.fearGreedIndex >= 30 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${marketData.fearGreedIndex}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getFearGreedLabel(marketData.fearGreedIndex)} - Market sentiment indicator
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Volatility Index</span>
              <span className="text-sm text-gray-500">{marketData.volatilityIndex}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  marketData.volatilityIndex <= 20 ? 'bg-green-500' :
                  marketData.volatilityIndex <= 40 ? 'bg-yellow-500' :
                  marketData.volatilityIndex <= 60 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${marketData.volatilityIndex}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {marketData.volatilityIndex <= 20 ? 'Low' : 
               marketData.volatilityIndex <= 40 ? 'Moderate' :
               marketData.volatilityIndex <= 60 ? 'High' : 'Extreme'} volatility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends; 