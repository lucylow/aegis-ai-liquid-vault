// AI Price Prediction Service for Vibe Trading AI
// Provides AI-powered price predictions and market analysis

export interface PricePrediction {
  token: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: '1h' | '4h' | '1d' | '1w' | '1m';
  direction: 'up' | 'down' | 'sideways';
  factors: PredictionFactor[];
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface MarketAnalysis {
  token: string;
  technicalScore: number;
  sentimentScore: number;
  volumeScore: number;
  overallScore: number;
  recommendation: 'buy' | 'sell' | 'hold';
  reasoning: string;
  timestamp: string;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number;
}

export class AIPricePredictionService {
  private ollamaEndpoint: string;
  private model: string;

  constructor(ollamaEndpoint: string = 'http://localhost:11434', model: string = 'llama2') {
    this.ollamaEndpoint = ollamaEndpoint;
    this.model = model;
  }

  /**
   * Generate price prediction for a token
   */
  async generatePricePrediction(
    token: string,
    currentPrice: number,
    timeframe: '1h' | '4h' | '1d' | '1w' | '1m',
    marketData: any
  ): Promise<PricePrediction> {
    try {
      console.log('🤖 AI: Generating price prediction for', token, 'timeframe:', timeframe);
      
      // Analyze market data
      const technicalAnalysis = this.analyzeTechnicalIndicators(marketData);
      const sentimentAnalysis = await this.analyzeMarketSentiment(token, marketData);
      const volumeAnalysis = this.analyzeVolumePatterns(marketData);
      
      // Generate prediction using AI
      const prediction = await this.generateAIPrediction(
        token,
        currentPrice,
        timeframe,
        technicalAnalysis,
        sentimentAnalysis,
        volumeAnalysis
      );
      
      console.log('✅ AI: Price prediction generated successfully');
      return prediction;
      
    } catch (error) {
      console.error('❌ AI: Failed to generate price prediction', error);
      
      // Fallback to rule-based prediction
      return this.generateFallbackPrediction(token, currentPrice, timeframe, marketData);
    }
  }

  /**
   * Analyze technical indicators
   */
  private analyzeTechnicalIndicators(marketData: any): TechnicalIndicator[] {
    const indicators: TechnicalIndicator[] = [];
    
    // RSI Analysis
    if (marketData.rsi) {
      let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      let strength = 0;
      
      if (marketData.rsi < 30) {
        signal = 'bullish';
        strength = (30 - marketData.rsi) / 30;
      } else if (marketData.rsi > 70) {
        signal = 'bearish';
        strength = (marketData.rsi - 70) / 30;
      }
      
      indicators.push({
        name: 'RSI',
        value: marketData.rsi,
        signal,
        strength: Math.min(strength, 1)
      });
    }
    
    // MACD Analysis
    if (marketData.macd && marketData.macdSignal) {
      const macdDiff = marketData.macd - marketData.macdSignal;
      const signal = macdDiff > 0 ? 'bullish' : 'bearish';
      const strength = Math.min(Math.abs(macdDiff) / Math.max(Math.abs(macdDiff), 0.1), 1);
      
      indicators.push({
        name: 'MACD',
        value: macdDiff,
        signal,
        strength
      });
    }
    
    // Moving Average Analysis
    if (marketData.sma20 && marketData.sma50) {
      const smaDiff = (marketData.sma20 - marketData.sma50) / marketData.sma50;
      const signal = smaDiff > 0 ? 'bullish' : 'bearish';
      const strength = Math.min(Math.abs(smaDiff) * 10, 1);
      
      indicators.push({
        name: 'SMA Crossover',
        value: smaDiff * 100,
        signal,
        strength
      });
    }
    
    // Bollinger Bands Analysis
    if (marketData.bbUpper && marketData.bbLower && marketData.bbMiddle) {
      const currentPrice = marketData.currentPrice || 0;
      const bbPosition = (currentPrice - marketData.bbLower) / (marketData.bbUpper - marketData.bbLower);
      
      let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      let strength = 0;
      
      if (bbPosition < 0.2) {
        signal = 'bullish';
        strength = (0.2 - bbPosition) * 5;
      } else if (bbPosition > 0.8) {
        signal = 'bearish';
        strength = (bbPosition - 0.8) * 5;
      }
      
      indicators.push({
        name: 'Bollinger Bands',
        value: bbPosition * 100,
        signal,
        strength: Math.min(strength, 1)
      });
    }
    
    return indicators;
  }

  /**
   * Analyze market sentiment using AI
   */
  private async analyzeMarketSentiment(token: string, marketData: any): Promise<number> {
    try {
      const prompt = `Analyze the market sentiment for ${token} based on this data and provide a sentiment score from -1 (very bearish) to 1 (very bullish).

Market Data:
- Price Change: ${marketData.priceChange || 0}%
- Volume Change: ${marketData.volumeChange || 0}%
- Social Sentiment: ${marketData.socialSentiment || 'neutral'}
- News Sentiment: ${marketData.newsSentiment || 'neutral'}

Respond with only a number between -1 and 1:`;

      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: { temperature: 0.1, max_tokens: 10 }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const sentimentScore = parseFloat(data.response.trim());
        return isNaN(sentimentScore) ? 0 : Math.max(-1, Math.min(1, sentimentScore));
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to analyze market sentiment:', error);
      return 0;
    }
  }

  /**
   * Analyze volume patterns
   */
  private analyzeVolumePatterns(marketData: any): number {
    if (!marketData.volume || !marketData.averageVolume) {
      return 0;
    }
    
    const volumeRatio = marketData.volume / marketData.averageVolume;
    
    if (volumeRatio > 2) return 1; // High volume
    if (volumeRatio > 1.5) return 0.7; // Above average
    if (volumeRatio > 1) return 0.3; // Normal
    if (volumeRatio > 0.5) return -0.3; // Below average
    return -0.7; // Low volume
  }

  /**
   * Generate AI-powered price prediction
   */
  private async generateAIPrediction(
    token: string,
    currentPrice: number,
    timeframe: string,
    technicalIndicators: TechnicalIndicator[],
    sentimentScore: number,
    volumeScore: number
  ): Promise<PricePrediction> {
    try {
      const prompt = this.buildPredictionPrompt(
        token,
        currentPrice,
        timeframe,
        technicalIndicators,
        sentimentScore,
        volumeScore
      );

      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: { temperature: 0.2, max_tokens: 300 }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parsePredictionResponse(data.response, token, currentPrice, timeframe);
      
    } catch (error) {
      console.error('Failed to generate AI prediction:', error);
      throw error;
    }
  }

  /**
   * Build prediction prompt for AI
   */
  private buildPredictionPrompt(
    token: string,
    currentPrice: number,
    timeframe: string,
    technicalIndicators: TechnicalIndicator[],
    sentimentScore: number,
    volumeScore: number
  ): string {
    const technicalSummary = technicalIndicators
      .map(ind => `${ind.name}: ${ind.signal} (strength: ${ind.strength.toFixed(2)})`)
      .join(', ');

    return `Analyze the price prediction for ${token} and respond in this exact JSON format:

Current Price: $${currentPrice}
Timeframe: ${timeframe}
Technical Indicators: ${technicalSummary}
Sentiment Score: ${sentimentScore.toFixed(2)}
Volume Score: ${volumeScore.toFixed(2)}

Provide a price prediction in this JSON format:
{
  "predictedPrice": 2500.50,
  "confidence": 0.85,
  "direction": "up",
  "factors": [
    {
      "name": "Technical Analysis",
      "impact": "positive",
      "weight": 0.4,
      "description": "RSI shows oversold conditions"
    }
  ],
  "riskLevel": "medium"
}

Focus on:
- Price direction (up/down/sideways)
- Confidence level (0.0-1.0)
- Key factors influencing the prediction
- Risk assessment

Respond only with valid JSON:`;
  }

  /**
   * Parse AI prediction response
   */
  private parsePredictionResponse(
    response: string,
    token: string,
    currentPrice: number,
    timeframe: string
  ): PricePrediction {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        token,
        currentPrice,
        predictedPrice: parsed.predictedPrice || currentPrice,
        confidence: parsed.confidence || 0.5,
        timeframe: timeframe as any,
        direction: parsed.direction || 'sideways',
        factors: parsed.factors || [],
        riskLevel: parsed.riskLevel || 'medium',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Failed to parse prediction response:', error);
      throw new Error('Invalid prediction response format');
    }
  }

  /**
   * Generate fallback prediction using rule-based approach
   */
  private generateFallbackPrediction(
    token: string,
    currentPrice: number,
    timeframe: string,
    marketData: any
  ): PricePrediction {
    // Simple rule-based prediction
    const priceChange = marketData.priceChange || 0;
    const volumeChange = marketData.volumeChange || 0;
    
    let direction: 'up' | 'down' | 'sideways' = 'sideways';
    let predictedPrice = currentPrice;
    let confidence = 0.5;
    
    if (priceChange > 2 && volumeChange > 20) {
      direction = 'up';
      predictedPrice = currentPrice * (1 + Math.random() * 0.1);
      confidence = 0.7;
    } else if (priceChange < -2 && volumeChange > 20) {
      direction = 'down';
      predictedPrice = currentPrice * (1 - Math.random() * 0.1);
      confidence = 0.7;
    }
    
    const factors: PredictionFactor[] = [
      {
        name: 'Price Momentum',
        impact: priceChange > 0 ? 'positive' : 'negative',
        weight: 0.4,
        description: `Price change: ${priceChange.toFixed(2)}%`
      },
      {
        name: 'Volume Analysis',
        impact: volumeChange > 0 ? 'positive' : 'negative',
        weight: 0.3,
        description: `Volume change: ${volumeChange.toFixed(2)}%`
      },
      {
        name: 'Market Trend',
        impact: 'neutral',
        weight: 0.3,
        description: 'Sideways market conditions'
      }
    ];
    
    return {
      token,
      currentPrice,
      predictedPrice,
      confidence,
      timeframe: timeframe as any,
      direction,
      factors,
      riskLevel: confidence > 0.7 ? 'low' : confidence > 0.5 ? 'medium' : 'high',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate comprehensive market analysis
   */
  async generateMarketAnalysis(
    token: string,
    marketData: any,
    sentimentData: any
  ): Promise<MarketAnalysis> {
    try {
      // Calculate technical score
      const technicalIndicators = this.analyzeTechnicalIndicators(marketData);
      const technicalScore = technicalIndicators.reduce((score, ind) => {
        const multiplier = ind.signal === 'bullish' ? 1 : ind.signal === 'bearish' ? -1 : 0;
        return score + (ind.strength * multiplier);
      }, 0) / Math.max(technicalIndicators.length, 1);
      
      // Calculate sentiment score
      const sentimentScore = sentimentData.averageSentiment || 0;
      
      // Calculate volume score
      const volumeScore = this.analyzeVolumePatterns(marketData);
      
      // Calculate overall score
      const overallScore = (technicalScore * 0.4 + sentimentScore * 0.4 + volumeScore * 0.2);
      
      // Generate recommendation
      let recommendation: 'buy' | 'sell' | 'hold' = 'hold';
      let reasoning = '';
      
      if (overallScore > 0.3) {
        recommendation = 'buy';
        reasoning = 'Strong positive signals across technical, sentiment, and volume indicators';
      } else if (overallScore < -0.3) {
        recommendation = 'sell';
        reasoning = 'Negative signals indicate potential downward movement';
      } else {
        recommendation = 'hold';
        reasoning = 'Mixed signals suggest maintaining current position';
      }
      
      return {
        token,
        technicalScore,
        sentimentScore,
        volumeScore,
        overallScore,
        recommendation,
        reasoning,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Failed to generate market analysis:', error);
      throw error;
    }
  }

  /**
   * Get prediction accuracy metrics
   */
  async getPredictionAccuracy(token: string, timeframe: string): Promise<{
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
    averageError: number;
  }> {
    // Mock accuracy data - in production this would come from database
    return {
      accuracy: 0.72,
      totalPredictions: 150,
      correctPredictions: 108,
      averageError: 0.08
    };
  }
}

// Export singleton instance
export const aiPricePredictionService = new AIPricePredictionService();
