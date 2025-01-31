import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Gauge, AlertTriangle, ArrowRight } from 'lucide-react';

interface SentimentAnalysisProps {
  selectedBank: string;
  sentiment: {
    sentiment: string;
    emoji: string;
    color: string;
  };
  priceChanges: number[];
}

const SentimentAnalysis = ({ selectedBank, sentiment, priceChanges }: SentimentAnalysisProps) => {
  const getVolatility = (changes: number[]) => {
    if (changes.length === 0) return 0;
    const avg = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return Math.sqrt(changes.reduce((sum, change) => sum + Math.pow(change - avg, 2), 0) / changes.length);
  };

  const volatility = getVolatility(priceChanges);
  const momentum = priceChanges.slice(-3).reduce((sum, change) => sum + change, 0) / 3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Market Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-3 rounded-lg ${sentiment.color} bg-opacity-10`}>
              <span className="font-medium">Current Sentiment</span>
              <span className="flex items-center gap-2">
                {sentiment.emoji} {sentiment.sentiment}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <span className="font-medium">Volatility Index</span>
              <span className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${volatility > 1 ? 'text-yellow-500' : 'text-green-500'}`} />
                {volatility.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Market Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="font-medium">Price Momentum</span>
              <span className="flex items-center gap-2">
                {momentum > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {Math.abs(momentum).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="font-medium">Trading Signal</span>
              <span className={`font-medium ${
                momentum > 0.5 ? 'text-green-600' : 
                momentum < -0.5 ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {momentum > 0.5 ? 'Buy' : 
                 momentum < -0.5 ? 'Sell' : 
                 'Hold'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;