import React from 'react';

interface Chain {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  threats: number;
}

interface ChainHealthProps {
  chains: Chain[];
}

const ChainHealth: React.FC<ChainHealthProps> = ({ chains }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getThreatColor = (threats: number) => {
    if (threats === 0) return 'text-green-600';
    if (threats < 10) return 'text-yellow-600';
    if (threats < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Chain Health</h2>
      
      <div className="space-y-4">
        {chains.map((chain, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(chain.status)}`}></div>
              <div>
                <span className="font-medium text-gray-800">{chain.name}</span>
                <div className="text-xs text-gray-500">{getStatusText(chain.status)}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-semibold ${getThreatColor(chain.threats)}`}>
                {chain.threats} threats
              </div>
              <div className="text-xs text-gray-500">
                {chain.threats === 0 ? 'Secure' : 
                 chain.threats < 10 ? 'Low Risk' : 
                 chain.threats < 30 ? 'Medium Risk' : 'High Risk'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Status</span>
          <span className={`font-semibold ${
            chains.every(c => c.status === 'online') ? 'text-green-600' :
            chains.some(c => c.status === 'offline') ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {chains.every(c => c.status === 'online') ? 'All Operational' :
             chains.some(c => c.status === 'offline') ? 'Critical Issues' : 'Degraded Performance'}
          </span>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {chains.filter(c => c.status === 'online').length} of {chains.length} chains operational
        </div>
      </div>
    </div>
  );
};

export default ChainHealth; 