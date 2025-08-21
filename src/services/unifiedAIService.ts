import { geminiService } from './geminiService';
import { openaiService } from './openaiService';

export interface UnifiedAIResponse {
  generatedText: string;
  success: boolean;
  provider: 'gemini' | 'openai' | 'fallback';
  error?: string;
}

export interface UnifiedCreditScoreResponse {
  creditScore: number;
  riskLevel: string;
  factors: string[];
  recommendations: string[];
  provider: 'gemini' | 'openai' | 'fallback';
}

class UnifiedAIService {
  async generateContent(prompt: string, maxTokens?: number): Promise<UnifiedAIResponse> {
    try {
      // Try Gemini first
      const geminiResponse = await geminiService.generateContent({
        prompt,
        maxTokens: maxTokens || 1000
      });

      if (geminiResponse.success && geminiResponse.generatedText) {
        return {
          generatedText: geminiResponse.generatedText,
          success: true,
          provider: 'gemini'
        };
      }
    } catch (error) {
      console.log('Gemini failed, trying OpenAI...');
    }

    try {
      // Fallback to OpenAI
      const openaiResponse = await openaiService.generateContent({
        prompt,
        maxTokens: maxTokens || 1000
      });

      if (openaiResponse.success) {
        return {
          generatedText: openaiResponse.generatedText,
          success: true,
          provider: 'openai'
        };
      }
    } catch (error) {
      console.log('OpenAI also failed');
    }

    // Final fallback
    return {
      generatedText: 'AI service temporarily unavailable. Please try again later.',
      success: false,
      provider: 'fallback',
      error: 'Both Gemini and OpenAI services failed'
    };
  }

  async getCreditScore(transactionHistory: any[], portfolioData?: any, userProfile?: any): Promise<UnifiedCreditScoreResponse> {
    try {
      // Try Gemini first
      const geminiResponse = await geminiService.getCreditScore(transactionHistory);
      
      if (geminiResponse.creditScore > 0) {
        return {
          ...geminiResponse,
          provider: 'gemini'
        };
      }
    } catch (error) {
      console.log('Gemini credit score failed, trying OpenAI...');
    }

    try {
      // Fallback to OpenAI
      const openaiResponse = await openaiService.getCreditScore({
        transactionHistory,
        portfolioData,
        userProfile
      });

      return {
        ...openaiResponse,
        provider: 'openai'
      };
    } catch (error) {
      console.log('OpenAI credit score also failed');
    }

    // Final fallback
    return {
      creditScore: 650,
      riskLevel: 'Medium',
      factors: ['AI analysis unavailable'],
      recommendations: ['Please try again later or contact support'],
      provider: 'fallback'
    };
  }

  async generateRiskAssessment(portfolioData: any): Promise<string> {
    try {
      // Try Gemini first
      const geminiResponse = await geminiService.generateRiskAssessment(portfolioData);
      if (geminiResponse && geminiResponse.length > 0) {
        return geminiResponse;
      }
    } catch (error) {
      console.log('Gemini risk assessment failed, trying OpenAI...');
    }

    try {
      // Fallback to OpenAI
      return await openaiService.generateRiskAssessment(portfolioData);
    } catch (error) {
      console.log('OpenAI risk assessment also failed');
    }

    // Final fallback
    return 'Risk assessment temporarily unavailable. Please try again later.';
  }

  async generateMarketInsights(): Promise<string> {
    try {
      // Try Gemini first
      const geminiResponse = await geminiService.generateMarketInsights();
      if (geminiResponse && geminiResponse.length > 0) {
        return geminiResponse;
      }
    } catch (error) {
      console.log('Gemini market insights failed, trying OpenAI...');
    }

    try {
      // Fallback to OpenAI
      return await openaiService.generateMarketInsights();
    } catch (error) {
      console.log('OpenAI market insights also failed');
    }

    // Final fallback
    return 'Market insights temporarily unavailable. Please try again later.';
  }

  async generatePortfolioRecommendations(portfolioData: any): Promise<string> {
    try {
      // Try Gemini first
      const geminiResponse = await geminiService.generatePortfolioRecommendations(portfolioData);
      if (geminiResponse && geminiResponse.length > 0) {
        return geminiResponse;
      }
    } catch (error) {
      console.log('Gemini portfolio recommendations failed, trying OpenAI...');
    }

    try {
      // Fallback to OpenAI
      return await openaiService.generatePortfolioRecommendations(portfolioData);
    } catch (error) {
      console.log('OpenAI portfolio recommendations also failed');
    }

    // Final fallback
    return 'Portfolio recommendations temporarily unavailable. Please try again later.';
  }

  async chatWithAI(message: string, context?: string): Promise<UnifiedAIResponse> {
    const prompt = context ? `${context}\n\nUser: ${message}` : message;
    return this.generateContent(prompt, 1000);
  }
}

export const unifiedAIService = new UnifiedAIService();
export default unifiedAIService;
