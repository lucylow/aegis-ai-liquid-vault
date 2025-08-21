import axios from 'axios';

// OpenAI API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIGenerateRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface OpenAICreditScoreRequest {
  transactionHistory: any[];
  portfolioData?: any;
  userProfile?: any;
}

export interface OpenAICreditScoreResponse {
  creditScore: number;
  riskLevel: string;
  factors: string[];
  recommendations: string[];
}

export interface OpenAIContentGenerationRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface OpenAIContentGenerationResponse {
  generatedText: string;
  success: boolean;
  error?: string;
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseURL = OPENAI_API_URL;
  }

  private async makeRequest(prompt: string, systemPrompt?: string, maxTokens: number = 1000): Promise<string> {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt || 'You are a helpful AI assistant specializing in DeFi, blockchain, and financial analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data: OpenAIResponse = response.data;
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate content with OpenAI');
    }
  }

  async generateContent(request: OpenAIContentGenerationRequest): Promise<OpenAIContentGenerationResponse> {
    try {
      const systemPrompt = `You are an expert AI assistant specializing in DeFi, cross-chain lending, and blockchain technology. 
      Provide helpful, accurate, and engaging responses. Keep responses concise but informative.`;
      
      const generatedText = await this.makeRequest(
        request.prompt,
        systemPrompt,
        request.maxTokens || 1000
      );

      return {
        generatedText,
        success: true
      };
    } catch (error) {
      return {
        generatedText: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCreditScore(request: OpenAICreditScoreRequest): Promise<OpenAICreditScoreResponse> {
    try {
      const prompt = `Analyze the following user data and provide a credit score assessment:
      
Transaction History: ${JSON.stringify(request.transactionHistory)}
Portfolio Data: ${JSON.stringify(request.portfolioData || {})}
User Profile: ${JSON.stringify(request.userProfile || {})}

Please provide:
1. A credit score from 300-850
2. Risk level (Low, Medium, High)
3. Key factors affecting the score
4. Specific recommendations for improvement

Format the response as JSON with keys: creditScore, riskLevel, factors, recommendations`;

      const systemPrompt = `You are a financial AI expert specializing in DeFi credit scoring. 
      Analyze user data and provide accurate credit assessments. 
      Always respond with valid JSON format.`;

      const response = await this.makeRequest(prompt, systemPrompt, 1500);
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(response);
        return {
          creditScore: parsed.creditScore || 650,
          riskLevel: parsed.riskLevel || 'Medium',
          factors: parsed.factors || ['Limited transaction history'],
          recommendations: parsed.recommendations || ['Build more transaction history']
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          creditScore: 650,
          riskLevel: 'Medium',
          factors: ['AI analysis completed'],
          recommendations: ['Continue building DeFi portfolio']
        };
      }
    } catch (error) {
      // Return default values if OpenAI fails
      return {
        creditScore: 650,
        riskLevel: 'Medium',
        factors: ['Analysis unavailable'],
        recommendations: ['Contact support for detailed analysis']
      };
    }
  }

  async generateRiskAssessment(portfolioData: any): Promise<string> {
    try {
      const prompt = `Analyze this DeFi portfolio for risk assessment:
      
Portfolio Data: ${JSON.stringify(portfolioData)}

Provide a concise risk assessment including:
- Overall risk level
- Key risk factors
- Recommendations for risk management
- Market conditions impact

Keep the response under 200 words.`;

      const systemPrompt = `You are a DeFi risk management expert. 
      Provide clear, actionable risk assessments. 
      Focus on practical recommendations.`;

      return await this.makeRequest(prompt, systemPrompt, 500);
    } catch (error) {
      return 'Risk assessment unavailable. Please try again later.';
    }
  }

  async generateMarketInsights(): Promise<string> {
    try {
      const prompt = `Provide current DeFi market insights including:
      
- Market trends in lending protocols
- Cross-chain opportunities
- Risk factors to watch
- Recommendations for users

Keep the response engaging and informative, under 300 words.`;

      const systemPrompt = `You are a DeFi market analyst. 
      Provide current, relevant market insights. 
      Focus on practical information for users.`;

      return await this.makeRequest(prompt, systemPrompt, 800);
    } catch (error) {
      return 'Market insights unavailable. Please try again later.';
    }
  }

  async generatePortfolioRecommendations(portfolioData: any): Promise<string> {
    try {
      const prompt = `Analyze this DeFi portfolio and provide recommendations:
      
Portfolio: ${JSON.stringify(portfolioData)}

Provide specific recommendations for:
- Portfolio optimization
- Risk management
- Yield opportunities
- Cross-chain strategies

Keep recommendations actionable and specific.`;

      const systemPrompt = `You are a DeFi portfolio advisor. 
      Provide practical, actionable recommendations. 
      Focus on user benefit and risk management.`;

      return await this.makeRequest(prompt, systemPrompt, 1000);
    } catch (error) {
      return 'Portfolio recommendations unavailable. Please try again later.';
    }
  }
}

export const openaiService = new OpenAIService();
export default openaiService;
