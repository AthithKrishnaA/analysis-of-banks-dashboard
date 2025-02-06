import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Shield } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface FraudPredictionsProps {
  selectedBank: string;
  timeframe?: number;
}

const FraudPredictions = ({ selectedBank, timeframe = 30 }: FraudPredictionsProps) => {
  const generateFraudMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    const bankName = bankSymbolToName[selectedBank];
    
    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        'Fraud Attempts': Math.round(Math.random() * 100 + 50),
        'Prevention Rate': 95 + Math.random() * 4,
        'Risk Score': Math.round(Math.random() * 30 + 20)
      });
    }
    
    return predictions;
  };

  const metrics = generateFraudMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Fraud Prevention Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Fraud Attempts"
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Prevention Rate"
              stroke="#10B981"
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Risk Score"
              stroke="#F59E0B"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FraudPredictions;