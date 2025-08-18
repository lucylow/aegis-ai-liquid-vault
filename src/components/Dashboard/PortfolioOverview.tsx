import React, { useState, useEffect } from 'react';
import { fetchPortfolioData, fetchMarketData } from '../../services/api';

interface PortfolioData {
  totalValue: number;
  assets: Array<{
    chain: string;
    asset: string;
    amount: number;
    value: number;
    apy: number;
  }>;
  loans: Array<{
    chain: string;
    asset: string;
    amount: number;
    collateral: number;
    ltv: number;
  }>;
  riskScore: number;
  liquidationBuffer: number;
}

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

const PortfolioOverview: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [portfolioData, marketDataResult] = await Promise.all([
          fetchPortfolioData(),
          fetchMarketData()
        ]);
        setPortfolio(portfolioData as PortfolioData);
        setMarketData(marketDataResult as MarketData);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio || !marketData) return null;

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-600 bg-green-100';
    if (score <= 50) return 'text-yellow-600 bg-yellow-100';
    if (score <= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getFearGreedColor = (index: number) => {
    if (index >= 70) return 'text-green-600';
    if (index >= 50) return 'text-yellow-600';
    if (index >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Portfolio Overview</h2>
      
      {/* Total Value & Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-indigo-600">
            ${(portfolio.totalValue / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Risk Score</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(portfolio.riskScore)}`}>
            {portfolio.riskScore}/100
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Liquidation Buffer</p>
          <p className="text-2xl font-bold text-green-600">
            ${(portfolio.liquidationBuffer / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolio.assets.map((asset, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{asset.asset}</span>
                <span className="text-sm text-gray-500 capitalize">{asset.chain}</span>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{asset.amount}</p>
                <p className="text-sm text-gray-600">${asset.value.toLocaleString()}</p>
              </div>
              {asset.apy > 0 && (
                <div className="text-right">
                  <span className="text-sm text-green-600 font-medium">{asset.apy}% APY</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loans */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Loans</h3>
        <div className="space-y-3">
          {portfolio.loans.map((loan, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">{loan.asset}</span>
                  <span className="text-sm text-gray-500 capitalize">({loan.chain})</span>
                </div>
                <p className="text-sm text-gray-600">
                  ${loan.amount.toLocaleString()} borrowed
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Collateral: ${loan.collateral.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  loan.ltv <= 50 ? 'bg-green-100 text-green-800' :
                  loan.ltv <= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  LTV: {loan.ltv.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Data */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Market Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">BTC Price</p>
            <p className="font-semibold text-gray-800">${marketData.btcPrice.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ETH Price</p>
            <p className="font-semibold text-gray-800">${marketData.ethPrice.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Fear & Greed</p>
            <p className={`font-semibold ${getFearGreedColor(marketData.fearGreedIndex)}`}>
              {marketData.fearGreedIndex}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Volatility</p>
            <p className="font-semibold text-gray-800">{marketData.volatilityIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview; 