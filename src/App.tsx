import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Borrow from './pages/Borrow';
import Loans from './pages/Loans';
import NftCollateral from './pages/NftCollateral';
import Analytics from './pages/Analytics';
import Governance from './pages/Governance';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          {/* Landing page - no layout wrapper */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected routes with layout wrapper */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
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
    </WalletProvider>
  );
};

export default App;