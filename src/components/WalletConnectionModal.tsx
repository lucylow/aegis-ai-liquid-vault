import React, { useState } from 'react';
import { X, Wallet, ExternalLink, ChevronRight, Globe } from 'lucide-react';
import { useWalletProviders } from '../hooks/useWalletProviders';
import { useWallet } from '../contexts/WalletContext';
import type { EIP6963ProviderDetail } from '../types/wallet';
import { SUPPORTED_CHAINS } from '../constants/chains';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectionModal = ({ isOpen, onClose }: WalletConnectionModalProps) => {
  const { providers } = useWalletProviders();
  const { connect, isConnecting, connectionError, clearError } = useWallet();
  const [selectedProvider, setSelectedProvider] = useState<EIP6963ProviderDetail | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (provider: EIP6963ProviderDetail) => {
    try {
      clearError();
      setSelectedProvider(provider);
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
            {SUPPORTED_CHAINS.slice(0, 4).map((chain) => (
              <div
                key={chain.chainId}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg"
              >
                <span className="text-sm">{chain.icon}</span>
                <span className="text-xs text-muted-foreground">{chain.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg">
              <Globe size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">+more</span>
            </div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <button
                key={provider.info.uuid}
                onClick={() => handleConnect(provider)}
                disabled={isConnecting && selectedProvider?.info.uuid === provider.info.uuid}
                className="w-full flex items-center justify-between p-4 border border-border hover:border-primary/50 rounded-xl transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={provider.info.icon}
                    alt={`${provider.info.name} icon`}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{provider.info.name}</p>
                    <p className="text-xs text-muted-foreground">Multi-chain support</p>
                  </div>
                </div>
                <ChevronRight 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors" 
                />
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet size={20} className="text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-2">No Wallets Detected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Install a Web3 wallet to get started
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Install MetaMask
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{connectionError}</p>
          </div>
        )}

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