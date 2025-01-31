import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";

interface StockDataPoint {
  date: string;
  price: number;
}

interface StockChartProps {
  selectedBank: string;
}

// Historical starting prices for each bank
const bankInitialPrices = {
  'SBIN.NS': 580,
  'AXISBANK.NS': 1120,
  'HDFCBANK.NS': 1450,
  'KOTAKBANK.NS': 1780,
  'ICICIBANK.NS': 980,
};

const generateInitialData = (basePrice: number) => {
  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  return hours.map((hour, index) => {
    // Add some variation to create realistic looking historical data
    const variation = (Math.random() - 0.5) * 20;
    return {
      date: hour,
      price: Math.round((basePrice + variation) * 100) / 100
    };
  });
};

const generateNewPrice = (lastPrice: number) => {
  const changePercent = (Math.random() - 0.5) * 2; // -1% to +1% change
  const newPrice = lastPrice * (1 + changePercent / 100);
  return Math.round(newPrice * 100) / 100;
};

const StockChart = ({ selectedBank }: StockChartProps) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const { toast } = useToast();

  // Reset data when bank changes
  useEffect(() => {
    const basePrice = bankInitialPrices[selectedBank];
    setData(generateInitialData(basePrice));
    console.log(`Initialized price history for ${selectedBank}`);
  }, [selectedBank]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        if (!prevData.length) return prevData;
        
        const lastPrice = prevData[prevData.length - 1].price;
        const newPrice = generateNewPrice(lastPrice);
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
        
        const priceChange = ((newPrice - lastPrice) / lastPrice) * 100;
        if (Math.abs(priceChange) > 0.5) {
          toast({
            title: `${selectedBank} Price Update`,
            description: `${priceChange > 0 ? '📈' : '📉'} ${Math.abs(priceChange).toFixed(2)}% ${priceChange > 0 ? 'increase' : 'decrease'}`,
            duration: 3000,
          });
        }

        const newData = [...prevData.slice(-5), { date: timeStr, price: newPrice }];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedBank, toast]);

  const priceChange = data.length >= 2 
    ? ((data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price) * 100 
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-bank-primary">Live Price History</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          priceChange > 0 ? 'bg-green-100 text-green-800' : 
          priceChange < 0 ? 'bg-red-100 text-red-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {priceChange > 0 ? '↑' : priceChange < 0 ? '↓' : '•'} {Math.abs(priceChange).toFixed(2)}%
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