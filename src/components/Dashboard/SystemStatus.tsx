import React, { useState, useEffect } from 'react';
import { fetchSystemHealth } from '../../services/api';

interface SystemHealth {
  status: string;
  lastIncident: string;
  uptime: string;
  chains: Array<{
    name: string;
    status: string;
    latency?: string;
    tps?: number;
  }>;
  overallMetrics?: {
    totalTransactions: number;
    activeUsers: number;
    securityScore: number;
    responseTime: string;
  };
}

const SystemStatus: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSystemHealth();
        setSystemHealth(data as SystemHealth);
      } catch (error) {
        console.error('Error loading system health:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!systemHealth) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">System Status</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getOverallStatusColor(systemHealth.status)}`}>
          {systemHealth.status}
        </span>
      </div>

      {/* Overall Metrics */}
      {systemHealth.overallMetrics && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Security Score</p>
            <p className="text-lg font-bold text-gray-800">{systemHealth.overallMetrics.securityScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Response Time</p>
            <p className="text-lg font-bold text-gray-800">{systemHealth.overallMetrics.responseTime}</p>
          </div>
        </div>
      )}

      {/* Chain Status */}
      <div className="space-y-2">
        {systemHealth.chains.map((chain, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                chain.status === 'online' ? 'bg-green-500' :
                chain.status === 'degraded' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
              <span className="text-sm font-medium text-gray-700">{chain.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {chain.latency && (
                <span>{chain.latency}</span>
              )}
              {chain.tps && (
                <span>{chain.tps} TPS</span>
              )}
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(chain.status)}`}>
                {chain.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Uptime: {systemHealth.uptime}</span>
          <span>Last Incident: {new Date(systemHealth.lastIncident).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus; 