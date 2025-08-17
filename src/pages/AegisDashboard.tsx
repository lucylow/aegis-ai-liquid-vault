import React, { useState, useEffect } from 'react';
import AegisHeader from '@/components/AegisHeader';
import AegisSidebar from '@/components/AegisSidebar';
import ThreatStream from '@/components/ThreatStream';
import AegisAI from '@/components/AegisAI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  chain: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface Message {
  id: string;
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: string;
}

export default function AegisDashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am AEGIS AI Copilot. I am monitoring your cross-chain assets for threats.',
      type: 'assistant',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [riskMetrics, setRiskMetrics] = useState({
    totalThreats: 0,
    protectedValue: '$2.4M',
    criticalThreats: 0,
    highThreats: 0,
  });

  const { toast } = useToast();
  let simulationInterval: NodeJS.Timeout | null = null;

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setWalletAddress('0x742d35Cc6635C0532925a3b8D8c1C8b8e7Cc4b56');
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to MetaMask",
    });
  };

  const addMessage = (text: string, type: 'user' | 'assistant' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateThreat = () => {
    const threatTypes = [
      {
        title: 'Critical Cross-Chain Exploit Attempt',
        description: 'Suspicious depositAndCall detected from blacklisted address. Potential bridge exploit.',
        severity: 'critical' as const,
        chain: 'Ethereum',
      },
      {
        title: 'High Risk Transaction Pattern',
        description: 'Multiple small transactions to unknown addresses. Possible dust attack or sybil attempt.',
        severity: 'high' as const,
        chain: 'Solana',
      },
      {
        title: 'Unusual Contract Interaction',
        description: 'Interaction with a newly deployed, unaudited smart contract.',
        severity: 'medium' as const,
        chain: 'Polygon',
      },
      {
        title: 'Minor Anomaly Detected',
        description: 'Slight deviation from normal transaction volume.',
        severity: 'low' as const,
        chain: 'Bitcoin',
      },
    ];

    const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const threat: Threat = {
      id: `THR-${Date.now()}`,
      ...randomThreat,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    setThreats(prev => [threat, ...prev]);
    setRiskMetrics(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + 1,
      criticalThreats: threat.severity === 'critical' ? prev.criticalThreats + 1 : prev.criticalThreats,
      highThreats: threat.severity === 'high' ? prev.highThreats + 1 : prev.highThreats,
    }));

    if (threat.severity === 'critical') {
      addMessage(`🚨 CRITICAL ALERT: ${threat.title} on ${threat.chain}! Initiating autonomous intervention.`, 'assistant');
    }
  };

  const startSimulation = () => {
    setIsSimulationActive(true);
    addMessage('🤖 Advanced AI simulation started. Gemini 2.5 Pro analysis active.', 'system');
    
    simulationInterval = setInterval(generateThreat, 4000);
  };

  const stopSimulation = () => {
    setIsSimulationActive(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    addMessage('Simulation stopped. All systems nominal.', 'system');
  };

  const handleResolveThreat = (id: string) => {
    setThreats(prev =>
      prev.map(threat =>
        threat.id === id ? { ...threat, status: 'resolved' as const } : threat
      )
    );
    addMessage('Threat resolved successfully.', 'assistant');
  };

  const handleInvestigateThreat = (id: string) => {
    setThreats(prev =>
      prev.map(threat =>
        threat.id === id ? { ...threat, status: 'investigating' as const } : threat
      )
    );
    addMessage('Investigation initiated. Gathering additional data...', 'assistant');
  };

  const handleSendMessage = (message: string) => {
    addMessage(message, 'user');
    
    setTimeout(() => {
      if (message.toLowerCase().includes('freeze') || message.toLowerCase().includes('stop')) {
        addMessage('Command received. Initiating cross-chain asset freeze using ZetaChain universal contracts. Assets frozen successfully.', 'assistant');
      } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('report')) {
        addMessage(`Current status: ${threats.length} active threats detected. ${riskMetrics.criticalThreats} critical threats require immediate attention.`, 'assistant');
      } else {
        addMessage('Thank you for your command. I am processing your request using advanced AI analysis.', 'assistant');
      }
    }, 1000);
  };

  const handleVoiceInput = () => {
    addMessage('Voice input activated. Please speak your command.', 'system');
    setTimeout(() => {
      addMessage('Simulating voice command: "AEGIS, freeze assets linked to 0x1234... on Ethereum and Bitcoin"', 'user');
      setTimeout(() => {
        addMessage('Command received. Initiating cross-chain asset freeze using ZetaChain universal contracts. Assets frozen successfully.', 'assistant');
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker to-dark text-foreground">
      <div className="max-w-7xl mx-auto">
        <AegisHeader
          onConnectWallet={handleConnectWallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
        />
        
        <div className="p-5 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
          <AegisSidebar
            onStartSimulation={startSimulation}
            onStopSimulation={stopSimulation}
            isSimulationActive={isSimulationActive}
            riskMetrics={riskMetrics}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 content-start">
              <ThreatStream
                threats={threats}
                onResolveThreat={handleResolveThreat}
                onInvestigateThreat={handleInvestigateThreat}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic LTV Adjustment</CardTitle>
                  <p className="text-sm text-muted-foreground">Based on market volatility & threat scores</p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    LTV Chart Integration Ready
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Protected Assets Overview</CardTitle>
                  <p className="text-sm text-muted-foreground">Value and threat exposure</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Bitcoin', value: '1.2 BTC', threat: 'Low' },
                      { name: 'Ethereum', value: '15 ETH', threat: 'Medium' },
                      { name: 'USDC', value: '50K USDC', threat: 'None' },
                      { name: 'ZETA', value: '1K ZETA', threat: 'None' },
                    ].map((asset, i) => (
                      <div key={i} className="glass-effect rounded-lg p-3">
                        <div className="font-semibold text-sm">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.value}</div>
                        <div className="text-xs text-success">{asset.threat} Risk</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <AegisAI
              messages={messages}
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}