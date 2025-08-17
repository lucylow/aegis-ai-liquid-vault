import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Network, TrendingUp, Bot, Play, Square, Bitcoin, Wallet } from 'lucide-react';

interface AegisSidebarProps {
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  isSimulationActive: boolean;
  riskMetrics: {
    totalThreats: number;
    protectedValue: string;
    criticalThreats: number;
    highThreats: number;
  };
}

export default function AegisSidebar({ onStartSimulation, onStopSimulation, isSimulationActive, riskMetrics }: AegisSidebarProps) {
  const [selectedChain, setSelectedChain] = useState('bitcoin');
  const [aiControls, setAiControls] = useState({
    predictiveAnalysis: true,
    autonomousIntervention: true,
    voiceCommands: false,
  });

  const chains = [
    { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin, color: '#f7931a' },
    { id: 'ethereum', name: 'Ethereum', icon: Wallet, color: '#627eea' },
    { id: 'solana', name: 'Solana', icon: Wallet, color: '#9945ff' },
    { id: 'polygon', name: 'Polygon', icon: Wallet, color: '#8247e5' },
    { id: 'avalanche', name: 'Avalanche', icon: Wallet, color: '#e84142' },
    { id: 'binance', name: 'Binance', icon: Wallet, color: '#f0b90b' },
  ];

  return (
    <aside className="glass-effect rounded-lg p-6 h-fit">
      <div className="space-y-8">
        {/* Monitored Chains */}
        <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-muted-foreground">
          <Network size={20} />
          Monitored Chains
        </h3>
          <div className="grid grid-cols-3 gap-3">
            {chains.map((chain) => {
              const IconComponent = chain.icon;
              return (
                <div
                  key={chain.id}
                  className={`glass-effect rounded-lg p-3 text-center cursor-pointer transition-all ${
                    selectedChain === chain.id ? 'border-primary bg-primary/10' : 'border-white/5'
                  }`}
                  onClick={() => setSelectedChain(chain.id)}
                >
                  <IconComponent size={24} className="mx-auto mb-2" style={{ color: chain.color }} />
                  <div className="text-xs">{chain.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Matrix */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-muted-foreground">
            <TrendingUp size={20} />
            Risk Matrix
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{riskMetrics.totalThreats}</div>
              <div className="text-xs text-muted-foreground">Total Threats</div>
            </div>
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">{riskMetrics.protectedValue}</div>
              <div className="text-xs text-muted-foreground">Protected Value</div>
            </div>
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{riskMetrics.criticalThreats}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="glass-effect rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning">{riskMetrics.highThreats}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
          </div>
        </div>

        {/* AI Controls */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-muted-foreground">
            <Bot size={20} />
            AI Controls
          </h3>
          <div className="space-y-3">
            {Object.entries(aiControls).map(([key, value]) => (
              <div key={key} className="glass-effect rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setAiControls(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
            <Button
              onClick={isSimulationActive ? onStopSimulation : onStartSimulation}
              className="w-full rounded-lg"
              variant={isSimulationActive ? "destructive" : "default"}
            >
              {isSimulationActive ? (
                <>
                  <Square size={16} className="mr-2" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}