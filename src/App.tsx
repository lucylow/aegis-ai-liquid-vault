import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ThreatAnalysis from './pages/ThreatAnalysis';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { fetchSecurityOverview, subscribeToThreats } from './services/api';
import { Threat } from './types';


function App() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      const overviewData = await fetchSecurityOverview();
      setOverview(overviewData);
    };
    
    loadData();
    
    // Subscribe to real-time threats
    const unsubscribe = subscribeToThreats((newThreat) => {
      setThreats(prev => [newThreat, ...prev.slice(0, 49)]);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  overview={overview} 
                  recentThreats={threats.slice(0, 5)} 
                />
              } />
              <Route path="/transactions" element={
                <Transactions threats={threats} />
              } />
              <Route path="/threats" element={
                <ThreatAnalysis threats={threats} />
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 