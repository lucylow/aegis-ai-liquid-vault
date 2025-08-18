import { GoogleGenerativeAI } from "@google/generative-ai";
import { ethers } from "ethers";
import { CONFIG } from "../../contracts/config";

export interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  chainId: number;
  gasPrice: string;
  nonce: number;
  timestamp: number;
}

export interface ThreatAssessment {
  isMalicious: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  threatType: string[];
  recommendations: string[];
  riskScore: number; // 0-100
}

export interface ChainProvider {
  name: string;
  provider: ethers.providers.JsonRpcProvider;
  chainId: number;
}

export class ThreatPredictionService {
  private genAI: GoogleGenerativeAI;
  private providers: Map<string, ChainProvider>;
  private isMonitoring: boolean = false;
  private threatHistory: Map<string, ThreatAssessment> = new Map();
  private userRiskProfiles: Map<string, number> = new Map();

  constructor() {
    this.genAI = new GoogleGenerativeAI(CONFIG.ZETA_API_KEY);
    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize providers for multiple chains
    const providerConfigs = [
      { name: 'zeta_testnet', url: CONFIG.RPC_URLS.ZETA_TESTNET, chainId: CONFIG.CHAIN_IDS.ZETA_TESTNET },
      { name: 'zeta_mainnet', url: CONFIG.RPC_URLS.ZETA_MAINNET, chainId: CONFIG.CHAIN_IDS.ZETA_MAINNET },
      { name: 'bsc_testnet', url: CONFIG.RPC_URLS.BSC_TESTNET, chainId: CONFIG.CHAIN_IDS.BSC_TESTNET },
      { name: 'polygon_testnet', url: CONFIG.RPC_URLS.POLYGON_TESTNET, chainId: CONFIG.CHAIN_IDS.POLYGON_TESTNET }
    ];

    providerConfigs.forEach(config => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(config.url);
        this.providers.set(config.name, {
          name: config.name,
          provider,
          chainId: config.chainId
        });
        console.log(`✅ Provider initialized for ${config.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize provider for ${config.name}:`, error);
      }
    });
  }

  /**
   * Analyze a transaction using Gemini 2.5 for threat prediction
   */
  async analyzeTransaction(tx: TransactionData): Promise<ThreatAssessment> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Build comprehensive analysis prompt
      const prompt = this.buildAnalysisPrompt(tx);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse AI response
      const assessment = this.parseAIResponse(text, tx);
      
      // Store assessment in history
      this.threatHistory.set(tx.hash, assessment);
      
      // Update user risk profile
      this.updateUserRiskProfile(tx.from, assessment.riskScore);
      
      return assessment;
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      // Return default safe assessment on error
      return {
        isMalicious: false,
        riskLevel: 'LOW',
        confidence: 0.5,
        threatType: [],
        recommendations: ['Unable to analyze - defaulting to safe'],
        riskScore: 10
      };
    }
  }

  private buildAnalysisPrompt(tx: TransactionData): string {
    const userRiskProfile = this.userRiskProfiles.get(tx.from) || 50;
    
    return `Analyze this blockchain transaction for security threats:

Transaction Details:
- Hash: ${tx.hash}
- From: ${tx.from}
- To: ${tx.to}
- Value: ${ethers.utils.formatEther(tx.value)} ETH
- Chain ID: ${tx.chainId}
- Gas Price: ${ethers.utils.formatUnits(tx.gasPrice, 'gwei')} gwei
- Data Length: ${tx.data.length} bytes
- User Risk Profile: ${userRiskProfile}/100

Context:
- This is a cross-chain lending protocol transaction
- User has risk profile score: ${userRiskProfile}/100
- Analyze for: smart contract vulnerabilities, suspicious patterns, known attack vectors

Provide analysis in this exact JSON format:
{
  "isMalicious": boolean,
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "confidence": number (0.0-1.0),
  "threatType": ["string array of threat types"],
  "recommendations": ["string array of actions"],
  "riskScore": number (0-100)
}

Focus on:
1. Contract interaction safety
2. Value transfer patterns
3. Gas price manipulation
4. Known malicious addresses
5. Cross-chain attack vectors

Return only valid JSON.`;
  }

  private parseAIResponse(response: string, tx: TransactionData): ThreatAssessment {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize response
      return {
        isMalicious: Boolean(parsed.isMalicious),
        riskLevel: this.validateRiskLevel(parsed.riskLevel),
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
        threatType: Array.isArray(parsed.threatType) ? parsed.threatType : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        riskScore: Math.max(0, Math.min(100, Number(parsed.riskScore) || 50))
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        isMalicious: false,
        riskLevel: 'LOW',
        confidence: 0.5,
        threatType: ['Parse Error'],
        recommendations: ['Default safe assessment'],
        riskScore: 20
      };
    }
  }

  private validateRiskLevel(level: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const validLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return validLevels.includes(level) ? level as any : 'LOW';
  }

  private updateUserRiskProfile(userAddress: string, riskScore: number): void {
    const currentProfile = this.userRiskProfiles.get(userAddress) || 50;
    // Weighted average: 70% current, 30% new
    const newProfile = Math.round(currentProfile * 0.7 + riskScore * 0.3);
    this.userRiskProfiles.set(userAddress, newProfile);
  }

  /**
   * Start monitoring pending transactions across all chains
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log('Monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('🚀 Starting threat monitoring across all chains...');

    this.providers.forEach((chainProvider, name) => {
      this.monitorChain(chainProvider, name);
    });
  }

  private monitorChain(chainProvider: ChainProvider, chainName: string): void {
    const provider = chainProvider.provider;
    
    // Monitor pending transactions
    provider.on("pending", async (txHash: string) => {
      try {
        const tx = await provider.getTransaction(txHash);
        if (tx && tx.to) {
          const txData: TransactionData = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
            data: tx.data,
            chainId: chainProvider.chainId,
            gasPrice: tx.gasPrice?.toString() || '0',
            nonce: tx.nonce,
            timestamp: Date.now()
          };

          // Analyze transaction
          const assessment = await this.analyzeTransaction(txData);
          
          if (assessment.isMalicious || assessment.riskLevel === 'CRITICAL') {
            console.log(`🚨 THREAT DETECTED on ${chainName}:`, {
              hash: txHash,
              risk: assessment.riskLevel,
              score: assessment.riskScore,
              threats: assessment.threatType
            });
            
            // Trigger protection
            await this.triggerProtection(txData, assessment);
          }
        }
      } catch (error) {
        console.error(`Error monitoring ${chainName}:`, error);
      }
    });

    console.log(`✅ Monitoring active for ${chainName}`);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    
    this.providers.forEach((chainProvider) => {
      chainProvider.provider.removeAllListeners();
    });
    
    console.log('🛑 Threat monitoring stopped');
  }

  /**
   * Trigger protection when threat is detected
   */
  private async triggerProtection(tx: TransactionData, assessment: ThreatAssessment): Promise<void> {
    try {
      console.log(`🛡️ Triggering protection for transaction ${tx.hash}`);
      
      // Emit event for frontend
      const event = new CustomEvent('threat-detected', {
        detail: {
          transaction: tx,
          assessment,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
      
      // TODO: Integrate with Universal Security Layer contract
      // await this.callProtectionContract(tx, assessment);
      
    } catch (error) {
      console.error('Error triggering protection:', error);
    }
  }

  /**
   * Get threat history for a specific address
   */
  getThreatHistory(address: string): ThreatAssessment[] {
    const history: ThreatAssessment[] = [];
    
    this.threatHistory.forEach((assessment, hash) => {
      // This would need to be enhanced to track address-specific threats
      // For now, return all threats
      history.push(assessment);
    });
    
    return history;
  }

  /**
   * Get user risk profile
   */
  getUserRiskProfile(address: string): number {
    return this.userRiskProfiles.get(address) || 50;
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus(): boolean {
    return this.isMonitoring;
  }
}

// Export singleton instance
export const threatPredictionService = new ThreatPredictionService();
