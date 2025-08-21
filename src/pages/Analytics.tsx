import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-gray-400">Cross-chain liquidity statistics and AI risk modeling</p>
      </div>
      
      <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
        <BarChart3 size={64} className="mx-auto mb-6 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-400">Analytics functionality will be implemented in the next phase</p>
      </div>
    </div>
  );
};

export default Analytics;
