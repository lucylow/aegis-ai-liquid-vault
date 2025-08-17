import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  chain: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface ThreatStreamProps {
  threats: Threat[];
  onResolveThreat: (id: string) => void;
  onInvestigateThreat: (id: string) => void;
}

export default function ThreatStream({ threats, onResolveThreat, onInvestigateThreat }: ThreatStreamProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-destructive';
      case 'high': return 'border-warning';
      case 'medium': return 'border-accent';
      case 'low': return 'border-success';
      default: return 'border-muted';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10';
      case 'high': return 'bg-warning/10';
      case 'medium': return 'bg-accent/10';
      case 'low': return 'bg-success/10';
      default: return 'bg-muted/10';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Real-time Threat Stream</CardTitle>
        <p className="text-sm text-muted-foreground">Live monitoring of cross-chain activities</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {threats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No threats detected. All systems operational.
            </div>
          ) : (
            threats.map((threat) => (
              <div
                key={threat.id}
                className={`glass-effect rounded-lg p-4 border-l-4 ${getSeverityColor(threat.severity)} ${getSeverityBg(threat.severity)} ${
                  threat.status === 'active' ? 'animate-pulse-glow' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span className="font-semibold">{threat.title}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {threat.chain}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>
                {threat.status === 'active' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onResolveThreat(threat.id)}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onInvestigateThreat(threat.id)}>
                      Investigate
                    </Button>
                  </div>
                )}
                {threat.status === 'resolved' && (
                  <span className="text-sm text-success">✓ Resolved</span>
                )}
                {threat.status === 'investigating' && (
                  <span className="text-sm text-warning">🔍 Investigating...</span>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}