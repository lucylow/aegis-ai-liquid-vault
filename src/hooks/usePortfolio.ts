import { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import { Portfolio, Position } from '../types';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [portfolioData, positionsData] = await Promise.all([
        portfolioAPI.getOverview(),
        portfolioAPI.getPositions()
      ]);
      
      if (portfolioData.success) {
        setPortfolio(portfolioData.data);
      }
      
      if (positionsData.success) {
        setPositions(positionsData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const refreshPortfolio = () => {
    fetchPortfolio();
  };

  return {
    portfolio,
    positions,
    loading,
    error,
    refreshPortfolio,
  };
};
