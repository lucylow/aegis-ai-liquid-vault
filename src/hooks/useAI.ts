import { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { AIInsight, SecurityAlert } from '../types';

export const useAI = () => {
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [insightsData, alertsData] = await Promise.all([
        aiAPI.getInsights(),
        aiAPI.getAlerts()
      ]);
      
      if (insightsData.success) {
        setInsights(insightsData.data);
      }
      
      if (alertsData.success) {
        setAlerts(alertsData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI data');
      console.error('AI data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const refreshAIData = () => {
    fetchAIData();
  };

  return {
    insights,
    alerts,
    loading,
    error,
    refreshAIData,
  };
};
