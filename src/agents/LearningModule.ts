import { EventEmitter } from "events";
import { ActionRecord, ThreatAnalysis, AegisAIAgent } from "./AegisAIAgent";

/**
 * Learning Module - AI Agent Self-Improvement
 * 
 * This module enables the AI agent to:
 * - Learn from action outcomes and feedback
 * - Adapt threat detection patterns
 * - Improve decision-making accuracy
 * - Maintain performance metrics
 */
export class LearningModule extends EventEmitter {
  private agent: AegisAIAgent;
  private isRunning: boolean = false;
  
  // Learning data structures
  private experienceReplay: ExperienceRecord[] = [];
  private performanceMetrics: PerformanceMetrics;
  private adaptationRules: AdaptationRule[] = [];
  private learningRate: number = 0.1;
  private maxExperienceSize: number = 1000;

  constructor(agent: AegisAIAgent) {
    super();
    this.agent = agent;
    this.performanceMetrics = this.initializePerformanceMetrics();
    this.initializeAdaptationRules();
  }

  /**
   * Initialize performance metrics
   */
  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      totalActions: 0,
      successfulActions: 0,
      failedActions: 0,
      threatDetectionAccuracy: 0.8, // Initial 80% accuracy
      falsePositiveRate: 0.2,
      falseNegativeRate: 0.1,
      averageResponseTime: 0,
      learningIterations: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * Initialize adaptation rules
   */
  private initializeAdaptationRules(): void {
    this.adaptationRules = [
      {
        id: 'high_false_positives',
        condition: (metrics: PerformanceMetrics) => metrics.falsePositiveRate > 0.3,
        action: 'increase_threshold',
        description: 'Increase threat detection threshold to reduce false positives'
      },
      {
        id: 'high_false_negatives',
        condition: (metrics: PerformanceMetrics) => metrics.falseNegativeRate > 0.2,
        action: 'decrease_threshold',
        description: 'Decrease threat detection threshold to reduce false negatives'
      },
      {
        id: 'low_accuracy',
        condition: (metrics: PerformanceMetrics) => metrics.threatDetectionAccuracy < 0.7,
        action: 'retrain_model',
        description: 'Retrain AI model due to low accuracy'
      },
      {
        id: 'slow_response',
        condition: (metrics: PerformanceMetrics) => metrics.averageResponseTime > 2000,
        action: 'optimize_pipeline',
        description: 'Optimize processing pipeline for faster response'
      }
    ];
  }

  /**
   * Start the learning module
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    console.log('🧠 Starting Learning Module...');

    try {
      // Start learning loop
      this.startLearningLoop();
      
      this.isRunning = true;
      console.log('✅ Learning Module started successfully');

    } catch (error) {
      console.error('❌ Failed to start Learning Module:', error);
      throw error;
    }
  }

  /**
   * Stop the learning module
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Learning Module...');
    this.isRunning = false;
    console.log('✅ Learning Module stopped successfully');
  }

  /**
   * Start the learning loop
   */
  private startLearningLoop(): void {
    const learningLoop = async () => {
      while (this.isRunning) {
        try {
          // Process experience replay
          if (this.experienceReplay.length > 0) {
            await this.processExperienceReplay();
          }

          // Check for adaptation triggers
          await this.checkAdaptationTriggers();

          // Update performance metrics
          this.updatePerformanceMetrics();

          // Wait before next iteration
          await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds

        } catch (error) {
          console.error('Error in learning loop:', error);
        }
      }
    };

    learningLoop().catch(error => {
      console.error('Error in learning loop:', error);
    });
  }

  /**
   * Process action outcomes and learn from them
   */
  async processOutcome(record: ActionRecord): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      console.log(`📚 Learning from action outcome: ${record.action.type}`);
      
      // Create experience record
      const experience: ExperienceRecord = {
        id: record.id,
        action: record.action,
        outcome: record.result,
        timestamp: record.timestamp,
        context: this.extractContext(record),
        feedback: this.generateFeedback(record)
      };

      // Add to experience replay
      this.addExperience(experience);

      // Update performance metrics
      this.updateMetricsFromOutcome(record);

      // Emit learning event
      this.emit('experience_recorded', experience);
      
      console.log(`✅ Experience recorded: ${record.action.type} -> ${record.result}`);

    } catch (error) {
      console.error('Error processing outcome:', error);
    }
  }

  /**
   * Add experience to replay buffer
   */
  private addExperience(experience: ExperienceRecord): void {
    this.experienceReplay.push(experience);
    
    // Maintain buffer size
    if (this.experienceReplay.length > this.maxExperienceSize) {
      this.experienceReplay.shift();
    }
  }

  /**
   * Extract context from action record
   */
  private extractContext(record: ActionRecord): any {
    return {
      actionType: record.action.type,
      targetChain: record.action.chainId,
      priority: record.action.priority,
      parameters: record.action.parameters,
      executionTime: Date.now() - record.timestamp
    };
  }

  /**
   * Generate feedback based on outcome
   */
  private generateFeedback(record: ActionRecord): Feedback {
    const feedback: Feedback = {
      effectiveness: 0,
      efficiency: 0,
      recommendations: []
    };

    // Assess effectiveness based on outcome
    switch (record.result) {
      case 'success':
        feedback.effectiveness = 1.0;
        feedback.efficiency = 0.9;
        feedback.recommendations.push('Action executed successfully');
        break;
      case 'failure':
        feedback.effectiveness = 0.0;
        feedback.efficiency = 0.1;
        feedback.recommendations.push('Investigate failure cause');
        feedback.recommendations.push('Consider alternative approaches');
        break;
      case 'pending':
        feedback.effectiveness = 0.5;
        feedback.efficiency = 0.7;
        feedback.recommendations.push('Monitor pending action');
        feedback.recommendations.push('Consider timeout handling');
        break;
    }

    // Add specific recommendations based on action type
    if (record.action.type === 'freeze_assets' && record.result === 'success') {
      feedback.recommendations.push('Asset freeze effective - consider duration optimization');
    }

    if (record.action.type === 'alert_user' && record.result === 'failure') {
      feedback.recommendations.push('Review alert delivery channels');
      feedback.recommendations.push('Check user notification preferences');
    }

    return feedback;
  }

  /**
   * Update performance metrics from action outcome
   */
  private updateMetricsFromOutcome(record: ActionRecord): void {
    this.performanceMetrics.totalActions++;
    
    if (record.result === 'success') {
      this.performanceMetrics.successfulActions++;
    } else if (record.result === 'failure') {
      this.performanceMetrics.failedActions++;
    }

    // Update success rate
    const successRate = this.performanceMetrics.successfulActions / this.performanceMetrics.totalActions;
    
    // Update threat detection accuracy (simplified)
    if (record.result === 'success') {
      this.performanceMetrics.threatDetectionAccuracy = 
        this.performanceMetrics.threatDetectionAccuracy * 0.9 + successRate * 0.1;
    }

    this.performanceMetrics.lastUpdated = Date.now();
  }

  /**
   * Process experience replay for learning
   */
  private async processExperienceReplay(): Promise<void> {
    try {
      console.log(`🔄 Processing ${this.experienceReplay.length} experiences...`);
      
      // Sample recent experiences for learning
      const recentExperiences = this.experienceReplay.slice(-100);
      
      // Analyze patterns
      const patterns = this.analyzePatterns(recentExperiences);
      
      // Apply learning
      await this.applyLearning(patterns);
      
      // Update learning iteration count
      this.performanceMetrics.learningIterations++;
      
      console.log(`✅ Experience replay processed, patterns: ${patterns.length}`);
      
    } catch (error) {
      console.error('Error processing experience replay:', error);
    }
  }

  /**
   * Analyze patterns in experience data
   */
  private analyzePatterns(experiences: ExperienceRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Group by action type
    const actionGroups = new Map<string, ExperienceRecord[]>();
    experiences.forEach(exp => {
      const key = exp.action.type;
      if (!actionGroups.has(key)) {
        actionGroups.set(key, []);
      }
      actionGroups.get(key)!.push(exp);
    });

    // Analyze each action type
    actionGroups.forEach((group, actionType) => {
      const successRate = group.filter(exp => exp.outcome === 'success').length / group.length;
      const avgExecutionTime = group.reduce((sum, exp) => sum + exp.context.executionTime, 0) / group.length;
      
      patterns.push({
        actionType,
        successRate,
        averageExecutionTime: avgExecutionTime,
        sampleSize: group.length,
        recommendations: this.generatePatternRecommendations(actionType, successRate, avgExecutionTime)
      });
    });

    return patterns;
  }

  /**
   * Generate recommendations based on pattern analysis
   */
  private generatePatternRecommendations(actionType: string, successRate: number, avgExecutionTime: number): string[] {
    const recommendations: string[] = [];
    
    if (successRate < 0.8) {
      recommendations.push(`Low success rate for ${actionType} - investigate causes`);
    }
    
    if (avgExecutionTime > 1000) {
      recommendations.push(`Slow execution for ${actionType} - optimize pipeline`);
    }
    
    if (successRate > 0.95 && avgExecutionTime < 500) {
      recommendations.push(`Excellent performance for ${actionType} - consider scaling`);
    }
    
    return recommendations;
  }

  /**
   * Apply learning from patterns
   */
  private async applyLearning(patterns: Pattern[]): Promise<void> {
    try {
      for (const pattern of patterns) {
        if (pattern.successRate < 0.7) {
          // Low success rate - need improvement
          await this.improveActionType(pattern.actionType, pattern);
        } else if (pattern.successRate > 0.9) {
          // High success rate - optimize further
          await this.optimizeActionType(pattern.actionType, pattern);
        }
      }
      
      // Emit learning completed event
      this.emit('learning_completed', { patterns, timestamp: Date.now() });
      
    } catch (error) {
      console.error('Error applying learning:', error);
    }
  }

  /**
   * Improve low-performing action types
   */
  private async improveActionType(actionType: string, pattern: Pattern): Promise<void> {
    console.log(`🔧 Improving ${actionType} (success rate: ${(pattern.successRate * 100).toFixed(1)}%)`);
    
    // Implement improvement strategies
    if (actionType === 'freeze_assets') {
      await this.improveFreezeAssets();
    } else if (actionType === 'alert_user') {
      await this.improveAlertUser();
    } else if (actionType === 'reverse_transaction') {
      await this.improveReverseTransaction();
    }
  }

  /**
   * Optimize high-performing action types
   */
  private async optimizeActionType(actionType: string, pattern: Pattern): Promise<void> {
    console.log(`⚡ Optimizing ${actionType} (success rate: ${(pattern.successRate * 100).toFixed(1)}%)`);
    
    // Implement optimization strategies
    if (actionType === 'monitor') {
      await this.optimizeMonitoring();
    }
  }

  /**
   * Improve freeze assets action
   */
  private async improveFreezeAssets(): Promise<void> {
    // Analyze failure patterns and adjust parameters
    const failures = this.experienceReplay
      .filter(exp => exp.action.type === 'freeze_assets' && exp.outcome === 'failure');
    
    if (failures.length > 0) {
      console.log(`🔍 Analyzing ${failures.length} freeze asset failures`);
      
      // Common failure reasons and improvements
      const improvements = [
        'Increase freeze duration for better effectiveness',
        'Add retry mechanism for failed freezes',
        'Implement fallback freeze strategies'
      ];
      
      improvements.forEach(improvement => {
        console.log(`💡 Improvement: ${improvement}`);
      });
    }
  }

  /**
   * Improve alert user action
   */
  private async improveAlertUser(): Promise<void> {
    const failures = this.experienceReplay
      .filter(exp => exp.action.type === 'alert_user' && exp.outcome === 'failure');
    
    if (failures.length > 0) {
      console.log(`🔍 Analyzing ${failures.length} alert user failures`);
      
      const improvements = [
        'Implement multiple notification channels',
        'Add retry logic for failed notifications',
        'Improve user contact information validation'
      ];
      
      improvements.forEach(improvement => {
        console.log(`💡 Improvement: ${improvement}`);
      });
    }
  }

  /**
   * Improve reverse transaction action
   */
  private async improveReverseTransaction(): Promise<void> {
    const failures = this.experienceReplay
      .filter(exp => exp.action.type === 'reverse_transaction' && exp.outcome === 'failure');
    
    if (failures.length > 0) {
      console.log(`🔍 Analyzing ${failures.length} reverse transaction failures`);
      
      const improvements = [
        'Implement transaction validation before reversal',
        'Add gas estimation for reversal transactions',
        'Implement partial reversal strategies'
      ];
      
      improvements.forEach(improvement => {
        console.log(`💡 Improvement: ${improvement}`);
      });
    }
  }

  /**
   * Optimize monitoring action
   */
  private async optimizeMonitoring(): Promise<void> {
    console.log('⚡ Optimizing monitoring performance');
    
    const optimizations = [
      'Reduce monitoring frequency for low-risk targets',
      'Implement adaptive monitoring intervals',
      'Add predictive monitoring triggers'
    ];
    
    optimizations.forEach(optimization => {
      console.log(`💡 Optimization: ${optimization}`);
    });
  }

  /**
   * Check for adaptation triggers
   */
  private async checkAdaptationTriggers(): Promise<void> {
    try {
      for (const rule of this.adaptationRules) {
        if (rule.condition(this.performanceMetrics)) {
          console.log(`🎯 Adaptation trigger: ${rule.description}`);
          await this.executeAdaptation(rule);
        }
      }
    } catch (error) {
      console.error('Error checking adaptation triggers:', error);
    }
  }

  /**
   * Execute adaptation based on rule
   */
  private async executeAdaptation(rule: AdaptationRule): Promise<void> {
    try {
      console.log(`🔄 Executing adaptation: ${rule.action}`);
      
      switch (rule.action) {
        case 'increase_threshold':
          await this.increaseDetectionThreshold();
          break;
        case 'decrease_threshold':
          await this.decreaseDetectionThreshold();
          break;
        case 'retrain_model':
          await this.retrainModel();
          break;
        case 'optimize_pipeline':
          await this.optimizePipeline();
          break;
      }
      
      // Emit adaptation event
      this.emit('adaptation_executed', { rule, timestamp: Date.now() });
      
    } catch (error) {
      console.error('Error executing adaptation:', error);
    }
  }

  /**
   * Increase threat detection threshold
   */
  private async increaseDetectionThreshold(): Promise<void> {
    console.log('📈 Increasing threat detection threshold');
    // Implementation would adjust AI model parameters
  }

  /**
   * Decrease threat detection threshold
   */
  private async decreaseDetectionThreshold(): Promise<void> {
    console.log('📉 Decreasing threat detection threshold');
    // Implementation would adjust AI model parameters
  }

  /**
   * Retrain AI model
   */
  private async retrainModel(): Promise<void> {
    console.log('🔄 Retraining AI model');
    // Implementation would trigger model retraining
  }

  /**
   * Optimize processing pipeline
   */
  private async optimizePipeline(): Promise<void> {
    console.log('⚡ Optimizing processing pipeline');
    // Implementation would optimize data flow and processing
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    // Calculate average response time
    const recentActions = this.experienceReplay.slice(-100);
    if (recentActions.length > 0) {
      const totalTime = recentActions.reduce((sum, exp) => sum + exp.context.executionTime, 0);
      this.performanceMetrics.averageResponseTime = totalTime / recentActions.length;
    }
  }

  /**
   * Get learning module status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      experienceReplaySize: this.experienceReplay.length,
      performanceMetrics: this.performanceMetrics,
      adaptationRulesCount: this.adaptationRules.length,
      learningRate: this.learningRate
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get experience replay data
   */
  getExperienceReplay(): ExperienceRecord[] {
    return [...this.experienceReplay];
  }

  /**
   * Clear experience replay
   */
  clearExperienceReplay(): void {
    this.experienceReplay = [];
    console.log('🗑️ Experience replay cleared');
  }

  /**
   * Export learning data
   */
  exportLearningData(): any {
    return {
      performanceMetrics: this.performanceMetrics,
      experienceReplay: this.experienceReplay,
      adaptationRules: this.adaptationRules,
      exportTimestamp: Date.now()
    };
  }
}

// Additional interfaces for the learning module
interface ExperienceRecord {
  id: string;
  action: any;
  outcome: string;
  timestamp: number;
  context: any;
  feedback: Feedback;
}

interface Feedback {
  effectiveness: number;
  efficiency: number;
  recommendations: string[];
}

interface Pattern {
  actionType: string;
  successRate: number;
  averageExecutionTime: number;
  sampleSize: number;
  recommendations: string[];
}

interface AdaptationRule {
  id: string;
  condition: (metrics: PerformanceMetrics) => boolean;
  action: string;
  description: string;
}

interface PerformanceMetrics {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  threatDetectionAccuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  averageResponseTime: number;
  learningIterations: number;
  lastUpdated: number;
}
