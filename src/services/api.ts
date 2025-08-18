import { Threat, SecurityOverview, Alert, Transaction } from '../types';

// Enhanced mock data for AEGIS demo
const MOCK_THREATS: Threat[] = [
  {
    id: 'tx-001',
    chain: 'ethereum',
    txHash: '0x4a7d1ed...',
    from: '0x742d35...',
    to: '0x7a250d...',
    value: '1.2 ETH',
    type: 'Rug Pull',
    severity: 92,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    description: 'Detected abnormal liquidity removal pattern consistent with rug pulls',
    aiAnalysis: 'Detected abnormal liquidity removal pattern consistent with rug pulls. 95% confidence based on historical patterns and contract analysis.',
    patterns: [
      'Large liquidity removal',
      'Token contract renounced',
      'Funds moved to mixer',
      'Social channels deleted'
    ],
    riskIndicators: [
      { name: 'Liquidity Change', value: 98 },
      { name: 'Contract Risk', value: 87 },
      { name: 'Behavior Anomaly', value: 93 }
    ],
    recommendedActions: [
      {
        title: 'Freeze Assets',
        description: 'Immediately freeze all related assets across chains',
        priority: 'critical'
      },
      {
        title: 'Alert Users',
        description: 'Notify all affected users about potential scam',
        priority: 'high'
      },
      {
        title: 'Blacklist Address',
        description: 'Add address to global blacklist',
        priority: 'high'
      }
    ]
  },
  {
    id: 'tx-002',
    chain: 'bitcoin',
    txHash: '0x5b8c2b3...',
    from: '0xbb4cdb...',
    to: '0x10ed43...',
    value: '0.5 BTC',
    type: 'Phishing',
    severity: 78,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    description: 'Transaction matching known phishing patterns detected',
    aiAnalysis: 'Transaction exhibits characteristics of a phishing attack. 78% confidence based on destination address patterns and transaction timing.',
    patterns: [
      'Known phishing address',
      'Suspicious timing',
      'Unusual amount',
      'Multiple small transfers'
    ],
    riskIndicators: [
      { name: 'Address Reputation', value: 78 },
      { name: 'Transaction Pattern', value: 82 },
      { name: 'Amount Anomaly', value: 65 }
    ],
    recommendedActions: [
      {
        title: 'Block Address',
        description: 'Add destination address to blacklist',
        priority: 'high'
      },
      {
        title: 'User Alert',
        description: 'Send immediate warning to user',
        priority: 'high'
      },
      {
        title: 'Monitor Activity',
        description: 'Track related addresses for patterns',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'tx-003',
    chain: 'polygon',
    txHash: '0x3ac7d3e...',
    from: '0x2791bc...',
    to: '0x0d500b...',
    value: '8500 MATIC',
    type: 'Suspicious Contract',
    severity: 65,
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    description: 'Interaction with contract containing known vulnerabilities',
    aiAnalysis: 'Contract interaction shows potential security risks. 65% confidence based on contract code analysis and historical incidents.',
    patterns: [
      'Known vulnerable contract',
      'Unusual function calls',
      'Suspicious parameter values'
    ],
    riskIndicators: [
      { name: 'Contract Security', value: 65 },
      { name: 'Function Risk', value: 72 },
      { name: 'Parameter Validation', value: 58 }
    ],
    recommendedActions: [
      {
        title: 'Warning Issued',
        description: 'Send security warning to user',
        priority: 'medium'
      },
      {
        title: 'Contract Analysis',
        description: 'Perform deep contract security audit',
        priority: 'medium'
      },
      {
        title: 'Monitor Execution',
        description: 'Track transaction execution for anomalies',
        priority: 'low'
      }
    ]
  },
  {
    id: 'tx-004',
    chain: 'solana',
    txHash: '0x8f2e1a7...',
    from: '0x9c4f8d...',
    to: '0x3b7a2e...',
    value: '2500 SOL',
    type: 'Flash Loan Attack',
    severity: 88,
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    description: 'Detected potential flash loan attack pattern',
    aiAnalysis: 'Transaction sequence matches known flash loan attack patterns. 88% confidence based on DeFi protocol analysis.',
    patterns: [
      'Flash loan borrowing',
      'Multiple DEX swaps',
      'Price manipulation',
      'Quick repayment'
    ],
    riskIndicators: [
      { name: 'DeFi Risk', value: 88 },
      { name: 'Price Impact', value: 76 },
      { name: 'Timing Pattern', value: 82 }
    ],
    recommendedActions: [
      {
        title: 'Freeze Protocol',
        description: 'Temporarily freeze affected DeFi protocol',
        priority: 'critical'
      },
      {
        title: 'Investigate Impact',
        description: 'Analyze full attack vector and damage',
        priority: 'high'
      },
      {
        title: 'User Compensation',
        description: 'Prepare compensation for affected users',
        priority: 'high'
      }
    ]
  },
  {
    id: 'tx-005',
    chain: 'ethereum',
    txHash: '0x6d9e4f2...',
    from: '0x8a1b3c...',
    to: '0x5f7e9d...',
    value: '5000 USDC',
    type: 'MEV Bot',
    severity: 45,
    timestamp: new Date(Date.now() - 10 * 60 * 60000).toISOString(),
    description: 'MEV bot activity detected',
    aiAnalysis: 'Standard MEV bot activity detected. 45% confidence - this is normal market behavior.',
    patterns: [
      'Gas price manipulation',
      'Mempool monitoring',
      'Sandwich attacks',
      'Arbitrage execution'
    ],
    riskIndicators: [
      { name: 'MEV Activity', value: 45 },
      { name: 'Gas Manipulation', value: 38 },
      { name: 'Market Impact', value: 42 }
    ],
    recommendedActions: [
      {
        title: 'Monitor Activity',
        description: 'Track for excessive MEV impact',
        priority: 'low'
      },
      {
        title: 'User Education',
        description: 'Inform users about MEV protection',
        priority: 'low'
      }
    ]
  }
];

// Enhanced security overview with realistic data
export const fetchSecurityOverview = async (): Promise<SecurityOverview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalThreats: 142,
        critical: 12,
        high: 24,
        medium: 46,
        low: 60,
        protectedValue: "$2.4M",
        chains: [
          { name: 'Ethereum', status: 'online', threats: 42 },
          { name: 'Bitcoin', status: 'online', threats: 18 },
          { name: 'Solana', status: 'online', threats: 27 },
          { name: 'Polygon', status: 'online', threats: 35 },
          { name: 'Avalanche', status: 'online', threats: 20 }
        ],
        // Additional metrics for enhanced dashboard
        totalAssets: 156,
        activeLoans: 23,
        liquidationRisk: 'Low',
        aiConfidence: 94.2,
        lastUpdate: new Date().toISOString(),
        marketConditions: 'Stable',
        volatilityIndex: 28,
        fearGreedIndex: 65
      });
    }, 500);
  });
};

// Enhanced recent threats with more variety
export const fetchRecentThreats = async (): Promise<Threat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_THREATS);
    }, 300);
  });
};

// Enhanced system health with detailed chain status
export const fetchSystemHealth = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "operational",
        lastIncident: "2023-05-10 08:12:45",
        uptime: "99.98%",
        chains: [
          { name: "Ethereum", status: "online", latency: "45ms", tps: 15.2 },
          { name: "BSC", status: "online", latency: "32ms", tps: 8.7 },
          { name: "Polygon", status: "online", latency: "28ms", tps: 12.1 },
          { name: "Solana", status: "online", latency: "18ms", tps: 65.3 },
          { name: "Bitcoin", status: "online", latency: "120ms", tps: 4.2 },
        ],
        overallMetrics: {
          totalTransactions: 2847500,
          activeUsers: 15420,
          securityScore: 94.2,
          responseTime: "1.2s"
        }
      });
    }, 400);
  });
};

// Enhanced transactions with realistic data
export const fetchTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          hash: "0x4a7d1ed...",
          chain: "Ethereum",
          from: "0x742d35...",
          to: "0x7a250d...",
          value: "1.2 ETH",
          threatLevel: "critical",
          threatType: "Phishing",
          timestamp: "2023-05-15 14:30:22",
        },
        {
          id: "2",
          hash: "0x5b8c2b3...",
          chain: "BSC",
          from: "0xbb4cdb...",
          to: "0x10ed43...",
          value: "2400 BUSD",
          threatLevel: "none",
          timestamp: "2023-05-15 13:22:11",
        },
        {
          id: "3",
          hash: "0x3ac7d3e...",
          chain: "Polygon",
          from: "0x2791bc...",
          to: "0x0d500b...",
          value: "8500 MATIC",
          threatLevel: "medium",
          threatType: "Suspicious Contract",
          timestamp: "2023-05-15 11:05:44",
        },
        {
          id: "4",
          hash: "0x8f2e1a7...",
          chain: "Solana",
          from: "0x9c4f8d...",
          to: "0x3b7a2e...",
          value: "2500 SOL",
          threatLevel: "high",
          threatType: "Flash Loan Attack",
          timestamp: "2023-05-15 10:15:33",
        },
        {
          id: "5",
          hash: "0x6d9e4f2...",
          chain: "Ethereum",
          from: "0x8a1b3c...",
          to: "0x5f7e9d...",
          value: "5000 USDC",
          threatLevel: "low",
          threatType: "MEV Bot",
          timestamp: "2023-05-15 09:45:12",
        }
      ]);
    }, 600);
  });
};

// Enhanced alerts with detailed information
export const fetchAlerts = async (): Promise<Alert[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "A-001",
          title: "Critical: Rug Pull Detected",
          description: "A token contract removed liquidity and transferred funds to an unknown address.",
          severity: "critical",
          chain: "Ethereum",
          detectedAt: "2023-05-15 14:30:22",
          actionTaken: "Assets frozen, transactions halted",
          status: "new",
        },
        {
          id: "A-002",
          title: "High: Phishing Attempt",
          description: "A transaction matching known phishing patterns was detected.",
          severity: "high",
          chain: "BSC",
          detectedAt: "2023-05-15 12:15:04",
          actionTaken: "User notified, transaction blocked",
          status: "acknowledged",
        },
        {
          id: "A-003",
          title: "Medium: Suspicious Contract",
          description: "A contract with known vulnerabilities was interacted with.",
          severity: "medium",
          chain: "Polygon",
          detectedAt: "2023-05-14 09:45:33",
          actionTaken: "Warning issued to user",
          status: "resolved",
        },
        {
          id: "A-004",
          title: "High: Flash Loan Attack",
          description: "Potential flash loan attack detected on Solana DeFi protocol.",
          severity: "high",
          chain: "Solana",
          detectedAt: "2023-05-15 10:15:33",
          actionTaken: "Protocol temporarily frozen",
          status: "investigating",
        },
        {
          id: "A-005",
          title: "Low: MEV Bot Activity",
          description: "Increased MEV bot activity detected on Ethereum.",
          severity: "low",
          chain: "Ethereum",
          detectedAt: "2023-05-15 09:45:12",
          actionTaken: "Monitoring increased",
          status: "monitoring",
        }
      ]);
    }, 700);
  });
};

// Enhanced real-time threat subscription with variety
export const subscribeToThreats = (callback: (threat: Threat) => void) => {
  const threatTypes = ['Phishing', 'Rug Pull', 'Flash Loan Attack', 'Suspicious Contract', 'MEV Bot'];
  const chains = ['ethereum', 'bitcoin', 'solana', 'polygon', 'avalanche'];
  
  const interval = setInterval(() => {
    const randomThreat = {
      ...MOCK_THREATS[Math.floor(Math.random() * MOCK_THREATS.length)],
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: Math.floor(Math.random() * 40) + 60,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      chain: chains[Math.floor(Math.random() * chains.length)]
    };
    callback(randomThreat);
  }, 15000); // New threat every 15 seconds
  
  return () => clearInterval(interval);
};

// Enhanced security actions with realistic responses
export const executeSecurityAction = async (action: string, threatId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Executing ${action} for threat ${threatId}`);
      resolve(true);
    }, 1000);
  });
};

// Enhanced settings update with validation
export const updateSecuritySettings = async (settings: any): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating security settings:', settings);
      resolve(true);
    }, 500);
  });
};

// Enhanced security report generation
export const generateSecurityReport = async (timeRange: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = `Security report generated for ${timeRange}. 
      
Key Findings:
• Total threats: 142 (12 critical, 24 high, 46 medium, 60 low)
• Protected value: $2.4M across 5 chains
• AI confidence: 94.2%
• Response time: 1.2 seconds average
• Uptime: 99.98%

Recommendations:
• Enable AI Shield mode for all chains
• Review critical threat patterns
• Update security parameters for high-risk assets`;
      resolve(report);
    }, 2000);
  });
};

// New function: Fetch portfolio data
export const fetchPortfolioData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalValue: 2450000,
        assets: [
          { chain: 'Bitcoin', asset: 'BTC', amount: 2.5, value: 150000, apy: 0 },
          { chain: 'Ethereum', asset: 'ETH', amount: 15.2, value: 45000, apy: 0 },
          { chain: 'Solana', asset: 'SOL', amount: 1200, value: 120000, apy: 8.5 },
          { chain: 'Polygon', asset: 'MATIC', amount: 50000, value: 50000, apy: 12.2 }
        ],
        loans: [
          { chain: 'Ethereum', asset: 'USDC', amount: 50000, collateral: 150000, ltv: 33.3 },
          { chain: 'Solana', asset: 'JitoSOL', amount: 25000, collateral: 120000, ltv: 20.8 }
        ],
        riskScore: 24,
        liquidationBuffer: 180000
      });
    }, 800);
  });
};

// New function: Fetch market data
export const fetchMarketData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        btcPrice: 60000,
        ethPrice: 2950,
        solPrice: 100,
        maticPrice: 1.0,
        marketCap: 1250000000000,
        volume24h: 45000000000,
        fearGreedIndex: 65,
        volatilityIndex: 28
      });
    }, 600);
  });
}; 