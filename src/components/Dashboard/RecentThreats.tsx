import React from 'react';
import { Threat } from '../../types';

interface RecentThreatsProps {
  threats: Threat[];
}

const RecentThreats: React.FC<RecentThreatsProps> = ({ threats }) => {
  const getSeverityColor = (severity: number) => {
    if (severity > 80) return 'bg-red-100 text-red-800 border-red-200';
    if (severity > 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (severity > 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getSeverityText = (severity: number) => {
    if (severity > 80) return 'Critical';
    if (severity > 60) return 'High';
    if (severity > 40) return 'Medium';
    return 'Low';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (threats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Threats</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Threats Detected</h3>
          <p className="text-gray-500">Your system is currently secure with no active threats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Threats</h2>
      
      <div className="space-y-4">
        {threats.map((threat) => (
          <div key={threat.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(threat.severity)}`}>
                    {getSeverityText(threat.severity)}
                  </span>
                  <span className="text-sm text-gray-500">{threat.chain}</span>
                  <span className="text-sm text-gray-400">{formatTime(threat.timestamp)}</span>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-1">{threat.type}</h3>
                <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>From: {threat.from.substring(0, 8)}...</span>
                  <span>To: {threat.to.substring(0, 8)}...</span>
                  <span>Value: {threat.value}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{threat.severity}</div>
                  <div className="text-xs text-gray-500">Risk Score</div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
            
            {threat.aiAnalysis && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <span className="text-sm font-medium text-blue-800">AI Analysis</span>
                </div>
                <p className="text-sm text-blue-700">{threat.aiAnalysis}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {threats.length > 5 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
            View All Threats
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentThreats; 