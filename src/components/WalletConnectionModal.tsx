import React, { useState } from 'react';
import { X, Wallet, ExternalLink, ChevronRight, Globe, Brain, Zap } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectionModal = ({ isOpen, onClose }: WalletConnectionModalProps) => {
  const { connect, isConnecting, connectionError, clearError, isMetaMaskInstalled } = useWallet();

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      clearError();
      await connect();
      onClose();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Wallet size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Connect Wallet</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Supported Networks */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Supported Networks</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <span className="text-sm">🔷</span>
              <span className="text-xs text-muted-foreground">Ethereum Mainnet</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <span className="text-sm">🔺</span>
              <span className="text-xs text-muted-foreground">Polygon</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <span className="text-sm">🟡</span>
              <span className="text-xs text-muted-foreground">Binance Smart Chain</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <span className="text-sm">🔵</span>
              <span className="text-xs text-muted-foreground">Arbitrum</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg">
              <Globe size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">+more</span>
            </div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          <button
            onClick={handleConnect}
            disabled={isConnecting || !isMetaMaskInstalled()}
            className="w-full flex items-center justify-between p-4 border border-border hover:border-primary/50 rounded-xl transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🦊</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">MetaMask</p>
                <p className="text-xs text-muted-foreground">Multi-chain support</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          {!isMetaMaskInstalled() && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">MetaMask not detected</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>Install MetaMask</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {isConnecting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Connecting...</p>
            </div>
          )}
        </div>



        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            By connecting, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionModal;