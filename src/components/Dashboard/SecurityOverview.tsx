import React from 'react';

interface SecurityOverviewProps {
  data: {
    totalThreats: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    protectedValue: string;
  };
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Security Overview</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Threats</p>
          <p className="text-3xl font-bold text-blue-800">{data.totalThreats}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Protected Value</p>
          <p className="text-3xl font-bold text-green-800">{data.protectedValue}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-red-700">Critical</span>
          <span className="text-sm font-bold text-red-800">{data.critical}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-red-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(data.critical / data.totalThreats) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-orange-500">High</span>
          <span className="text-sm font-bold text-orange-600">{data.high}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-orange-500 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(data.high / data.totalThreats) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-yellow-500">Medium</span>
          <span className="text-sm font-bold text-yellow-600">{data.medium}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-yellow-500 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(data.medium / data.totalThreats) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-500">Low</span>
          <span className="text-sm font-bold text-green-600">{data.low}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(data.low / data.totalThreats) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Security Score</span>
          <span className="font-semibold text-gray-800">
            {Math.round(((data.low + data.medium * 0.5) / data.totalThreats) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((data.low + data.medium * 0.5) / data.totalThreats) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview; 