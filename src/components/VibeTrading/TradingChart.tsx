'use client';

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceData {
  price: number;
  timestamp: Date;
}

interface SentimentData {
  timestamp: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  text: string;
  author: {
    username: string;
    displayName: string;
  };
}

interface TradingChartProps {
  selectedToken: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '1h' | '24h' | '7d' | '30d' | '90d') => void;
  onMentionSelect?: (index: number) => void;
  currentMentionIndex?: number;
  highlightedMentionIndex?: number | null;
}

export default function TradingChart({ 
  selectedToken, 
  timeRange, 
  onTimeRangeChange, 
  onMentionSelect, 
  currentMentionIndex, 
  highlightedMentionIndex 
}: TradingChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [displayToken, setDisplayToken] = useState<string>(selectedToken);
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by only rendering time-based content on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchChartData();
    fetchSentimentData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(() => {
      fetchChartData();
      fetchSentimentData();
      setLastUpdate(new Date());
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedToken, timeRange]);

  const fetchChartData = async () => {
    try {
      // For now, generate mock price data
      // In production, this would fetch from your AEGIS backend
      const hoursMap: Record<'1h' | '24h' | '7d' | '30d' | '90d', number> = { 
        '1h': 1, '24h': 24, '7d': 24*7, '30d': 24*30, '90d': 24*90 
      };
      const hours = hoursMap[timeRange];
      const now = new Date();
      
      const mockPrices = Array.from({ length: hours * 60 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (hours * 60 - i) * 60 * 1000);
        const basePrice = 3000 + Math.sin(i / 10) * 100 + Math.random() * 50;
        return {
          price: basePrice,
          timestamp
        };
      });
      
      setPriceData(mockPrices);
      setCurrentPrice(mockPrices[mockPrices.length - 1]?.price || null);
      
      if (mockPrices.length > 1) {
        const change = ((mockPrices[mockPrices.length - 1].price - mockPrices[0].price) / mockPrices[0].price) * 100;
        setPriceChange(change);
      }
      
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSentimentData = async () => {
    try {
      // For now, generate mock sentiment data
      // In production, this would fetch from your AEGIS backend
      const mockSentiments = Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
        text: `Sample sentiment text ${i + 1}`,
        author: {
          username: `user${i + 1}`,
          displayName: `User ${i + 1}`
        }
      }));
      
      setSentimentData(mockSentiments);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    }
  };

  const chartData = {
    labels: priceData.map(d => d.timestamp),
    datasets: [
      {
        label: `${displayToken} Price`,
        data: priceData.map(d => d.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      // Sentiment dots dataset
      {
        label: 'Sentiment',
        data: sentimentData.map(d => {
          const matchingPrice = priceData.find(p => 
            Math.abs(p.timestamp.getTime() - d.timestamp.getTime()) < 5 * 60 * 1000
          );
          return matchingPrice ? matchingPrice.price : null;
        }),
        pointBackgroundColor: sentimentData.map(d => {
          switch (d.sentiment) {
            case 'positive': return 'rgb(34, 197, 94)';
            case 'negative': return 'rgb(239, 68, 68)';
            default: return 'rgb(156, 163, 175)';
          }
        }),
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        type: 'scatter' as any,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].label);
            return date.toLocaleString();
          },
          label: (context: any) => {
            if (context.datasetIndex === 0) {
              return `${displayToken}: $${context.parsed.y.toFixed(2)}`;
            }
            return '';
          }
        }
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeRange === '1h' ? 'minute' : timeRange === '24h' ? 'hour' : 'day',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: any) => `$${value.toFixed(0)}`,
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        if (element.datasetIndex === 1) { // Sentiment dataset
          const sentimentIndex = element.index;
          if (onMentionSelect) {
            onMentionSelect(sentimentIndex);
          }
        }
      }
    },
  };

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-white">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{displayToken}/USD</h3>
            <div className="flex items-center gap-2">
              {currentPrice && (
                <span className="text-2xl font-bold text-white">
                  ${currentPrice.toFixed(2)}
                </span>
              )}
              <span className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-96 bg-white/5 rounded-lg p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-300">Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300">Positive Sentiment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-300">Negative Sentiment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-gray-300">Neutral Sentiment</span>
        </div>
      </div>
    </div>
  );
}
