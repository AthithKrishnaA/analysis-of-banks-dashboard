
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface NpaPredictionsProps {
  selectedBank: string;
  timeframe?: number;
}

const NpaPredictions = ({ selectedBank, timeframe = 30 }: NpaPredictionsProps) => {
  const generateNpaMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    const bankName = bankSymbolToName[selectedBank];
    
    // Base NPA rates for different banks (as percentages)
    const baseNpaRates: Record<string, number> = {
      'SBIN.NS': 5.2,
      'AXISBANK.NS': 3.7,
      'HDFCBANK.NS': 2.1,
      'KOTAKBANK.NS': 2.5,
      'ICICIBANK.NS': 3.3,
    };
    
    const baseRate = baseNpaRates[selectedBank] || 3.5;
    
    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Slight downward trend for NPA with seasonal variations
      const seasonalFactor = Math.sin(i / 30 * Math.PI) * 0.3 + 1;
      const trendFactor = 1 - (i / timeframe) * 0.15; // Slight improvement over time
      const randomVariation = (Math.random() * 0.4 - 0.2);
      
      const npaRate = baseRate * seasonalFactor * trendFactor * (1 + randomVariation);
      const grossNpa = npaRate + (Math.random() * 1.5);
      const netNpa = npaRate * (0.4 + Math.random() * 0.2);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        'Gross NPA': parseFloat(grossNpa.toFixed(2)),
        'Net NPA': parseFloat(netNpa.toFixed(2)),
        'NPA Ratio': parseFloat(npaRate.toFixed(2))
      });
    }
    
    return predictions;
  };

  const metrics = generateNpaMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          NPA Rate Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis 
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Gross NPA"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="Net NPA"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="NPA Ratio"
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              fill={bankColors[bankSymbolToName[selectedBank]]}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NpaPredictions;
