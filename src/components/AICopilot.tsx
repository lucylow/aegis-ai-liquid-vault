import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, TrendingUp, AlertTriangle, Lightbulb, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AICopilotProps {
  onCommand: (command: string) => void;
}

export default function AICopilot({ onCommand }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Aegis AI! I can help you with cross-chain lending, risk analysis, and portfolio optimization. What would you like to do today?',
      timestamp: new Date(),
      suggestions: [
        'Analyze my portfolio risk',
        'Find best borrowing rates',
        'Explain liquidation risk',
        'Cross-chain lending guide'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('risk') || lowerInput.includes('liquidation')) {
      return {
        content: 'Based on your current portfolio analysis, your liquidation risk is low at 12%. Your BTC collateral would need to drop below $42,000 to trigger a margin call. I recommend maintaining your LTV below 70% for optimal safety.',
        suggestions: [
          'Add more collateral',
          'Reduce borrowed amount',
          'Set up price alerts',
          'Enable auto-rebalancing'
        ]
      };
    }
    
    if (lowerInput.includes('rate') || lowerInput.includes('borrow') || lowerInput.includes('apy')) {
      return {
        content: 'Current best rates across chains: USDC at 3.5% on Base, ZETA at 7.2% on ZetaChain, and ETH at 4.8% on Ethereum. For your collateral mix, I recommend borrowing USDC on Base for the lowest fees and fastest settlement.',
        suggestions: [
          'Borrow USDC on Base',
          'Compare all rates',
          'Set rate alerts',
          'Optimize loan terms'
        ]
      };
    }
    
    if (lowerInput.includes('portfolio') || lowerInput.includes('optimize')) {
      return {
        content: 'Your portfolio shows good diversification across 5 chains. Consider increasing your Solana exposure to 25% and reducing Bitcoin to 30% for better yield opportunities. Your current 60% LTV is conservative - you could safely increase to 70% for more leverage.',
        suggestions: [
          'Rebalance portfolio',
          'Increase leverage safely',
          'Add Solana exposure',
          'Review chain distribution'
        ]
      };
    }
    
    if (lowerInput.includes('nft') || lowerInput.includes('collection')) {
      return {
        content: 'NFT collateral is available for blue-chip collections. Your Bored Ape can unlock up to 60% LTV, while Azuki offers 50% LTV. Both can be used to borrow assets on any supported chain instantly.',
        suggestions: [
          'Use BAYC as collateral',
          'Check NFT valuations',
          'Explore NFT lending',
          'Set up NFT alerts'
        ]
      };
    }

    return {
      content: "I'm here to help with your cross-chain lending needs! I can assist with risk analysis, rate optimization, portfolio management, and explaining DeFi concepts. What specific area would you like to explore?",
      suggestions: [
        'Explain LTV ratios',
        'Show lending opportunities',
        'Analyze market trends',
        'Help with wallet setup'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality would be implemented here
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary animate-pulse" />
            <span>Aegis AI Copilot</span>
            <Badge variant="outline" className="ml-auto">
              <div className="h-2 w-2 bg-success rounded-full mr-2 animate-pulse" />
              Online
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-2 h-auto py-1 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="flex-shrink-0 flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about lending, risks, or portfolio optimization..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoiceInput}
              className={isListening ? 'bg-destructive text-destructive-foreground' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Panel */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium">Opportunity Detected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You can earn 2.3% more by moving your USDC position from Ethereum to Base.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-medium">Risk Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                BTC volatility increased 15% today. Consider reducing leverage or adding collateral.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}