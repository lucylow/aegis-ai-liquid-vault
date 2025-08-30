import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AegisSecurityProvider } from './contexts/AegisSecurityContext';
import GlobalSecurityAlert from './components/GlobalSecurityAlert';
import SecurityNavigation from './components/SecurityNavigation';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import AppWelcome from './components/AppWelcome';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MultiChainDashboard from './components/MultiChainDashboard';
import Deposit from './pages/Deposit';
import Borrow from './pages/Borrow';
import Loans from './pages/Loans';
import NftCollateral from './pages/NftCollateral';
import Analytics from './pages/Analytics';
import Governance from './pages/Governance';
import AITest from './pages/AITest';
import SimpleAITest from './components/SimpleAITest';
import IconTest from './components/IconTest';
import ChartTest from './components/ChartTest';
import SimpleWalletTest from './components/SimpleWalletTest';
import RevenueDashboard from './pages/RevenueDashboard';
import VibeTradingAIPage from './pages/VibeTradingAI';
import AegisSecurityPage from './pages/AegisSecurity';

import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AegisSecurityProvider>
      <WalletProvider>
        <NotificationProvider>
          <Router>
            <GlobalSecurityAlert />
            <SecurityNavigation />
            <Routes>
            {/* Landing page - no layout wrapper */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Simple Test Route */}
            <Route path="/simple-test" element={<SimpleAITest />} />
            
            {/* AI Test Route */}
            <Route path="/ai-test" element={<AITest />} />
            
            {/* Icon Test Route */}
            <Route path="/icon-test" element={<IconTest />} />
            
            {/* Chart Test Route */}
            <Route path="/chart-test" element={<ChartTest />} />
            
            {/* Wallet Test Route */}
            <Route path="/wallet-test" element={<SimpleWalletTest />} />
            
            {/* Revenue Dashboard Route */}
            <Route path="/revenue" element={<RevenueDashboard />} />
            
                {/* Vibe Trading AI Route */}
    <Route path="/vibe-trading" element={<VibeTradingAIPage />} />
    
    {/* AEGIS Security Route */}
    <Route path="/aegis-security" element={<AegisSecurityPage />} />
            
            {/* Protected routes with layout wrapper */}
            <Route path="/app" element={<Layout />}>
              <Route index element={<AppWelcome />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="multi-chain" element={<MultiChainDashboard />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="borrow" element={<Borrow />} />
              <Route path="loans" element={<Loans />} />
              <Route path="nft-collateral" element={<NftCollateral />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="governance" element={<Governance />} />

            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </WalletProvider>
    </AegisSecurityProvider>
  );
};

export default App;