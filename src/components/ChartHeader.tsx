import React from 'react';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';

interface ChartHeaderProps {
  sentiment: {
    sentiment: string;
    emoji: string;
    color: string;
  };
  priceChange: number;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ sentiment, priceChange }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-bank-primary">Live Price History</h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${sentiment.color} bg-opacity-10`}>
          <Gauge className="h-4 w-4" />
          <span>{sentiment.emoji} {sentiment.sentiment}</span>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        priceChange > 0 ? 'bg-green-100 text-green-800' : 
        priceChange < 0 ? 'bg-red-100 text-red-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {priceChange > 0 ? <TrendingUp className="h-4 w-4 inline mr-1" /> : 
         priceChange < 0 ? <TrendingDown className="h-4 w-4 inline mr-1" /> : '•'} 
        {Math.abs(priceChange).toFixed(2)}%
      </div>
    </div>
  );
};

export default ChartHeader;