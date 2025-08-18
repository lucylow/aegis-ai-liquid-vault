import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import AegisShield from './components/AegisShield';
import InheritanceManager from './components/InheritanceManager';
import { fetchSecurityOverview, fetchRecentThreats, subscribeToThreats } from './services/api';
import { Threat, SecurityOverview } from './types';

function App() {
  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewData, threatsData] = await Promise.all([
          fetchSecurityOverview(),
          fetchRecentThreats()
        ]);
        setOverview(overviewData);
        setRecentThreats(threatsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (overview) {
      const unsubscribe = subscribeToThreats((newThreat) => {
        setRecentThreats(prev => [newThreat, ...prev.slice(0, 9)]);
      });
      return unsubscribe;
    }
  }, [overview]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard overview={overview} recentThreats={recentThreats} />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/aegis-shield" element={<AegisShield />} />
                <Route path="/inheritance" element={<InheritanceManager />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 