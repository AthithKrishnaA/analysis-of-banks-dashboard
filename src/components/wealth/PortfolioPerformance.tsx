import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartLine } from 'lucide-react';
import { CustomTooltip } from '../predictive/CustomTooltip';
import { bankColors, bankSymbolToName } from '../predictive/constants';

interface PortfolioPerformanceProps {
  selectedBank: string;
  timeframe?: number;
}

const PortfolioPerformance = ({ selectedBank, timeframe = 30 }: PortfolioPerformanceProps) => {
  const generatePerformanceData = () => {
    const data = [];
    const startDate = new Date();
    const bankName = bankSymbolToName[selectedBank];
    let baseValue = 100;

    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const returns = baseValue * (1 + (Math.random() * 0.02 - 0.01));
      baseValue = returns;
      
      data.push({
        date: date.toISOString().split('T')[0],
        'Portfolio Value': returns.toFixed(2),
        'Benchmark': (baseValue * (1 + (Math.random() * 0.015 - 0.0075))).toFixed(2),
      });
    }
    
    return data;
  };

  const performanceData = generatePerformanceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Portfolio Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Portfolio Value"
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              fill={bankColors[bankSymbolToName[selectedBank]]}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="Benchmark"
              stroke="#94A3B8"
              fill="#94A3B8"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformance;