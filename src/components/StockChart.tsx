import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartHeader from './ChartHeader';
import { useStockData } from '@/hooks/useStockData';

interface StockChartProps {
  selectedBank: string;
  onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void;
}

const StockChart = ({ selectedBank, onSentimentUpdate }: StockChartProps) => {
  const { data, priceChange, sentiment } = useStockData(selectedBank, onSentimentUpdate);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-[400px]">
      <ChartHeader sentiment={sentiment} priceChange={priceChange} />
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
    </div>
  );
};

export default StockChart;