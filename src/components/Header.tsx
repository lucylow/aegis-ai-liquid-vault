import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Wallet, Globe, Settings } from 'lucide-react';

interface HeaderProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

export default function Header({ onConnectWallet, isWalletConnected, walletAddress }: HeaderProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="glass-effect border-b border-border/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
          </div>
          <div>
            <h1 className="text-xl font-bold glow-text">AEGIS</h1>
            <p className="text-xs text-muted-foreground">AI-Shielded Cross-Chain Lending</p>
          </div>
        </div>

        {/* Network Status */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-success/10 border border-success/20">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success-foreground">All Networks Online</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>6 Chains Connected</span>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          {isWalletConnected ? (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{truncateAddress(walletAddress || '')}</span>
            </div>
          ) : (
            <Button onClick={onConnectWallet} className="gradient-primary">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}