import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Wallet, Bell } from 'lucide-react';

interface AegisHeaderProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

export default function AegisHeader({ onConnectWallet, isWalletConnected, walletAddress }: AegisHeaderProps) {
  return (
    <header className="flex justify-between items-center p-5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AEGIS
          </h1>
          <span className="text-sm text-muted-foreground tracking-wide">AI-POWERED SECURITY</span>
        </div>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={onConnectWallet}
          className="rounded-full"
        >
          <Wallet size={16} className="mr-2" />
          {isWalletConnected ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}` : 'Connect Wallet'}
        </Button>
        <Button className="rounded-full">
          <Bell size={16} className="mr-2" />
          Alerts <span className="ml-1 bg-warning text-warning-foreground px-1.5 py-0.5 rounded-full text-xs">3</span>
        </Button>
      </div>
    </header>
  );
}