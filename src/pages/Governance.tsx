import React from 'react';
import { Settings } from 'lucide-react';

const Governance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Governance & Settings</h1>
        <p className="text-gray-400">DAO governance proposals and platform settings</p>
      </div>
      
      <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
        <Settings size={64} className="mx-auto mb-6 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-400">Governance functionality will be implemented in the next phase</p>
      </div>
    </div>
  );
};

export default Governance;
