import { GoogleGenerativeAI } from "@google/generative-ai";
import { ethers } from "ethers";
import { EventEmitter } from "events";
import { CONFIG } from "../../contracts/config";

// Core interfaces for the AI agent
export interface BlockchainEvent {
  type: 'transaction' | 'block' | 'contract_event';
  chainId: number;
  hash: string;
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  timestamp: number;
  metadata: {
    gasPrice?: string;
    nonce?: number;
    blockNumber?: number;
    [key: string]: any;
  };
}

export interface ThreatAnalysis {
  threatType: 'none' | 'rug_pull' | 'phishing' | 'exploit' | 'wash_trade' | 'anomaly';
  confidence: number; // 0-1
  riskScore: number; // 0-100
  anomalies: string[];
  predictedImpact: 'low' | 'medium' | 'high' | 'critical';
  actions: SecurityAction[];
  evidence: string;
  urgency: number; // 0-100
}

export interface SecurityAction {
  type: 'freeze_assets' | 'alert_user' | 'reverse_transaction' | 'require_2fa' | 'monitor';
  target: string;
  chainId: number;
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentContext {
  userProfiles: Map<string, UserProfile>;
  threatDatabase: ThreatDatabase;
  knowledgeGraph: KnowledgeGraph;
  actionHistory: ActionRecord[];
}

export interface UserProfile {
  address: string;
  riskScore: number;
  behaviorPatterns: BehaviorPattern[];
  historicalTransactions: TransactionRecord[];
  lastUpdated: number;
}

export interface BehaviorPattern {
  type: string;
  frequency: number;
  averageValue: string;
  typicalRecipients: string[];
  riskIndicator: number;
}

export interface TransactionRecord {
  hash: string;
  chainId: number;
  value: string;
  timestamp: number;
  riskScore: number;
}

export interface ThreatDatabase {
  knownPatterns: Map<string, ThreatPattern>;
  recentThreats: ThreatRecord[];
  blacklistedAddresses: Set<string>;
}

export interface ThreatPattern {
  signature: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationActions: string[];
  confidence: number;
}

export interface ThreatRecord {
  id: string;
  pattern: string;
  affectedUsers: string[];
  timestamp: number;
  resolved: boolean;
  actionTaken: string;
}

export interface KnowledgeGraph {
  entities: Map<string, GraphEntity>;
  relationships: Map<string, GraphRelationship>;
}

export interface GraphEntity {
  id: string;
  type: 'address' | 'contract' | 'token' | 'transaction';
  properties: Record<string, any>;
  riskScore: number;
}

export interface GraphRelationship {
  id: string;
  from: string;
  to: string;
  type: string;
  strength: number;
  riskIndicator: number;
}

export interface ActionRecord {
  id: string;
  action: SecurityAction;
  timestamp: number;
  executed: boolean;
  result: 'success' | 'failure' | 'pending';
  evidence: string;
}

/**
 * Aegis AI Agent - Autonomous Blockchain Security System
 * 
 * This agent integrates:
 * 1. Blockchain monitoring across multiple chains
 * 2. Gemini 2.5 threat analysis
 * 3. Cross-chain security execution via ZetaChain
 * 4. Autonomous decision making and learning
 */
export class AegisAIAgent extends EventEmitter {
  private genAI: GoogleGenerativeAI;
  private context: AgentContext;
  private isRunning: boolean = false;
  private eventQueue: BlockchainEvent[] = [];
  private processingQueue: boolean = false;
  
  // Agent components
  private perceptionAgent: PerceptionAgent;
  private cognitiveAgent: CognitiveAgent;
  private actionAgent: ActionAgent;
  private learningModule: LearningModule;

  constructor() {
    super();
    
    this.genAI = new GoogleGenerativeAI(CONFIG.ZETA_API_KEY);
    this.context = this.initializeContext();
    
    // Initialize agent components
    this.perceptionAgent = new PerceptionAgent(this);
    this.cognitiveAgent = new CognitiveAgent(this, this.genAI);
    this.actionAgent = new ActionAgent(this);
    this.learningModule = new LearningModule(this);
    
    this.setupEventHandlers();
  }

  /**
   * Initialize the AI agent context
   */
  private initializeContext(): AgentContext {
    return {
      userProfiles: new Map(),
      threatDatabase: {
        knownPatterns: new Map(),
        recentThreats: [],
        blacklistedAddresses: new Set()
      },
      knowledgeGraph: {
        entities: new Map(),
        relationships: new Map()
      },
      actionHistory: []
    };
  }

  /**
   * Setup event handlers for agent coordination
   */
  private setupEventHandlers(): void {
    // Perception -> Cognitive
    this.perceptionAgent.on('event_detected', (event: BlockchainEvent) => {
      this.cognitiveAgent.analyzeEvent(event);
    });

    // Cognitive -> Action
    this.cognitiveAgent.on('threat_analyzed', (analysis: ThreatAnalysis) => {
      this.actionAgent.executeResponse(analysis);
    });

    // Action -> Learning
    this.actionAgent.on('action_executed', (record: ActionRecord) => {
      this.learningModule.processOutcome(record);
    });

    // Learning -> Context update
    this.learningModule.on('context_updated', () => {
      this.updateContext();
    });
  }

  /**
   * Start the AI agent
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('AI Agent already running');
      return;
    }

    console.log('🚀 Starting Aegis AI Agent...');
    
    try {
      // Start all agent components
      await this.perceptionAgent.start();
      await this.cognitiveAgent.start();
      await this.actionAgent.start();
      await this.learningModule.start();
      
      this.isRunning = true;
      
      // Start event processing loop
      this.startEventProcessing();
      
      console.log('✅ Aegis AI Agent started successfully');
      this.emit('agent_started');
      
    } catch (error) {
      console.error('❌ Failed to start AI Agent:', error);
      throw error;
    }
  }

  /**
   * Stop the AI agent
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Aegis AI Agent...');
    
    try {
      // Stop all agent components
      await this.perceptionAgent.stop();
      await this.cognitiveAgent.stop();
      await this.actionAgent.stop();
      await this.learningModule.stop();
      
      this.isRunning = false;
      this.processingQueue = false;
      
      console.log('✅ Aegis AI Agent stopped successfully');
      this.emit('agent_stopped');
      
    } catch (error) {
      console.error('❌ Error stopping AI Agent:', error);
      throw error;
    }
  }

  /**
   * Start the event processing loop
   */
  private startEventProcessing(): void {
    if (this.processingQueue) {
      return;
    }

    this.processingQueue = true;
    
    const processEvents = async () => {
      while (this.isRunning && this.processingQueue) {
        if (this.eventQueue.length > 0) {
          const event = this.eventQueue.shift()!;
          await this.processEvent(event);
        } else {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        }
      }
    };

    processEvents().catch(error => {
      console.error('Error in event processing loop:', error);
      this.processingQueue = false;
    });
  }

  /**
   * Process a blockchain event
   */
  private async processEvent(event: BlockchainEvent): Promise<void> {
    try {
      console.log(`🔍 Processing event: ${event.type} on chain ${event.chainId}`);
      
      // Enrich event with context
      const enrichedEvent = await this.enrichEvent(event);
      
      // Send to perception agent for initial processing
      this.perceptionAgent.processEvent(enrichedEvent);
      
    } catch (error) {
      console.error('Error processing event:', error);
      this.emit('event_processing_error', { event, error });
    }
  }

  /**
   * Enrich event with contextual information
   */
  private async enrichEvent(event: BlockchainEvent): Promise<BlockchainEvent> {
    const enriched = { ...event };
    
    // Add user profile information
    if (event.from) {
      const profile = this.context.userProfiles.get(event.from);
      if (profile) {
        enriched.metadata.userProfile = {
          riskScore: profile.riskScore,
          behaviorPatterns: profile.behaviorPatterns.length,
          lastActivity: profile.lastUpdated
        };
      }
    }

    // Add knowledge graph connections
    if (event.from || event.to) {
      const connections = this.getEntityConnections(event.from || event.to!);
      enriched.metadata.connections = connections;
    }

    // Add threat database matches
    const threatMatches = this.findThreatMatches(event);
    enriched.metadata.threatMatches = threatMatches;

    return enriched;
  }

  /**
   * Get entity connections from knowledge graph
   */
  private getEntityConnections(address: string): any {
    const connections: any = {
      relatedEntities: [],
      riskIndicators: [],
      threatPatterns: []
    };

    // Find related entities
    for (const [id, relationship] of this.context.knowledgeGraph.relationships) {
      if (relationship.from === address || relationship.to === address) {
        connections.relatedEntities.push({
          entity: relationship.from === address ? relationship.to : relationship.from,
          type: relationship.type,
          strength: relationship.strength,
          riskIndicator: relationship.riskIndicator
        });
      }
    }

    return connections;
  }

  /**
   * Find threat matches in database
   */
  private findThreatMatches(event: BlockchainEvent): any[] {
    const matches: any[] = [];

    // Check against known patterns
    for (const [signature, pattern] of this.context.threatDatabase.knownPatterns) {
      if (this.matchesPattern(event, pattern)) {
        matches.push({
          type: 'known_pattern',
          pattern: pattern.description,
          riskLevel: pattern.riskLevel,
          confidence: pattern.confidence
        });
      }
    }

    // Check against blacklisted addresses
    if (event.from && this.context.threatDatabase.blacklistedAddresses.has(event.from)) {
      matches.push({
        type: 'blacklisted_address',
        address: event.from,
        riskLevel: 'critical'
      });
    }

    return matches;
  }

  /**
   * Check if event matches a threat pattern
   */
  private matchesPattern(event: BlockchainEvent, pattern: ThreatPattern): boolean {
    // Simple pattern matching - in production, this would be more sophisticated
    const eventData = JSON.stringify(event).toLowerCase();
    const patternKeywords = pattern.signature.toLowerCase().split(' ');
    
    return patternKeywords.some(keyword => eventData.includes(keyword));
  }

  /**
   * Add event to processing queue
   */
  addEvent(event: BlockchainEvent): void {
    this.eventQueue.push(event);
    
    // Prioritize critical events
    if (this.isCriticalEvent(event)) {
      this.eventQueue.unshift(event);
    }
    
    this.emit('event_queued', event);
  }

  /**
   * Check if event is critical
   */
  private isCriticalEvent(event: BlockchainEvent): boolean {
    // High value transactions
    if (event.value && parseFloat(event.value) > 1000000000000000000000n) { // > 1000 ETH
      return true;
    }

    // Known malicious addresses
    if (event.from && this.context.threatDatabase.blacklistedAddresses.has(event.from)) {
      return true;
    }

    // Suspicious contract interactions
    if (event.data && event.data.length > 1000) {
      return true;
    }

    return false;
  }

  /**
   * Update agent context
   */
  private updateContext(): void {
    // This would update the context based on learning outcomes
    console.log('🔄 Updating agent context...');
    this.emit('context_updated');
  }

  /**
   * Get agent status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      eventQueueLength: this.eventQueue.length,
      processingQueue: this.processingQueue,
      userProfilesCount: this.context.userProfiles.size,
      knownThreatsCount: this.context.threatDatabase.knownPatterns.size,
      actionHistoryCount: this.context.actionHistory.length
    };
  }

  /**
   * Get agent context
   */
  getContext(): AgentContext {
    return this.context;
  }

  /**
   * Update user profile
   */
  updateUserProfile(address: string, profile: Partial<UserProfile>): void {
    const existing = this.context.userProfiles.get(address) || {
      address,
      riskScore: 50,
      behaviorPatterns: [],
      historicalTransactions: [],
      lastUpdated: Date.now()
    };

    this.context.userProfiles.set(address, {
      ...existing,
      ...profile,
      lastUpdated: Date.now()
    });
  }

  /**
   * Add threat pattern to database
   */
  addThreatPattern(signature: string, pattern: ThreatPattern): void {
    this.context.threatDatabase.knownPatterns.set(signature, pattern);
    console.log(`🔒 Added threat pattern: ${pattern.description}`);
  }

  /**
   * Record action execution
   */
  recordAction(action: SecurityAction, result: 'success' | 'failure' | 'pending', evidence: string): void {
    const record: ActionRecord = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      timestamp: Date.now(),
      executed: true,
      result,
      evidence
    };

    this.context.actionHistory.push(record);
    this.emit('action_recorded', record);
  }
}

// Export the main agent class
export default AegisAIAgent;
