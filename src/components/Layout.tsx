import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Bell,
  User,
  Brain,
  Globe
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import { useWallet } from '../contexts/WalletContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useWallet();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home, current: location.pathname === '/app/dashboard' },
    { name: 'Deposit', href: '/app/deposit', icon: Wallet, current: location.pathname === '/app/deposit' },
    { name: 'Borrow', href: '/app/borrow', icon: DollarSign, current: location.pathname === '/app/borrow' },
    { name: 'Loans', href: '/app/loans', icon: FileText, current: location.pathname === '/app/loans' },
    { name: 'NFT Collateral', href: '/app/nft-collateral', icon: TrendingUp, current: location.pathname === '/app/nft-collateral' },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3, current: location.pathname === '/app/analytics' },
    { name: 'AI Dashboard', href: '/app/ai-dashboard', icon: Brain, current: location.pathname === '/app/ai-dashboard' },
    { name: 'Cross-Chain Lending', href: '/app/cross-chain-lending', icon: Globe, current: location.pathname === '/app/cross-chain-lending' },
    { name: 'Governance', href: '/app/governance', icon: Settings, current: location.pathname === '/app/governance' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-darker to-dark text-white flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-6 text-primary" />
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to access the Aegis lending platform</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker to-dark text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AEGIS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Connected Wallet</p>
              <p className="text-xs text-gray-400 truncate">Ready to lend & borrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-white/10 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">
                {navigation.find(item => item.current)?.name || 'Aegis'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/10 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Wallet connection */}
            <WalletConnect />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
