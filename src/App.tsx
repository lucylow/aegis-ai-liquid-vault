import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Aegis AI Dashboard</h1>
      <p className="text-xl">Welcome to the Aegis AI Intelligent Security & Cross-Chain Management System</p>
      <div className="mt-8 p-6 bg-white/10 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/20 rounded-lg">
            <h3 className="font-medium text-green-400">AI Agents</h3>
            <p className="text-sm">All systems operational</p>
          </div>
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <h3 className="font-medium text-blue-400">Security</h3>
            <p className="text-sm">Threat level: Low</p>
          </div>
          <div className="p-4 bg-purple-500/20 rounded-lg">
            <h3 className="font-medium text-purple-400">Cross-Chain</h3>
            <p className="text-sm">Connected to 5 networks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 