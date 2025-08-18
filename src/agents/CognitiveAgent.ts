import { EventEmitter } from "events";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { BlockchainEvent, ThreatAnalysis, SecurityAction, AegisAIAgent } from "./AegisAIAgent";

/**
 * Cognitive Agent - AI-Powered Threat Analysis
 * 
 * This agent uses Gemini 2.5 to:
 * - Analyze blockchain events for security threats
 * - Identify attack patterns and anomalies
 * - Generate security action recommendations
 * - Maintain context-aware threat assessment
 */
export class CognitiveAgent extends EventEmitter {
  private agent: AegisAIAgent;
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private isRunning: boolean = false;
  
  // Context management
  private contextWindow: BlockchainEvent[] = [];
  private maxContextSize: number = 100; // Keep last 100 events
  private threatPatterns: Map<string, ThreatPattern> = new Map();
  private userBehaviorProfiles: Map<string, UserBehaviorProfile> = new Map();

  constructor(agent: AegisAIAgent, genAI: GoogleGenerativeAI) {
    super();
    this.agent = agent;
    this.genAI = genAI;
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.initializeThreatPatterns();
  }

  /**
   * Initialize known threat patterns
   */
  private initializeThreatPatterns(): void {
    const patterns = [
      {
        id: 'rug_pull',
        name: 'Rug Pull',
        description: 'Liquidity removal and token abandonment',
        indicators: ['liquidity_removal', 'token_abandonment', 'developer_exit'],
        riskLevel: 'critical'
      },
      {
        id: 'phishing',
        name: 'Phishing Attack',
        description: 'Malicious contract interaction',
        indicators: ['suspicious_contract', 'unusual_permissions', 'fake_interface'],
        riskLevel: 'high'
      },
      {
        id: 'exploit',
        name: 'Smart Contract Exploit',
        description: 'Vulnerability exploitation',
        indicators: ['reentrancy', 'overflow', 'access_control'],
        riskLevel: 'critical'
      },
      {
        id: 'wash_trade',
        name: 'Wash Trading',
        description: 'Artificial volume manipulation',
        indicators: ['circular_trades', 'unusual_frequency', 'price_manipulation'],
        riskLevel: 'medium'
      },
      {
        id: 'anomaly',
        name: 'Behavioral Anomaly',
        description: 'Unusual transaction patterns',
        indicators: ['deviation_from_norm', 'suspicious_timing', 'unusual_amounts'],
        riskLevel: 'medium'
      }
    ];

    patterns.forEach(pattern => {
      this.threatPatterns.set(pattern.id, pattern);
    });
  }

  /**
   * Start the cognitive agent
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    console.log('🧠 Starting Cognitive Agent...');

    try {
      // Initialize AI model
      await this.initializeModel();
      
      this.isRunning = true;
      console.log('✅ Cognitive Agent started successfully');

    } catch (error) {
      console.error('❌ Failed to start Cognitive Agent:', error);
      throw error;
    }
  }

  /**
   * Stop the cognitive agent
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Cognitive Agent...');
    this.isRunning = false;
    console.log('✅ Cognitive Agent stopped successfully');
  }

  /**
   * Initialize the AI model
   */
  private async initializeModel(): Promise<void> {
    try {
      // Test the model with a simple prompt
      const testPrompt = "Test connection";
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      
      if (response.text()) {
        console.log('🤖 Gemini 2.5 model initialized successfully');
      }
    } catch (error) {
      console.error('❌ Failed to initialize AI model:', error);
      throw error;
    }
  }

  /**
   * Analyze a blockchain event for threats
   */
  async analyzeEvent(event: BlockchainEvent): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      console.log(`🔍 Analyzing event: ${event.hash} on chain ${event.chainId}`);
      
      // Update context window
      this.updateContextWindow(event);
      
      // Enrich event with behavioral context
      const enrichedEvent = await this.enrichEventWithContext(event);
      
      // Perform AI threat analysis
      const analysis = await this.performThreatAnalysis(enrichedEvent);
      
      // Emit analysis result
      this.emit('threat_analyzed', analysis);
      
      // Update user behavior profiles
      this.updateUserBehaviorProfile(event, analysis);
      
      console.log(`✅ Threat analysis completed: ${analysis.threatType} (${analysis.confidence * 100}% confidence)`);
      
    } catch (error) {
      console.error('Error analyzing event:', error);
      this.emit('analysis_error', { event, error });
    }
  }

  /**
   * Update context window with new event
   */
  private updateContextWindow(event: BlockchainEvent): void {
    this.contextWindow.push(event);
    
    // Maintain context size
    if (this.contextWindow.length > this.maxContextSize) {
      this.contextWindow.shift();
    }
  }

  /**
   * Enrich event with behavioral and historical context
   */
  private async enrichEventWithContext(event: BlockchainEvent): Promise<any> {
    const enriched: any = { ...event };
    
    // Add user behavior profile
    if (event.from) {
      const profile = this.userBehaviorProfiles.get(event.from);
      if (profile) {
        enriched.behaviorProfile = {
          riskScore: profile.riskScore,
          typicalTransactionValue: profile.typicalTransactionValue,
          commonRecipients: profile.commonRecipients,
          transactionFrequency: profile.transactionFrequency,
          lastActivity: profile.lastActivity
        };
      }
    }

    // Add recent context
    enriched.recentContext = this.contextWindow
      .filter(e => e.from === event.from || e.to === event.to)
      .slice(-5)
      .map(e => ({
        hash: e.hash,
        type: e.type,
        value: e.value,
        timestamp: e.timestamp
      }));

    // Add network context
    enriched.networkContext = {
      chainId: event.chainId,
      totalEventsInContext: this.contextWindow.length,
      eventsFromSameUser: this.contextWindow.filter(e => e.from === event.from).length
    };

    return enriched;
  }

  /**
   * Perform AI-powered threat analysis using Gemini 2.5
   */
  private async performThreatAnalysis(enrichedEvent: any): Promise<ThreatAnalysis> {
    try {
      // Build comprehensive analysis prompt
      const prompt = this.buildThreatAnalysisPrompt(enrichedEvent);
      
      // Get AI response
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse AI response
      const analysis = this.parseThreatAnalysis(text, enrichedEvent);
      
      return analysis;
      
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      return this.fallbackThreatAnalysis(enrichedEvent);
    }
  }

  /**
   * Build comprehensive threat analysis prompt for Gemini
   */
  private buildThreatAnalysisPrompt(enrichedEvent: any): string {
    const contextSummary = this.contextWindow
      .slice(-10)
      .map(e => `${e.type}:${e.from?.substring(0, 8)}...->${e.to?.substring(0, 8)}...`)
      .join(', ');

    return `[SYSTEM] You are Aegis Security AI, an expert blockchain security analyst. Analyze this transaction for security threats.

[CONTEXT] Recent blockchain activity: ${contextSummary}

[TRANSACTION] ${JSON.stringify(enrichedEvent, null, 2)}

[ANALYSIS REQUIREMENTS]
1. Threat Classification: Identify if this is a rug_pull, phishing, exploit, wash_trade, anomaly, or none
2. Risk Assessment: Calculate risk score (0-100) and confidence (0.0-1.0)
3. Anomaly Detection: List specific behavioral anomalies
4. Impact Prediction: Assess potential impact (low/medium/high/critical)
5. Action Recommendations: Suggest security actions (freeze_assets, alert_user, reverse_transaction, require_2fa, monitor)
6. Evidence: Provide reasoning for your assessment

[THREAT PATTERNS TO CONSIDER]
- Rug Pull: Liquidity removal, token abandonment, developer exit
- Phishing: Suspicious contracts, unusual permissions, fake interfaces
- Exploit: Reentrancy, overflow, access control vulnerabilities
- Wash Trade: Circular trades, artificial volume, price manipulation
- Anomaly: Behavioral deviation, suspicious timing, unusual amounts

[OUTPUT FORMAT] Return only valid JSON:
{
  "threatType": "none|rug_pull|phishing|exploit|wash_trade|anomaly",
  "confidence": 0.0-1.0,
  "riskScore": 0-100,
  "anomalies": ["description1", "description2"],
  "predictedImpact": "low|medium|high|critical",
  "actions": ["action1", "action2"],
  "evidence": "Detailed reasoning for the assessment",
  "urgency": 0-100
}`;
  }

  /**
   * Parse AI response into structured threat analysis
   */
  private parseThreatAnalysis(aiResponse: string, event: any): ThreatAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and create analysis
      const analysis: ThreatAnalysis = {
        threatType: this.validateThreatType(parsed.threatType),
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
        riskScore: Math.max(0, Math.min(100, Number(parsed.riskScore) || 50)),
        anomalies: Array.isArray(parsed.anomalies) ? parsed.anomalies : [],
        predictedImpact: this.validateImpact(parsed.predictedImpact),
        actions: this.parseActions(parsed.actions, event),
        evidence: parsed.evidence || 'AI analysis completed',
        urgency: Math.max(0, Math.min(100, Number(parsed.urgency) || 50))
      };
      
      return analysis;
      
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.fallbackThreatAnalysis(event);
    }
  }

  /**
   * Fallback threat analysis when AI fails
   */
  private fallbackThreatAnalysis(event: any): ThreatAnalysis {
    // Basic rule-based analysis
    let threatType: ThreatAnalysis['threatType'] = 'none';
    let riskScore = 0;
    let confidence = 0.3;
    let anomalies: string[] = [];
    let actions: SecurityAction[] = [];

    // Check for high-value transactions
    if (event.value && parseFloat(event.value) > 1000000000000000000000n) { // > 1000 ETH
      riskScore = 70;
      anomalies.push('High value transaction');
      actions.push({
        type: 'monitor',
        target: event.from || '',
        chainId: event.chainId,
        parameters: { threshold: '1000 ETH' },
        priority: 'high'
      });
    }

    // Check for suspicious contract interactions
    if (event.data && event.data.length > 1000) {
      riskScore = Math.max(riskScore, 60);
      anomalies.push('Large contract interaction');
      actions.push({
        type: 'monitor',
        target: event.to || '',
        chainId: event.chainId,
        parameters: { dataSize: event.data.length },
        priority: 'medium'
      });
    }

    // Check for known malicious addresses
    if (event.from && this.isKnownMaliciousAddress(event.from)) {
      threatType = 'phishing';
      riskScore = 90;
      confidence = 0.8;
      anomalies.push('Known malicious address');
      actions.push({
        type: 'freeze_assets',
        target: event.from,
        chainId: event.chainId,
        parameters: { reason: 'Known malicious address' },
        priority: 'critical'
      });
    }

    return {
      threatType,
      confidence,
      riskScore,
      anomalies,
      predictedImpact: riskScore > 80 ? 'critical' : riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low',
      actions,
      evidence: 'Fallback rule-based analysis',
      urgency: riskScore
    };
  }

  /**
   * Validate threat type
   */
  private validateThreatType(type: string): ThreatAnalysis['threatType'] {
    const validTypes = ['none', 'rug_pull', 'phishing', 'exploit', 'wash_trade', 'anomaly'];
    return validTypes.includes(type) ? type as any : 'none';
  }

  /**
   * Validate impact level
   */
  private validateImpact(impact: string): ThreatAnalysis['predictedImpact'] {
    const validImpacts = ['low', 'medium', 'high', 'critical'];
    return validImpacts.includes(impact) ? impact as any : 'low';
  }

  /**
   * Parse security actions from AI response
   */
  private parseActions(actionStrings: string[], event: any): SecurityAction[] {
    const actions: SecurityAction[] = [];
    
    if (!Array.isArray(actionStrings)) {
      return actions;
    }

    actionStrings.forEach(actionStr => {
      const action = this.createSecurityAction(actionStr, event);
      if (action) {
        actions.push(action);
      }
    });

    return actions;
  }

  /**
   * Create security action from string
   */
  private createSecurityAction(actionStr: string, event: any): SecurityAction | null {
    const actionMap: { [key: string]: SecurityAction['type'] } = {
      'freeze_assets': 'freeze_assets',
      'alert_user': 'alert_user',
      'reverse_transaction': 'reverse_transaction',
      'require_2fa': 'require_2fa',
      'monitor': 'monitor'
    };

    const actionType = actionMap[actionStr.toLowerCase()];
    if (!actionType) {
      return null;
    }

    return {
      type: actionType,
      target: event.from || '',
      chainId: event.chainId,
      parameters: { reason: actionStr },
      priority: this.determinePriority(event)
    };
  }

  /**
   * Determine action priority based on event
   */
  private determinePriority(event: any): SecurityAction['priority'] {
    if (event.value && parseFloat(event.value) > 1000000000000000000000n) {
      return 'critical';
    }
    if (this.isKnownMaliciousAddress(event.from)) {
      return 'critical';
    }
    if (event.data && event.data.length > 1000) {
      return 'high';
    }
    return 'medium';
  }

  /**
   * Check if address is known malicious
   */
  private isKnownMaliciousAddress(address: string): boolean {
    // In production, this would check against a database of known malicious addresses
    const maliciousAddresses = [
      '0x1234567890123456789012345678901234567890', // Example
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'  // Example
    ];
    
    return maliciousAddresses.includes(address.toLowerCase());
  }

  /**
   * Update user behavior profile
   */
  private updateUserBehaviorProfile(event: BlockchainEvent, analysis: ThreatAnalysis): void {
    if (!event.from) return;

    const profile = this.userBehaviorProfiles.get(event.from) || {
      address: event.from,
      riskScore: 50,
      typicalTransactionValue: '0',
      commonRecipients: new Set(),
      transactionFrequency: 0,
      lastActivity: Date.now(),
      transactionCount: 0
    };

    // Update profile
    profile.transactionCount++;
    profile.lastActivity = Date.now();
    
    // Update risk score based on analysis
    profile.riskScore = Math.min(100, profile.riskScore + (analysis.riskScore - 50) * 0.1);
    
    // Update typical transaction value
    if (event.value) {
      const currentValue = parseFloat(event.value);
      const typicalValue = parseFloat(profile.typicalTransactionValue);
      profile.typicalTransactionValue = ((typicalValue + currentValue) / 2).toString();
    }

    // Update common recipients
    if (event.to) {
      profile.commonRecipients.add(event.to);
    }

    // Update transaction frequency (transactions per day)
    const daysSinceLastActivity = (Date.now() - profile.lastActivity) / (1000 * 60 * 60 * 24);
    profile.transactionFrequency = profile.transactionCount / Math.max(daysSinceLastActivity, 1);

    this.userBehaviorProfiles.set(event.from, profile);
  }

  /**
   * Get agent status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      contextWindowSize: this.contextWindow.length,
      threatPatternsCount: this.threatPatterns.size,
      userProfilesCount: this.userBehaviorProfiles.size,
      modelStatus: 'active'
    };
  }

  /**
   * Get threat patterns
   */
  getThreatPatterns(): Map<string, ThreatPattern> {
    return this.threatPatterns;
  }

  /**
   * Get user behavior profiles
   */
  getUserBehaviorProfiles(): Map<string, UserBehaviorProfile> {
    return this.userBehaviorProfiles;
  }
}

// Additional interfaces for the cognitive agent
interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface UserBehaviorProfile {
  address: string;
  riskScore: number;
  typicalTransactionValue: string;
  commonRecipients: Set<string>;
  transactionFrequency: number;
  lastActivity: number;
  transactionCount: number;
}
