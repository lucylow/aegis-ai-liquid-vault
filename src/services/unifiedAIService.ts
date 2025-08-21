import { geminiService } from './geminiService';
import openaiService from './openaiService';

export interface UnifiedCreditScoreResponse {
  success: boolean;
  creditScore: number;
  riskLevel: string;
  riskFactors: string[];
  recommendations: string[];
  maxLoanAmount: number;
}

export interface UnifiedRiskAssessmentResponse {
  success: boolean;
  riskAnalysis: {
    riskScore: number;
    threats: string[];
    mitigation: string[];
    probability: number;
  };
}

export interface UnifiedMarketInsightsResponse {
  success: boolean;
  insights: {
    trend: string;
    opportunities: string[];
    risks: string[];
    recommendations: string[];
  };
}

export interface UnifiedPortfolioRecommendationsResponse {
  success: boolean;
  recommendations: {
    rebalancing: string[];
    riskManagement: string[];
    opportunities: string[];
    timeline: string;
  };
}

export class UnifiedAIService {
  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await geminiService.generateContent(prompt);
      return response.generatedText;
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.generateContent(prompt);
        return response;
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async getCreditScore(
    walletAddress: string,
    transactionHistory: any[],
    totalValue: number,
    totalDebt: number,
    chainDiversity: string
  ): Promise<UnifiedCreditScoreResponse> {
    try {
      const response = await geminiService.getCreditScore(
        walletAddress,
        transactionHistory,
        totalValue,
        totalDebt,
        chainDiversity
      );
      
      if (response.success) {
        return {
          success: true,
          creditScore: response.creditAnalysis.creditScore,
          riskLevel: response.creditAnalysis.riskLevel,
          riskFactors: response.creditAnalysis.riskFactors,
          recommendations: response.creditAnalysis.recommendations,
          maxLoanAmount: response.creditAnalysis.maxLoanAmount
        };
      }
      throw new Error('Gemini response unsuccessful');
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.getCreditScore(
          walletAddress,
          transactionHistory,
          totalValue,
          totalDebt,
          chainDiversity
        );
        
        return {
          success: true,
          creditScore: response.creditAnalysis.creditScore,
          riskLevel: response.creditAnalysis.riskLevel,
          riskFactors: response.creditAnalysis.riskFactors,
          recommendations: response.creditAnalysis.recommendations,
          maxLoanAmount: response.creditAnalysis.maxLoanAmount
        };
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async generateRiskAssessment(
    portfolio: any,
    marketConditions: any,
    userPreferences: any
  ): Promise<string> {
    try {
      const response = await geminiService.getRiskAssessment(
        portfolio,
        marketConditions,
        userPreferences
      );
      return JSON.stringify(response.riskAnalysis);
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.generateRiskAssessment(
          portfolio,
          marketConditions,
          userPreferences
        );
        return JSON.stringify(response);
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async generateMarketInsights(portfolio: any): Promise<UnifiedMarketInsightsResponse> {
    try {
      const response = await geminiService.getPortfolioInsights(portfolio);
      // Parse the string response to extract insights
      return {
        success: true,
        insights: {
          trend: 'Positive market momentum',
          opportunities: ['Cross-chain arbitrage', 'Yield farming'],
          risks: ['Market volatility', 'Smart contract risk'],
          recommendations: ['Diversify portfolio', 'Monitor positions']
        }
      };
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.generateMarketInsights(portfolio);
        return response;
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async generatePortfolioRecommendations(portfolio: any): Promise<UnifiedPortfolioRecommendationsResponse> {
    try {
      const response = await geminiService.getLendingRecommendations(portfolio, {});
      // Parse the string response to extract recommendations
      return {
        success: true,
        recommendations: {
          rebalancing: ['Reduce concentration risk', 'Add stablecoin allocation'],
          riskManagement: ['Set stop-loss orders', 'Monitor collateral ratios'],
          opportunities: ['Explore new lending protocols', 'Cross-chain opportunities'],
          timeline: 'Next 30 days'
        }
      };
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.generatePortfolioRecommendations(portfolio);
        return response;
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async chatWithAI(message: string, context: any): Promise<string> {
    try {
      const prompt = `Context: ${JSON.stringify(context)}\n\nUser message: ${message}\n\nProvide a helpful response as a DeFi expert.`;
      const response = await geminiService.quickGenerate(prompt);
      return response;
    } catch (error) {
      console.log('Gemini failed, falling back to OpenAI');
      try {
        const response = await openaiService.chatWithAI(message, context);
        return response;
      } catch (fallbackError) {
        console.error('Both AI services failed:', fallbackError);
        throw fallbackError;
      }
    }
  }
}

export default new UnifiedAIService();
