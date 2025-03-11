
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface RevenueProjectionsProps {
  selectedBank: string;
  timeframe?: number;
}

const RevenueProjections = ({ selectedBank, timeframe = 30 }: RevenueProjectionsProps) => {
  const generateRevenueMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    const bankName = bankSymbolToName[selectedBank];
    
    // Base quarterly revenue in crores
    const baseRevenues: Record<string, number> = {
      'SBIN.NS': 45000,
      'AXISBANK.NS': 22000,
      'HDFCBANK.NS': 35000,
      'KOTAKBANK.NS': 16000,
      'ICICIBANK.NS': 28000,
    };
    
    const baseRevenue = baseRevenues[selectedBank] || 25000;
    const baseProfit = baseRevenue * 0.22; // 22% profit margin as baseline
    
    // Generate quarterly data points (roughly 90 days per quarter)
    const quarters = Math.ceil(timeframe / 90);
    
    for (let i = 0; i < quarters; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 90);
      
      // Growth trends
      const revenueGrowth = 1 + (0.025 + Math.random() * 0.015); // 2.5-4% quarterly growth
      const revenueFactor = Math.pow(revenueGrowth, i);
      
      // Different profit growth - can be higher or lower than revenue growth
      const profitGrowth = 1 + (0.02 + Math.random() * 0.03); // 2-5% quarterly growth
      const profitFactor = Math.pow(profitGrowth, i);
      
      // Add seasonal variations
      const seasonFactor = 1 + (Math.sin(i / 2 * Math.PI) * 0.05);
      
      const quarterRevenue = Math.round(baseRevenue * revenueFactor * seasonFactor);
      const quarterProfit = Math.round(baseProfit * profitFactor * seasonFactor);
      const quarterNII = Math.round(quarterRevenue * (0.65 + Math.random() * 0.1)); // Net Interest Income
      
      predictions.push({
        date: `Q${i+1} ${date.getFullYear()}`,
        'Total Revenue': quarterRevenue,
        'Net Profit': quarterProfit,
        'Net Interest Income': quarterNII
      });
    }
    
    return predictions;
  };

  const metrics = generateRevenueMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Revenue & Profit Projections
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K Cr`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value: number) => [`₹${(value / 100).toFixed(2)}K Cr`, '']}
            />
            <Legend />
            <Bar 
              dataKey="Total Revenue" 
              fill={bankColors[bankSymbolToName[selectedBank]]} 
              name="Total Revenue" 
            />
            <Bar 
              dataKey="Net Interest Income" 
              fill="#3B82F6" 
              name="Net Interest Income" 
            />
            <Bar 
              dataKey="Net Profit" 
              fill="#10B981" 
              name="Net Profit" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueProjections;
