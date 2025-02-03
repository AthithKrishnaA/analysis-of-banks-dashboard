import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp, TrendingDown, Gauge } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface StockDataPoint {
  date: string;
  price: number;
}

interface StockChartProps {
  selectedBank: string;
  onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void;
}

const analyzeSentiment = (priceChanges: number[]) => {
  const averageChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  const volatility = Math.sqrt(
    priceChanges.reduce((sum, change) => sum + Math.pow(change - averageChange, 2), 0) / priceChanges.length
  );

  if (averageChange > 0.5 && volatility < 1) return { sentiment: 'Bullish', emoji: '🚀', color: 'text-green-600' };
  if (averageChange > 0.2) return { sentiment: 'Slightly Bullish', emoji: '📈', color: 'text-green-500' };
  if (averageChange < -0.5 && volatility < 1) return { sentiment: 'Bearish', emoji: '📉', color: 'text-red-600' };
  if (averageChange < -0.2) return { sentiment: 'Slightly Bearish', emoji: '🔻', color: 'text-red-500' };
  if (volatility > 1.5) return { sentiment: 'Volatile', emoji: '⚡', color: 'text-yellow-500' };
  return { sentiment: 'Neutral', emoji: '➖', color: 'text-gray-500' };
};

const StockChart = ({ selectedBank, onSentimentUpdate }: StockChartProps) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const { toast } = useToast();

  const fetchLatestPrice = async () => {
    if (!selectedBank) {
      console.error('No bank selected');
      return;
    }

    try {
      console.log('Fetching data for symbol:', selectedBank);

      const { data: stockData, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { symbol: selectedBank },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('Error fetching stock data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch latest stock price",
          duration: 3000,
        });
        return;
      }

      if (!stockData) {
        console.error('No data received from API');
        return;
      }

      console.log('Received stock data:', stockData);

      const newPrice = stockData.close;
      const timestamp = new Date(stockData.date).toLocaleTimeString();

      setData(prevData => {
        const newData = [...prevData, { date: timestamp, price: newPrice }].slice(-6);
        
        if (prevData.length > 0) {
          const lastPrice = prevData[prevData.length - 1].price;
          const priceChange = ((newPrice - lastPrice) / lastPrice) * 100;
          
          const newPriceChanges = [...priceChanges.slice(-5), priceChange];
          setPriceChanges(newPriceChanges);
          
          if (Math.abs(priceChange) > 0.5) {
            const sentiment = analyzeSentiment(newPriceChanges);
            if (onSentimentUpdate) {
              onSentimentUpdate(sentiment, newPriceChanges);
            }
            toast({
              title: `${selectedBank} Market Update`,
              description: `${sentiment.emoji} ${Math.abs(priceChange).toFixed(2)}% ${priceChange > 0 ? 'increase' : 'decrease'} - ${sentiment.sentiment} sentiment`,
              duration: 3000,
            });
          }
        }
        
        return newData;
      });
    } catch (error) {
      console.error('Error in fetchLatestPrice:', error);
      toast({
        title: "Error",
        description: "Failed to fetch latest stock price",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (selectedBank) {
      // Clear existing data when bank changes
      setData([]);
      setPriceChanges([]);
      
      // Initial fetch
      fetchLatestPrice();
      
      // Set up polling every 5 seconds
      const interval = setInterval(fetchLatestPrice, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedBank]);

  const priceChange = data.length >= 2 
    ? ((data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price) * 100 
    : 0;

  const sentiment = analyzeSentiment(priceChanges);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-[400px]">
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
