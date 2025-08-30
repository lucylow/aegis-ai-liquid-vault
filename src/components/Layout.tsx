import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield,
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
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import WalletConnectionModal from './WalletConnectionModal';
import NotificationPanel from './NotificationPanel';
import BlockchainSwitcher from './BlockchainSwitcher';
import { useWallet } from '../contexts/WalletContext';
import { getBlockchainByChainId } from '../config/blockchains';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [hasShownWalletModal, setHasShownWalletModal] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [zetaNetwork, setZetaNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [walletInfoOpen, setWalletInfoOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected, address, network, isDemoMode, currentBlockchain, chainId } = useWallet();

  const navigation = [
    { name: 'Multi-Chain', href: '/app/multi-chain', icon: Globe, current: location.pathname === '/app/multi-chain' },
    { name: 'Deposit', href: '/app/deposit', icon: Wallet, current: location.pathname === '/app/deposit' },
    { name: 'Borrow', href: '/app/borrow', icon: DollarSign, current: location.pathname === '/app/borrow' },
    { name: 'Loans', href: '/app/loans', icon: FileText, current: location.pathname === '/app/loans' },
    { name: 'NFT Collateral', href: '/app/nft-collateral', icon: TrendingUp, current: location.pathname === '/app/nft-collateral' },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3, current: location.pathname === '/app/analytics' },
    { name: 'Governance', href: '/app/governance', icon: Settings, current: location.pathname === '/app/governance' },
  ];

  const aiNavigation = [
    { name: 'Vibe Trading AI', href: '/vibe-trading', icon: Brain, current: location.pathname === '/vibe-trading' },
    { name: 'Security Center', href: '/aegis-security', icon: AlertTriangle, current: location.pathname === '/aegis-security' },
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
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AEGIS
              </span>
            </div>
            <span className="text-xs text-gray-400 ml-11">
              Cross-Chain Lending
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Blockchain Switcher */}
        <BlockchainSwitcher 
          currentBlockchain={currentBlockchain}
          variant="sidebar"
          showTestnets={true}
        />

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

        {/* AI & Security Navigation */}
        <div className="mt-8 px-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            AI & Security
          </div>
          <div className="space-y-1">
            {aiNavigation.map((item) => (
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
        </div>

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
            <button 
              onClick={() => setWalletInfoOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
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
            </button>
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
            {/* Blockchain Switcher */}
            <BlockchainSwitcher 
              currentBlockchain={currentBlockchain}
              variant="dropdown"
              showTestnets={false}
              className="hidden md:block"
            />

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

      {/* Wallet Info Popup */}
      {walletInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setWalletInfoOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet size={20} className="text-primary" />
                Wallet Dashboard
              </h3>
              <button
                onClick={() => setWalletInfoOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Wallet Address with Copy & Explorer */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Wallet Address</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (address) {
                          navigator.clipboard.writeText(address);
                          // You could add a toast notification here
                        }
                      }}
                      className="p-2 hover:bg-white/10 rounded transition-colors text-blue-400 hover:text-blue-300"
                      title="Copy Address"
                    >
                      <Copy size={14} />
                    </button>
                    {address && (
                      <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded transition-colors text-green-400 hover:text-green-300"
                        title="View on Etherscan"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-white font-mono text-sm break-all">
                  {address || 'Not connected'}
                </p>
              </div>

              {/* Network Information */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400">Network</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white font-medium">{network || 'Ethereum'}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">Connected</span>
              </div>

              {/* Blockchain Switcher */}
              <BlockchainSwitcher 
                currentBlockchain={currentBlockchain}
                variant="modal"
                showTestnets={true}
              />

              {/* Quick Actions */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400 mb-3 block">Quick Actions</span>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-2 justify-center">
                    <RefreshCw size={14} />
                    Refresh Balance
                  </button>
                  <button 
                    onClick={() => {
                      // This will be handled by the blockchain switcher above
                      console.log('Use the blockchain switcher above to change networks');
                    }}
                    className="px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm flex items-center gap-2 justify-center"
                  >
                    <Globe size={14} />
                    Switch Network
                  </button>
                </div>
              </div>

              {/* Connection Health */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400 mb-3 block">Connection Health</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Wallet Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">ZetaChain</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-400 text-sm">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Cross-Chain Ready</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setWalletInfoOpen(false);
                    // Add disconnect logic here if needed
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Disconnect Wallet
                </button>
                <button
                  onClick={() => setWalletInfoOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
