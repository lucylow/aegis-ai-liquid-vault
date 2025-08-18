import { AegisAIAgent } from '../agents/AegisAIAgent';
import { BlockchainEvent } from '../agents/AegisAIAgent';

/**
 * Aegis AI Agent Demo - Comprehensive Showcase
 * 
 * This demo showcases:
 * 1. AI Agent initialization and startup
 * 2. Blockchain event monitoring across multiple chains
 * 3. AI-powered threat analysis using Gemini 2.5
 * 4. Autonomous security action execution
 * 5. Cross-chain operations via ZetaChain
 * 6. Learning and self-improvement capabilities
 */
export class AegisAIAgentDemo {
  private agent: AegisAIAgent;
  private isRunning: boolean = false;
  private demoStep: number = 0;
  private eventCount: number = 0;
  private threatCount: number = 0;
  private actionCount: number = 0;

  constructor() {
    this.agent = new AegisAIAgent();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for the demo
   */
  private setupEventListeners(): void {
    // Agent lifecycle events
    this.agent.on('agent_started', () => {
      console.log('🎉 Demo: AI Agent started successfully');
      this.demoStep++;
    });

    this.agent.on('agent_stopped', () => {
      console.log('🛑 Demo: AI Agent stopped');
    });

    // Event processing events
    this.agent.on('event_queued', (event: BlockchainEvent) => {
      this.eventCount++;
      console.log(`📡 Demo: Event ${this.eventCount} queued from chain ${event.chainId}`);
    });

    this.agent.on('event_processing_error', (data: any) => {
      console.error(`❌ Demo: Event processing error:`, data.error);
    });

    // Threat analysis events
    this.agent.on('threat_analyzed', (analysis: any) => {
      this.threatCount++;
      console.log(`🚨 Demo: Threat ${this.threatCount} analyzed - ${analysis.threatType} (${(analysis.confidence * 100).toFixed(1)}% confidence)`);
    });

    // Action execution events
    this.agent.on('action_executed', (record: any) => {
      this.actionCount++;
      console.log(`⚡ Demo: Action ${this.actionCount} executed - ${record.action.type} -> ${record.result}`);
    });

    // Learning events
    this.agent.on('experience_recorded', (experience: any) => {
      console.log(`📚 Demo: Experience recorded - ${experience.action.type} -> ${experience.outcome}`);
    });

    this.agent.on('learning_completed', (data: any) => {
      console.log(`🧠 Demo: Learning completed - ${data.patterns.length} patterns analyzed`);
    });

    this.agent.on('adaptation_executed', (data: any) => {
      console.log(`🔄 Demo: Adaptation executed - ${data.rule.description}`);
    });

    // Context update events
    this.agent.on('context_updated', () => {
      console.log(`🔄 Demo: Agent context updated`);
    });

    this.agent.on('action_recorded', (record: any) => {
      console.log(`📝 Demo: Action recorded in main agent`);
    });
  }

  /**
   * Start the comprehensive demo
   */
  async startDemo(): Promise<void> {
    if (this.isRunning) {
      console.log('Demo already running');
      return;
    }

    console.log('🚀 Starting Aegis AI Agent Comprehensive Demo...\n');
    this.isRunning = true;

    try {
      // Step 1: Initialize and start the AI agent
      await this.demoAgentInitialization();
      
      // Step 2: Demonstrate blockchain monitoring
      await this.demoBlockchainMonitoring();
      
      // Step 3: Showcase AI threat analysis
      await this.demoAIThreatAnalysis();
      
      // Step 4: Demonstrate security action execution
      await this.demoSecurityActionExecution();
      
      // Step 5: Showcase cross-chain operations
      await this.demoCrossChainOperations();
      
      // Step 6: Demonstrate learning capabilities
      await this.demoLearningCapabilities();
      
      // Step 7: Performance and metrics showcase
      await this.demoPerformanceMetrics();
      
      // Step 8: Integration workflow demonstration
      await this.demoIntegrationWorkflow();
      
      console.log('\n🎉 Aegis AI Agent Demo completed successfully!');
      
    } catch (error) {
      console.error('❌ Demo failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Step 1: Agent initialization and startup
   */
  private async demoAgentInitialization(): Promise<void> {
    console.log('📋 Step 1: Agent Initialization & Startup');
    console.log('==========================================');
    
    // Show initial status
    console.log('Initial agent status:', this.agent.getStatus());
    
    // Start the agent
    console.log('\n🚀 Starting AI Agent...');
    await this.agent.start();
    
    // Wait for startup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show running status
    console.log('\n✅ Agent startup completed');
    console.log('Running status:', this.agent.getStatus());
    
    console.log('✅ Step 1 completed\n');
  }

  /**
   * Step 2: Blockchain monitoring demonstration
   */
  private async demoBlockchainMonitoring(): Promise<void> {
    console.log('📋 Step 2: Blockchain Event Monitoring');
    console.log('=======================================');
    
    // Simulate blockchain events from different chains
    console.log('\n🔗 Simulating blockchain events...');
    
    const simulatedEvents = [
      this.createSimulatedEvent('ethereum', 1, '0x1234567890123456789012345678901234567890'),
      this.createSimulatedEvent('polygon', 137, '0x2345678901234567890123456789012345678901'),
      this.createSimulatedEvent('bsc', 56, '0x3456789012345678901234567890123456789012'),
      this.createSimulatedEvent('bitcoin', 0, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
      this.createSimulatedEvent('solana', 101, '0x4567890123456789012345678901234567890123')
    ];

    // Add events to the agent
    for (const event of simulatedEvents) {
      this.agent.addEvent(event);
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between events
    }
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`✅ Step 2 completed - ${this.eventCount} events processed\n`);
  }

  /**
   * Step 3: AI threat analysis demonstration
   */
  private async demoAIThreatAnalysis(): Promise<void> {
    console.log('📋 Step 3: AI-Powered Threat Analysis');
    console.log('=======================================');
    
    console.log('\n🤖 Demonstrating Gemini 2.5 threat analysis...');
    
    // Simulate high-risk events to trigger threat analysis
    const highRiskEvents = [
      this.createHighRiskEvent('rug_pull', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'),
      this.createHighRiskEvent('phishing', '0xbcdefabcdefabcdefabcdefabcdefabcdefabcde'),
      this.createHighRiskEvent('exploit', '0xcdefabcdefabcdefabcdefabcdefabcdefabcdef')
    ];

    for (const event of highRiskEvents) {
      this.agent.addEvent(event);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    
    // Wait for AI analysis
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(`✅ Step 3 completed - ${this.threatCount} threats analyzed\n`);
  }

  /**
   * Step 4: Security action execution demonstration
   */
  private async demoSecurityActionExecution(): Promise<void> {
    console.log('📋 Step 4: Security Action Execution');
    console.log('=====================================');
    
    console.log('\n⚡ Demonstrating security action execution...');
    
    // Simulate critical threats that require immediate action
    const criticalEvents = [
      this.createCriticalEvent('freeze_assets', '0xdefabcdefabcdefabcdefabcdefabcdefabcdefab'),
      this.createCriticalEvent('alert_user', '0xefabcdefabcdefabcdefabcdefabcdefabcdefabc'),
      this.createCriticalEvent('reverse_transaction', '0xfabcdefabcdefabcdefabcdefabcdefabcdefabcd')
    ];

    for (const event of criticalEvents) {
      this.agent.addEvent(event);
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay
    }
    
    // Wait for action execution
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log(`✅ Step 4 completed - ${this.actionCount} actions executed\n`);
  }

  /**
   * Step 5: Cross-chain operations demonstration
   */
  private async demoCrossChainOperations(): Promise<void> {
    console.log('📋 Step 5: Cross-Chain Operations via ZetaChain');
    console.log('================================================');
    
    console.log('\n🌐 Demonstrating cross-chain security operations...');
    
    // Simulate cross-chain threat scenarios
    const crossChainEvents = [
      this.createCrossChainEvent('ethereum', 1, 'freeze_assets'),
      this.createCrossChainEvent('polygon', 137, 'monitor'),
      this.createCrossChainEvent('bsc', 56, 'require_2fa')
    ];

    for (const event of crossChainEvents) {
      this.agent.addEvent(event);
      await new Promise(resolve => setTimeout(resolve), 600);
    }
    
    // Wait for cross-chain execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Step 5 completed - Cross-chain operations demonstrated\n');
  }

  /**
   * Step 6: Learning capabilities demonstration
   */
  private async demoLearningCapabilities(): Promise<void> {
    console.log('📋 Step 6: AI Learning & Self-Improvement');
    console.log('===========================================');
    
    console.log('\n🧠 Demonstrating learning capabilities...');
    
    // Simulate various action outcomes for learning
    const learningEvents = [
      this.createLearningEvent('success', 'freeze_assets'),
      this.createLearningEvent('failure', 'alert_user'),
      this.createLearningEvent('success', 'monitor'),
      this.createLearningEvent('pending', 'reverse_transaction')
    ];

    for (const event of learningEvents) {
      this.agent.addEvent(event);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Wait for learning processing
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    console.log('✅ Step 6 completed - Learning capabilities demonstrated\n');
  }

  /**
   * Step 7: Performance metrics showcase
   */
  private async demoPerformanceMetrics(): Promise<void> {
    console.log('📋 Step 7: Performance Metrics & Analytics');
    console.log('===========================================');
    
    console.log('\n📊 Displaying performance metrics...');
    
    // Get comprehensive status
    const agentStatus = this.agent.getStatus();
    const context = this.agent.getContext();
    
    console.log('\n🤖 AI Agent Status:');
    console.log(JSON.stringify(agentStatus, null, 2));
    
    console.log('\n📈 Performance Summary:');
    console.log(`- Events Processed: ${this.eventCount}`);
    console.log(`- Threats Detected: ${this.threatCount}`);
    console.log(`- Actions Executed: ${this.actionCount}`);
    console.log(`- User Profiles: ${context.userProfiles.size}`);
    console.log(`- Known Threats: ${context.threatDatabase.knownPatterns.size}`);
    console.log(`- Action History: ${context.actionHistory.length}`);
    
    console.log('✅ Step 7 completed - Performance metrics displayed\n');
  }

  /**
   * Step 8: Integration workflow demonstration
   */
  private async demoIntegrationWorkflow(): Promise<void> {
    console.log('📋 Step 8: Complete Integration Workflow');
    console.log('========================================');
    
    console.log('\n🔄 Demonstrating complete workflow...');
    
    // Simulate a complete threat scenario
    console.log('🎭 Simulating complete threat scenario:');
    console.log('1. Suspicious transaction detected on Ethereum');
    console.log('2. AI analysis identifies phishing attempt');
    console.log('3. Cross-chain freeze executed via ZetaChain');
    console.log('4. User alerts sent via multiple channels');
    console.log('5. Learning module records experience');
    
    const completeScenario = this.createCompleteScenario();
    this.agent.addEvent(completeScenario);
    
    // Wait for complete processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n✅ Complete workflow demonstrated successfully');
    console.log('✅ Step 8 completed\n');
  }

  /**
   * Create simulated blockchain event
   */
  private createSimulatedEvent(chain: string, chainId: number, address: string): BlockchainEvent {
    return {
      type: 'transaction',
      chainId,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: address,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 1000000000000000000).toString(), // Random ETH value
      data: '0x',
      timestamp: Date.now(),
      metadata: {
        chainType: chain,
        gasPrice: '20000000000',
        nonce: Math.floor(Math.random() * 1000),
        blockNumber: Math.floor(Math.random() * 10000000)
      }
    };
  }

  /**
   * Create high-risk event for threat analysis
   */
  private createHighRiskEvent(threatType: string, address: string): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 1, // Ethereum
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: address,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 1000000000000000000000).toString(), // High value
      data: '0x' + '0'.repeat(1000), // Large data payload
      timestamp: Date.now(),
      metadata: {
        chainType: 'evm',
        threatIndicator: threatType,
        riskLevel: 'high'
      }
    };
  }

  /**
   * Create critical event requiring immediate action
   */
  private createCriticalEvent(actionType: string, address: string): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 137, // Polygon
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: address,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 10000000000000000000000).toString(), // Very high value
      data: '0x' + '0'.repeat(2000), // Very large data payload
      timestamp: Date.now(),
      metadata: {
        chainType: 'evm',
        actionRequired: actionType,
        priority: 'critical'
      }
    };
  }

  /**
   * Create cross-chain event
   */
  private createCrossChainEvent(chain: string, chainId: number, action: string): BlockchainEvent {
    return {
      type: 'transaction',
      chainId,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 100000000000000000000).toString(),
      data: '0x',
      timestamp: Date.now(),
      metadata: {
        chainType: chain,
        crossChainAction: action,
        requiresZetaChain: true
      }
    };
  }

  /**
   * Create learning event
   */
  private createLearningEvent(outcome: string, actionType: string): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 56, // BSC
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 1000000000000000000).toString(),
      data: '0x',
      timestamp: Date.now(),
      metadata: {
        chainType: 'evm',
        learningOutcome: outcome,
        actionType,
        forLearning: true
      }
    };
  }

  /**
   * Create complete threat scenario
   */
  private createCompleteScenario(): BlockchainEvent {
    return {
      type: 'transaction',
      chainId: 1, // Ethereum
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: '0x1234567890123456789012345678901234567890', // Known malicious address
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: '1000000000000000000000', // 1000 ETH
      data: '0x' + '0'.repeat(1500), // Large data payload
      timestamp: Date.now(),
      metadata: {
        chainType: 'evm',
        completeScenario: true,
        threatType: 'phishing',
        requiresFullResponse: true
      }
    };
  }

  /**
   * Get demo status
   */
  getDemoStatus(): any {
    return {
      isRunning: this.isRunning,
      demoStep: this.demoStep,
      eventCount: this.eventCount,
      threatCount: this.threatCount,
      actionCount: this.actionCount,
      agentStatus: this.agent.getStatus()
    };
  }

  /**
   * Stop the demo
   */
  async stopDemo(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('\n🛑 Stopping Aegis AI Agent Demo...');
    
    try {
      await this.agent.stop();
      this.isRunning = false;
      console.log('✅ Demo stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping demo:', error);
    }
  }

  /**
   * Get demo summary
   */
  getDemoSummary(): any {
    return {
      totalSteps: 8,
      completedSteps: this.demoStep,
      eventsProcessed: this.eventCount,
      threatsDetected: this.threatCount,
      actionsExecuted: this.actionCount,
      successRate: this.actionCount > 0 ? (this.actionCount / this.threatCount * 100).toFixed(1) + '%' : 'N/A',
      demoDuration: this.isRunning ? 'Running' : 'Completed',
      agentPerformance: this.agent.getStatus()
    };
  }
}

// Export the demo class
export default AegisAIAgentDemo;
