import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Shield, Bot, Zap, Globe, Mic, Play, Square, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

// Chain configuration
const CHAINS = [
  { id: 'bitcoin', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
  { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', color: '#627eea' },
  { id: 'solana', name: 'Solana', icon: '◎', color: '#9945ff' },
  { id: 'polygon', name: 'Polygon', icon: '⬢', color: '#8247e5' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', color: '#e84142' },
  { id: 'binance', name: 'Binance', icon: '🔶', color: '#f0b90b' },
];

// Mock data
const mockData = {
  securityOverview: {
    totalThreats: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    protectedValue: "$2.4M"
  },
  systemHealth: {
    status: 'operational',
    lastIncident: 'None',
    uptime: '100%',
    chains: CHAINS.map(chain => ({ name: chain.name, status: 'online' }))
  }
};

// Simulated AI Services
class GeminiAI {
  static async analyzeThreat(transactionData) {
    const threats = [
      'Potential rug pull pattern detected',
      'Suspicious contract interaction',
      'Unusual transaction volume',
      'Phishing attempt identified',
      'Bridge exploit signature found'
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomThreat = threats[Math.floor(Math.random() * threats.length)];
        const severity = Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'high' : 'medium';
        resolve({
          threat: randomThreat,
          severity,
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
          recommendation: severity === 'critical' ? 'Immediate intervention required' : 'Monitor closely'
        });
      }, 1000);
    });
  }

  static async processCommand(command) {
    // Simulate natural language processing
    const lowerCommand = command.toLowerCase();
    let action = 'enable';
    let chains = [];

    if (lowerCommand.includes('disable') || lowerCommand.includes('remove') || lowerCommand.includes('stop')) {
      action = 'disable';
    }

    CHAINS.forEach(chain => {
      if (lowerCommand.includes(chain.name.toLowerCase()) || lowerCommand.includes(chain.id)) {
        chains.push(chain.id);
      }
    });

    if (lowerCommand.includes('all') || lowerCommand.includes('every')) {
      chains = CHAINS.map(c => c.id);
    }

    return { action, chains };
  }
}

class ZetaChainService {
  static async freezeAssets(address, chains) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          frozenAssets: chains.map(chain => ({
            chain,
            address,
            status: 'frozen',
            timestamp: new Date().toISOString()
          }))
        });
      }, 1500);
    });
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [protectedChains, setProtectedChains] = useState(['bitcoin', 'ethereum']);
  const [nlpCommand, setNlpCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [threats, setThreats] = useState([]);
  const [messages, setMessages] = useState([
    { type: 'assistant', content: 'AEGIS AI initialized. All systems operational. Ready for cross-chain security monitoring.' }
  ]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [ltvData, setLtvData] = useState([
    { time: '00:00', ltv: 0.8 },
    { time: '00:05', ltv: 0.82 },
    { time: '00:10', ltv: 0.79 },
    { time: '00:15', ltv: 0.81 },
    { time: '00:20', ltv: 0.78 }
  ]);
  const [aiControls, setAiControls] = useState({
    predictiveAnalysis: true,
    autonomousIntervention: true,
    voiceCommands: false
  });

  // Add message to chat
  const addMessage = (content, type = 'assistant') => {
    setMessages(prev => [...prev, { type, content, timestamp: new Date().toISOString() }]);
  };

  // Process natural language command
  const processCommand = async () => {
    if (!nlpCommand.trim()) return;
    
    setIsProcessing(true);
    addMessage(nlpCommand, 'user');
    
    try {
      const result = await GeminiAI.processCommand(nlpCommand);
      
      if (result.action === 'enable') {
        const newChains = Array.from(new Set([...protectedChains, ...result.chains]));
        setProtectedChains(newChains);
        addMessage(`✅ Protection enabled for: ${result.chains.map(c => CHAINS.find(ch => ch.id === c)?.name).join(', ')}`);
      } else {
        setProtectedChains(protectedChains.filter(chain => !result.chains.includes(chain)));
        addMessage(`🔓 Protection disabled for: ${result.chains.map(c => CHAINS.find(ch => ch.id === c)?.name).join(', ')}`);
      }
      
      setNlpCommand('');
    } catch (error) {
      addMessage('❌ Could not process command. Try simpler phrasing.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle global protection
  const toggleGlobalProtection = () => {
    if (protectedChains.length === CHAINS.length) {
      setProtectedChains([]);
      addMessage('🔓 All protection disabled');
    } else {
      setProtectedChains(CHAINS.map(chain => chain.id));
      addMessage('🛡️ All chains protected');
    }
  };

  // Add threat to stream
  const addThreat = (threat) => {
    setThreats(prev => [threat, ...prev.slice(0, 9)]);
    mockData.securityOverview.totalThreats++;
    if (threat.severity === 'critical') mockData.securityOverview.critical++;
    if (threat.severity === 'high') mockData.securityOverview.high++;
  };

  // Simulate advanced threat
  const simulateAdvancedThreat = async () => {
    const mockTransaction = {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      from: '0x' + Math.random().toString(16).substr(2, 40),
      to: '0x' + Math.random().toString(16).substr(2, 40),
      value: (Math.random() * 1000).toFixed(2) + ' ETH'
    };

    const analysis = await GeminiAI.analyzeThreat(mockTransaction);
    
    const threat = {
      id: `THR-${Date.now()}`,
      title: analysis.threat,
      description: `AI Confidence: ${analysis.confidence}% - ${analysis.recommendation}`,
      severity: analysis.severity,
      chain: CHAINS[Math.floor(Math.random() * CHAINS.length)].name,
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    addThreat(threat);
    
    if (analysis.severity === 'critical' && aiControls.autonomousIntervention) {
      setTimeout(async () => {
        addMessage('🚨 CRITICAL THREAT DETECTED! Initiating autonomous intervention...');
        const freezeResult = await ZetaChainService.freezeAssets(mockTransaction.from, ['ethereum', 'bitcoin']);
        addMessage(`✅ Assets frozen across ${freezeResult.frozenAssets.length} chains. Threat neutralized.`);
        
        // Update threat status
        setThreats(prev => prev.map(t => 
          t.id === threat.id ? { ...t, status: 'resolved' } : t
        ));
      }, 2000);
    }
  };

  // Start/stop simulation
  const toggleSimulation = () => {
    if (simulationActive) {
      setSimulationActive(false);
      addMessage('🔴 Simulation stopped. All systems nominal.', 'system');
    } else {
      setSimulationActive(true);
      addMessage('🟢 Advanced AI simulation started. Gemini 2.5 Pro analysis active.', 'system');
    }
  };

  // Simulation effect
  useEffect(() => {
    let interval;
    if (simulationActive) {
      interval = setInterval(async () => {
        await simulateAdvancedThreat();
        
        // Update LTV data
        setLtvData(prev => {
          const newTime = new Date().toLocaleTimeString().slice(0, 5);
          const lastValue = prev[prev.length - 1]?.ltv || 0.8;
          const newValue = Math.max(0.6, Math.min(0.9, lastValue + (Math.random() - 0.5) * 0.05));
          const newData = [...prev.slice(-4), { time: newTime, ltv: newValue }];
          return newData;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [simulationActive, aiControls.autonomousIntervention]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'investigating': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AEGIS
                </h1>
                <p className="text-sm text-slate-400">AI-POWERED SECURITY</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                ZetaChain Connected
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Aegis Auth Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Globe },
              { id: 'shield', label: 'Shield Control', icon: Shield },
              { id: 'threats', label: 'Threat Stream', icon: AlertTriangle },
              { id: 'copilot', label: 'AI Copilot', icon: Bot }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Overview */}
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-slate-400">Total Threats</p>
                    <p className="text-2xl font-bold text-white">{mockData.securityOverview.totalThreats}</p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <p className="text-sm text-slate-400">Protected Value</p>
                    <p className="text-2xl font-bold text-white">{mockData.securityOverview.protectedValue}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Critical', count: mockData.securityOverview.critical, color: 'red' },
                    { label: 'High', count: mockData.securityOverview.high, color: 'orange' },
                    { label: 'Medium', count: mockData.securityOverview.medium, color: 'yellow' },
                    { label: 'Low', count: mockData.securityOverview.low, color: 'green' }
                  ].map(({ label, count, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium text-${color}-400`}>{label}</span>
                        <span className="text-sm font-bold text-white">{count}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`} 
                          style={{ width: `${mockData.securityOverview.totalThreats > 0 ? (count / mockData.securityOverview.totalThreats) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <span className="mr-2 text-slate-400">Status:</span>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                    <span className="font-medium capitalize text-white">Operational</span>
                  </div>
                </div>
                <div className="mb-4 space-y-1">
                  <p className="text-sm text-slate-400">Uptime: {mockData.systemHealth.uptime}</p>
                  <p className="text-sm text-slate-400">Last Incident: {mockData.systemHealth.lastIncident}</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-300 mb-2">Chain Status</h3>
                  <ul className="space-y-2">
                    {mockData.systemHealth.chains.map((chain, index) => (
                      <li key={index} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${chain.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-slate-300">{chain.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* LTV Chart */}
            <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Dynamic LTV Adjustment</CardTitle>
                <p className="text-sm text-slate-400">Based on market volatility & threat scores</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ltvData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Line type="monotone" dataKey="ltv" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'shield' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* One-Click Protection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle className="text-white">Cross-Chain Security</CardTitle>
                    <p className="text-slate-400 mt-1">Enable protection across all supported blockchains</p>
                  </div>
                  <Button
                    onClick={toggleGlobalProtection}
                    className={`mt-4 md:mt-0 ${
                      protectedChains.length === CHAINS.length
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {protectedChains.length === CHAINS.length
                      ? 'Disable All Protection'
                      : 'Enable All Protection'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {CHAINS.map((chain) => (
                    <div
                      key={chain.id}
                      onClick={() => {
                        setProtectedChains((prev) =>
                          prev.includes(chain.id)
                            ? prev.filter(id => id !== chain.id)
                            : [...prev, chain.id]
                        );
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        protectedChains.includes(chain.id)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-2" style={{ color: chain.color }}>{chain.icon}</span>
                        <h3 className="font-medium text-white text-sm">{chain.name}</h3>
                        <div className="mt-2 w-6 h-6 rounded-full flex items-center justify-center">
                          {protectedChains.includes(chain.id) ? (
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-slate-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Natural Language Interface */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI Command Interface</span>
                </CardTitle>
                <p className="text-slate-400">Use natural language to manage protection</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <Input
                    value={nlpCommand}
                    onChange={(e) => setNlpCommand(e.target.value)}
                    placeholder="Type your protection command..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && processCommand()}
                  />
                  <Button
                    onClick={processCommand}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? 'Processing...' : 'Execute'}
                  </Button>
                </div>
                
                <div className="text-sm text-slate-400">
                  <p className="mb-2">Try commands like:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"Secure my Solana and Polygon wallets"</li>
                    <li>"Remove Ethereum protection"</li>
                    <li>"Enable security for all chains"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* AI Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(aiControls).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-white capitalize">
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
                  <div className="pt-4">
                    <Button
                      onClick={toggleSimulation}
                      className={`w-full ${
                        simulationActive 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {simulationActive ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Simulation
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Simulation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'threats' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Real-time Threat Stream</span>
              </CardTitle>
              <p className="text-slate-400">Live monitoring of cross-chain activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No threats detected. Start simulation to see threat analysis.
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div
                      key={threat.id}
                      className={`p-4 rounded-lg border-l-4 bg-slate-700/30 ${
                        threat.severity === 'critical' ? 'border-red-500' :
                        threat.severity === 'high' ? 'border-orange-500' :
                        threat.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                      } ${threat.status === 'active' ? 'animate-pulse' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(threat.status)}
                          <h3 className="font-semibold text-white">{threat.title}</h3>
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {threat.chain}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(threat.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{threat.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'copilot' && (
          <Card className="bg-slate-800/50 border-slate-700 h-96 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>AEGIS AI Copilot</span>
              </CardTitle>
              <p className="text-slate-400">How can I assist you?</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : message.type === 'system'
                        ? 'bg-purple-600/20 text-purple-300 mx-auto text-center text-sm'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AEGIS a question or give a command..."
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target;
                      if (input.value.trim()) {
                        addMessage(input.value, 'user');
                        setTimeout(() => {
                          addMessage('Thank you for your command. I am processing your request.');
                        }, 1000);
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;

