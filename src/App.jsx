import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import LendingInterface from '@/components/LendingInterface';
import AICopilot from '@/components/AICopilot';

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    // Simulate wallet connection
    try {
      setIsWalletConnected(true);
      setWalletAddress('0x742d35Cc6635C0532925a3b8D8c1C8b8e7Cc4b56');
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet",
        variant: "destructive",
      });
    }
  };

  const handleBorrow = async (amount, asset, collateral) => {
    toast({
      title: "Loan Initiated",
      description: `Borrowing ${amount} ${asset} with ${collateral} collateral`,
    });
  };

  const handleRepay = async (amount, asset) => {
    toast({
      title: "Repayment Processed",
      description: `Repaid ${amount} ${asset}`,
    });
  };

  const handleAICommand = (command) => {
    toast({
      title: "AI Command Executed",
      description: `Processing: ${command}`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold glow-text mb-2">
            AI-Shielded Liquidity Across All Chains
          </h1>
          <p className="text-muted-foreground">
            Unified cross-chain lending with AI-powered risk protection
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lending">Lending</TabsTrigger>
            <TabsTrigger value="ai">AI Copilot</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              portfolioData={{}}
              loanHealth={{}}
              chainData={[]}
            />
          </TabsContent>

          <TabsContent value="lending">
            <LendingInterface 
              onBorrow={handleBorrow}
              onRepay={handleRepay}
              availableAssets={[]}
              chainData={[]}
            />
          </TabsContent>

          <TabsContent value="ai">
            <AICopilot onCommand={handleAICommand} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;