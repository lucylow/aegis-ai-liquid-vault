import React, { useState, useEffect } from 'react';
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
  Globe,
  AlertTriangle,
  BookOpen,
  Network,
  CheckCircle
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import WalletConnectionModal from './WalletConnectionModal';
import NotificationPanel from './NotificationPanel';
import { useWallet } from '../contexts/WalletContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [hasShownWalletModal, setHasShownWalletModal] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [zetaNetwork, setZetaNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, address, network, isDemoMode } = useWallet();

  const navigation = [
    { name: 'Home', href: '/app', icon: Shield, current: location.pathname === '/app' },
    { name: 'Dashboard', href: '/app/dashboard', icon: Home, current: location.pathname === '/app/dashboard' },
    { name: 'Deposit', href: '/app/deposit', icon: Wallet, current: location.pathname === '/app/deposit' },
    { name: 'Borrow', href: '/app/borrow', icon: DollarSign, current: location.pathname === '/app/borrow' },
    { name: 'Loans', href: '/app/loans', icon: FileText, current: location.pathname === '/app/loans' },
    { name: 'NFT Collateral', href: '/app/nft-collateral', icon: TrendingUp, current: location.pathname === '/app/nft-collateral' },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3, current: location.pathname === '/app/analytics' },
    { name: 'Governance', href: '/app/governance', icon: Settings, current: location.pathname === '/app/governance' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  // Auto-close wallet modal when wallet connects
  useEffect(() => {
    if (isConnected && walletModalOpen) {
      setWalletModalOpen(false);
    }
  }, [isConnected, walletModalOpen]);



  if (!isConnected && !isDemoMode) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
          <div className="text-center max-w-md mx-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Welcome to Aegis</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The next-generation multi-chain lending platform. Connect your wallet to access 
              lending, borrowing, and DeFi opportunities across multiple blockchains.
            </p>
            <button
              onClick={() => {
                setWalletModalOpen(true);
                setHasShownWalletModal(true);
              }}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <WalletConnectionModal 
          isOpen={walletModalOpen && !isConnected} 
          onClose={() => setWalletModalOpen(false)} 
        />
      </>
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
        
        {/* Network Indicator */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">ZetaChain</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              zetaNetwork === 'mainnet' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
            }`}>
              {zetaNetwork === 'mainnet' ? 'Mainnet' : 'Testnet'}
            </span>
          </div>
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
          {!isConnected ? (
            <button 
              onClick={() => setWalletModalOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">
                  Connect Wallet
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Click to connect your wallet
                </p>
              </div>
            </button>
          ) : (
            <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected Wallet'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {network || 'Ethereum'} • Connected
                </p>
              </div>
            </div>
          )}
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
            {/* ZetaChain Network Switcher */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
              <button
                onClick={() => setZetaNetwork('mainnet')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  zetaNetwork === 'mainnet'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Network size={14} />
                  <span>Mainnet</span>
                  {zetaNetwork === 'mainnet' && <CheckCircle size={14} />}
                </div>
              </button>
              <button
                onClick={() => setZetaNetwork('testnet')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  zetaNetwork === 'testnet'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Network size={14} />
                  <span>Testnet</span>
                  {zetaNetwork === 'testnet' && <CheckCircle size={14} />}
                </div>
              </button>
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              className="p-2 rounded-lg hover:bg-white/10 relative transition-colors"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
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

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default Layout;
