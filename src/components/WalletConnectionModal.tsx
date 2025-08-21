import React, { useState } from 'react';
import { X, Wallet, ExternalLink, ChevronRight, Globe, Brain, Zap } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectionModal = ({ isOpen, onClose }: WalletConnectionModalProps) => {
  const { connect, isConnecting, connectionError, clearError, isMetaMaskInstalled } = useWallet();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      clearError();
      await connect();
      onClose();
      // Navigate to the main app interface after successful connection
      navigate('/app');
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
      <div className="bg-white border border-gray-300 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
                <p className="text-sm text-gray-600">Choose your preferred wallet</p>
              </div>
          </div>
                      <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
        </div>

        {/* Supported Networks */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-900 mb-3">Supported Networks</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm">🔷</span>
              <span className="text-xs text-gray-600">Ethereum Mainnet</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm">🔺</span>
              <span className="text-xs text-gray-600">Polygon</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm">🟡</span>
              <span className="text-xs text-gray-600">Binance Smart Chain</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm">🔵</span>
              <span className="text-xs text-gray-600">Arbitrum</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Globe size={12} className="text-gray-600" />
              <span className="text-xs text-gray-600">+more</span>
            </div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          <button
            onClick={handleConnect}
            disabled={isConnecting || !isMetaMaskInstalled()}
            className="w-full flex items-center justify-between p-4 border border-gray-300 hover:border-blue-500 rounded-xl transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🦊</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">MetaMask</p>
                <p className="text-xs text-gray-600">Multi-chain support</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {!isMetaMaskInstalled() && (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">MetaMask not detected</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Install MetaMask</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {isConnecting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Connecting...</p>
            </div>
          )}
        </div>



        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-600 text-center">
            By connecting, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionModal;