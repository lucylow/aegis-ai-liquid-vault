import { GoogleGenerativeAI } from "@google/generative-ai";
import { ethers } from "ethers";
import { CONFIG } from "../../contracts/config";

export interface SecurityIntent {
  action: 'FREEZE' | 'MOVE_TO_SAFE' | 'ALERT' | 'LIQUIDATE' | 'CUSTOM';
  target: 'ASSET' | 'CONTRACT' | 'WALLET' | 'POSITION';
  conditions: {
    chain?: string;
    contract?: string;
    valueThreshold?: number;
    timeWindow?: number;
    healthFactor?: number;
    volatilityThreshold?: number;
    customCondition?: string;
  };
  parameters: {
    asset?: string;
    destination?: string;
    amount?: number;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    [key: string]: any;
  };
  confidence: number; // 0-1
  naturalLanguage: string; // Original user input
}

export interface ParsedRule {
  ruleId: string;
  intent: SecurityIntent;
  solidityCondition: string;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface VoiceCommand {
  audioBlob: Blob;
  userId: string;
  timestamp: Date;
}

export class IntentBasedProtection {
  private genAI: GoogleGenerativeAI;
  private parsedRules: Map<string, ParsedRule> = new Map();
  private ruleCounter: number = 0;

  constructor() {
    this.genAI = new GoogleGenerativeAI(CONFIG.ZETA_API_KEY);
  }

  /**
   * Process natural language security command
   */
  async processNaturalLanguageCommand(userInput: string): Promise<SecurityIntent> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = this.buildIntentParsingPrompt(userInput);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const intent = this.parseIntentResponse(text, userInput);
      return intent;
    } catch (error) {
      console.error('Error processing natural language command:', error);
      throw new Error('Failed to process security command');
    }
  }

  /**
   * Process voice command (converts speech to text first)
   */
  async processVoiceCommand(audioBlob: Blob): Promise<SecurityIntent> {
    try {
      // Convert speech to text using Gemini
      const text = await this.speechToText(audioBlob);
      
      // Process the text command
      return await this.processNaturalLanguageCommand(text);
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw new Error('Failed to process voice command');
    }
  }

  /**
   * Generate Solidity condition from natural language
   */
  async generateSolidityCondition(nlCondition: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
Convert this natural language security condition into Solidity require statement:

Input: "${nlCondition}"

Examples:
- "if balance drops below 0.5 ETH" → "require(address(this).balance >= 0.5 ether, 'Balance low');"
- "if health factor below 1.1" → "require(healthFactor >= 1100, 'Health factor too low');"
- "if more than 3 transactions in 5 minutes" → "require(transactionCount <= 3, 'Too many transactions');"

Focus on:
1. Proper Solidity syntax
2. Security best practices
3. Clear error messages
4. Gas efficiency

Output only the Solidity require statement.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating Solidity condition:', error);
      return 'require(true, "Default safe condition");';
    }
  }

  /**
   * Create a complete security rule from intent
   */
  async createSecurityRule(intent: SecurityIntent): Promise<ParsedRule> {
    try {
      // Generate Solidity condition from the intent
      const conditionText = this.buildConditionText(intent);
      const solidityCondition = await this.generateSolidityCondition(conditionText);
      
      // Create rule
      const rule: ParsedRule = {
        ruleId: `rule_${++this.ruleCounter}`,
        intent,
        solidityCondition,
        isActive: true,
        createdAt: new Date(),
        triggerCount: 0
      };
      
      // Store rule
      this.parsedRules.set(rule.ruleId, rule);
      
      return rule;
    } catch (error) {
      console.error('Error creating security rule:', error);
      throw new Error('Failed to create security rule');
    }
  }

  /**
   * Execute a security rule based on current conditions
   */
  async executeSecurityRule(ruleId: string, currentContext: any): Promise<boolean> {
    const rule = this.parsedRules.get(ruleId);
    if (!rule || !rule.isActive) {
      return false;
    }

    try {
      // Evaluate conditions
      const shouldExecute = await this.evaluateConditions(rule.intent, currentContext);
      
      if (shouldExecute) {
        // Execute the action
        const success = await this.executeAction(rule.intent, currentContext);
        
        if (success) {
          // Update rule stats
          rule.lastTriggered = new Date();
          rule.triggerCount++;
          
          console.log(`✅ Security rule ${ruleId} executed successfully`);
        }
        
        return success;
      }
      
      return false;
    } catch (error) {
      console.error(`Error executing security rule ${ruleId}:`, error);
      return false;
    }
  }

  /**
   * Get all rules for a user
   */
  getUserRules(userId: string): ParsedRule[] {
    return Array.from(this.parsedRules.values()).filter(rule => 
      rule.intent.parameters.userId === userId
    );
  }

  /**
   * Toggle rule activation
   */
  toggleRule(ruleId: string): boolean {
    const rule = this.parsedRules.get(ruleId);
    if (rule) {
      rule.isActive = !rule.isActive;
      return rule.isActive;
    }
    return false;
  }

  /**
   * Delete a rule
   */
  deleteRule(ruleId: string): boolean {
    return this.parsedRules.delete(ruleId);
  }

  // ==================== PRIVATE METHODS ====================

  private buildIntentParsingPrompt(userInput: string): string {
    return `Analyze this security command and convert it to structured format:

User Command: "${userInput}"

Context: This is for a cross-chain DeFi security protocol that can:
- Freeze assets on any blockchain
- Move assets to safe addresses
- Send alerts for suspicious activity
- Liquidate risky positions
- Execute custom security rules

Convert to this exact JSON format:
{
  "action": "FREEZE|MOVE_TO_SAFE|ALERT|LIQUIDATE|CUSTOM",
  "target": "ASSET|CONTRACT|WALLET|POSITION",
  "conditions": {
    "chain": "string (optional)",
    "contract": "hex address (optional)",
    "valueThreshold": "number (optional)",
    "timeWindow": "number in minutes (optional)",
    "healthFactor": "number (optional)",
    "volatilityThreshold": "number (optional)",
    "customCondition": "string (optional)"
  },
  "parameters": {
    "asset": "string (optional)",
    "destination": "string (optional)",
    "amount": "number (optional)",
    "priority": "LOW|MEDIUM|HIGH|CRITICAL"
  },
  "confidence": "number 0.0-1.0"
}

Examples:
- "Freeze my ETH if it drops below $2000" → FREEZE action with valueThreshold
- "Move BTC to cold storage if health factor below 1.1" → MOVE_TO_SAFE with healthFactor
- "Alert me about any transaction over $10000" → ALERT with valueThreshold

Return only valid JSON.`;
  }

  private parseIntentResponse(response: string, originalInput: string): SecurityIntent {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and create intent
      const intent: SecurityIntent = {
        action: this.validateAction(parsed.action),
        target: this.validateTarget(parsed.target),
        conditions: {
          chain: parsed.conditions?.chain,
          contract: parsed.conditions?.contract,
          valueThreshold: parsed.conditions?.valueThreshold,
          timeWindow: parsed.conditions?.timeWindow,
          healthFactor: parsed.conditions?.healthFactor,
          volatilityThreshold: parsed.conditions?.volatilityThreshold,
          customCondition: parsed.conditions?.customCondition
        },
        parameters: {
          asset: parsed.parameters?.asset,
          destination: parsed.parameters?.destination,
          amount: parsed.parameters?.amount,
          priority: this.validatePriority(parsed.parameters?.priority)
        },
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
        naturalLanguage: originalInput
      };
      
      return intent;
    } catch (error) {
      console.error('Failed to parse intent response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  private validateAction(action: string): SecurityIntent['action'] {
    const validActions = ['FREEZE', 'MOVE_TO_SAFE', 'ALERT', 'LIQUIDATE', 'CUSTOM'];
    return validActions.includes(action) ? action as any : 'ALERT';
  }

  private validateTarget(target: string): SecurityIntent['target'] {
    const validTargets = ['ASSET', 'CONTRACT', 'WALLET', 'POSITION'];
    return validTargets.includes(target) ? target as any : 'ASSET';
  }

  private validatePriority(priority: string): SecurityIntent['parameters']['priority'] {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return validPriorities.includes(priority) ? priority as any : 'MEDIUM';
  }

  private buildConditionText(intent: SecurityIntent): string {
    const conditions: string[] = [];
    
    if (intent.conditions.chain) {
      conditions.push(`on ${intent.conditions.chain} chain`);
    }
    
    if (intent.conditions.valueThreshold) {
      conditions.push(`if value exceeds $${intent.conditions.valueThreshold}`);
    }
    
    if (intent.conditions.healthFactor) {
      conditions.push(`if health factor drops below ${intent.conditions.healthFactor}`);
    }
    
    if (intent.conditions.timeWindow) {
      conditions.push(`within ${intent.conditions.timeWindow} minutes`);
    }
    
    if (intent.conditions.volatilityThreshold) {
      conditions.push(`if volatility exceeds ${intent.conditions.volatilityThreshold}%`);
    }
    
    if (intent.conditions.customCondition) {
      conditions.push(intent.conditions.customCondition);
    }
    
    return conditions.join(' and ');
  }

  private async evaluateConditions(intent: SecurityIntent, context: any): Promise<boolean> {
    try {
      // This would integrate with real-time blockchain data
      // For now, return true for demo purposes
      
      if (intent.conditions.valueThreshold && context.value) {
        return context.value >= intent.conditions.valueThreshold;
      }
      
      if (intent.conditions.healthFactor && context.healthFactor) {
        return context.healthFactor <= intent.conditions.healthFactor;
      }
      
      if (intent.conditions.timeWindow && context.timestamp) {
        const timeDiff = Date.now() - context.timestamp;
        return timeDiff <= intent.conditions.timeWindow * 60 * 1000;
      }
      
      // Default to true for demo
      return true;
    } catch (error) {
      console.error('Error evaluating conditions:', error);
      return false;
    }
  }

  private async executeAction(intent: SecurityIntent, context: any): Promise<boolean> {
    try {
      switch (intent.action) {
        case 'FREEZE':
          return await this.executeFreeze(intent, context);
        
        case 'MOVE_TO_SAFE':
          return await this.executeMoveToSafe(intent, context);
        
        case 'ALERT':
          return await this.executeAlert(intent, context);
        
        case 'LIQUIDATE':
          return await this.executeLiquidation(intent, context);
        
        case 'CUSTOM':
          return await this.executeCustomAction(intent, context);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error executing action:', error);
      return false;
    }
  }

  private async executeFreeze(intent: SecurityIntent, context: any): Promise<boolean> {
    console.log(`🛡️ Executing FREEZE action for ${intent.target}`);
    // TODO: Integrate with Universal Security Layer contract
    return true;
  }

  private async executeMoveToSafe(intent: SecurityIntent, context: any): Promise<boolean> {
    console.log(`🚚 Executing MOVE_TO_SAFE action to ${intent.parameters.destination}`);
    // TODO: Integrate with Universal Security Layer contract
    return true;
  }

  private async executeAlert(intent: SecurityIntent, context: any): Promise<boolean> {
    console.log(`🚨 Executing ALERT action: ${intent.naturalLanguage}`);
    
    // Emit custom event for frontend
    const event = new CustomEvent('security-alert', {
      detail: {
        intent,
        context,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
    
    return true;
  }

  private async executeLiquidation(intent: SecurityIntent, context: any): Promise<boolean> {
    console.log(`💥 Executing LIQUIDATION action`);
    // TODO: Integrate with lending protocol liquidation
    return true;
  }

  private async executeCustomAction(intent: SecurityIntent, context: any): Promise<boolean> {
    console.log(`⚙️ Executing CUSTOM action: ${intent.conditions.customCondition}`);
    // TODO: Execute custom logic
    return true;
  }

  private async speechToText(audioBlob: Blob): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Convert audio to base64 (simplified - in production you'd use proper audio processing)
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const prompt = `
Convert this audio input to text. The audio contains a security command for a DeFi protocol.

Audio data: ${base64Audio}

Return only the transcribed text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error converting speech to text:', error);
      throw new Error('Failed to convert speech to text');
    }
  }
}

// Export singleton instance
export const intentBasedProtection = new IntentBasedProtection();
