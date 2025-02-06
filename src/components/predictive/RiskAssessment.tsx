import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, baseValues, volatilityFactors } from './constants';

interface RiskAssessmentProps {
  selectedBank: string;
  timeframe?: number;
  volatility?: number;
}

const RiskAssessment = ({ 
  selectedBank, 
  timeframe = 30,
  volatility = 1 
}: RiskAssessmentProps) => {
  const generateRiskMetrics = () => {
    const metrics = [];
    const startDate = new Date();
    
    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0],
      };

      Object.entries(baseValues).forEach(([bank, basePrice]) => {
        const baseVolatility = volatilityFactors[bank] * volatility;
        const confidenceLevel = 0.95;
        const timeHorizon = Math.sqrt(10);
        const var95 = basePrice * baseVolatility * timeHorizon * 1.645;
        
        const riskTrend = 1 + (i / 60);
        dataPoint[bank] = Number((var95 * riskTrend * (1 + Math.random() * 0.1 - 0.05)).toFixed(2));
      });

      metrics.push(dataPoint);
    }
    
    return metrics;
  };

  const riskMetrics = generateRiskMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment (Value at Risk)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(bankColors).map(([bank, color]) => (
              <Line
                key={bank}
                type="monotone"
                dataKey={bank}
                stroke={color}
                dot={false}
                name={bank}
                strokeWidth={bank === selectedBank ? 2 : 1}
                opacity={bank === selectedBank ? 1 : 0.3}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;