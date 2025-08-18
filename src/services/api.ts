import { Threat, SecurityOverview, Alert, Transaction } from '../types';

// Mock data for demonstration
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
  }
];

// Simulate real-time threat detection
let threatCounter = 4;

export const fetchSecurityOverview = async (): Promise<SecurityOverview> => {
  // In real app, this would be an API call
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
        ]
      });
    }, 500);
  });
};

export const fetchRecentThreats = async (): Promise<Threat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_THREATS);
    }, 300);
  });
};

export const fetchSystemHealth = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "operational",
        lastIncident: "2023-05-10 08:12:45",
        uptime: "99.98%",
        chains: [
          { name: "Ethereum", status: "online" },
          { name: "BSC", status: "online" },
          { name: "Polygon", status: "online" },
          { name: "Solana", status: "online" },
          { name: "Bitcoin", status: "online" },
        ],
      });
    }, 400);
  });
};

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
      ]);
    }, 600);
  });
};

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
      ]);
    }, 700);
  });
};

export const subscribeToThreats = (callback: (threat: Threat) => void) => {
  // Simulate real-time threat detection
  const interval = setInterval(() => {
    const randomThreat = {
      ...MOCK_THREATS[Math.floor(Math.random() * MOCK_THREATS.length)],
      id: `tx-${threatCounter++}`,
      timestamp: new Date().toISOString(),
      severity: Math.floor(Math.random() * 40) + 60
    };
    callback(randomThreat);
  }, 15000); // New threat every 15 seconds
  
  // Return unsubscribe function
  return () => clearInterval(interval);
};

export const executeSecurityAction = async (action: string, threatId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Executing ${action} for threat ${threatId}`);
      resolve(true);
    }, 1000);
  });
};

export const updateSecuritySettings = async (settings: any): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating security settings:', settings);
      resolve(true);
    }, 500);
  });
};

export const generateSecurityReport = async (timeRange: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Security report generated for ${timeRange}. Found 142 threats with 12 critical, 24 high, 46 medium, and 60 low severity.`);
    }, 2000);
  });
}; 