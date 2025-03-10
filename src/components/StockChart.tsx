
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartHeader from './ChartHeader';
import { useStockData } from '@/hooks/useStockData';
import { format } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';

interface StockChartProps {
  selectedBank: string;
  onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void;
  onPriceUpdate?: (price: string, change: string, changePercent: string) => void;
}

const StockChart = ({ selectedBank, onSentimentUpdate, onPriceUpdate }: StockChartProps) => {
  const { data, priceChange, sentiment, isMarketOpen } = useStockData(selectedBank, onSentimentUpdate);

  // When data updates, notify parent component
  React.useEffect(() => {
    if (data.length > 0 && onPriceUpdate) {
      const latestPrice = data[data.length - 1].price.toFixed(2);
      const changeValue = priceChange > 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2);
      const changePercentValue = priceChange > 0 ? `+${priceChange.toFixed(2)}` : `${priceChange.toFixed(2)}`;
      onPriceUpdate(latestPrice, changeValue, changePercentValue);
    }
  }, [data, priceChange, onPriceUpdate]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-[400px]">
      <ChartHeader sentiment={sentiment} priceChange={priceChange} />
      
      {/* Market Status Indicator */}
      <div className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full w-fit ${
        isMarketOpen ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        <Clock className="h-4 w-4" />
        <span className="text-xs font-medium">
          {isMarketOpen 
            ? `Market Open (09:15 - 15:30 IST) - ${format(new Date(), 'MMM d, yyyy')}`
            : `Market Closed - Opens at 09:15 IST on next trading day`
          }
        </span>
      </div>
      
      {!isMarketOpen && data.length <= 1 && (
        <div className="flex items-center justify-center h-[300px]">
          <div className="flex flex-col items-center text-center p-6 max-w-md">
            <AlertTriangle className="h-10 w-10 text-amber-600 mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Market Currently Closed</h3>
            <p className="text-sm text-gray-600 mt-1">
              The Indian stock market is closed. Trading hours are 09:15 AM to 03:30 PM IST, Monday to Friday (excluding holidays).
            </p>
          </div>
        </div>
      )}
      
      {(isMarketOpen || data.length > 1) && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
              formatter={(value: number) => [`₹${value}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#1E3A8A" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;
