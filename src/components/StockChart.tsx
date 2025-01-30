import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', price: 580 },
  { date: 'Feb', price: 590 },
  { date: 'Mar', price: 600 },
  { date: 'Apr', price: 585 },
  { date: 'May', price: 610 },
  { date: 'Jun', price: 621 },
];

const StockChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-[400px]">
      <h2 className="text-xl font-semibold mb-4 text-bank-primary">Price History</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#1E3A8A" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;