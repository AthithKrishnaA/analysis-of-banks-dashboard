import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, baseValues, volatilityFactors, growthTrends } from './constants';

interface BankPricePredictionsProps {
  selectedBank: string;
  timeframe?: number;
  volatility?: number;
  scenario?: 'base' | 'bull' | 'bear';
}

const BankPricePredictions = ({ 
  selectedBank, 
  timeframe = 90, 
  volatility = 1,
  scenario = 'base' 
}: BankPricePredictionsProps) => {
  const generatePredictions = () => {
    const predictions = [];
    const startDate = new Date();
    
    // Adjust growth factors based on scenario
    const scenarioMultiplier = {
      base: 1,
      bull: 1.5,
      bear: 0.5
    }[scenario];

    const dailyGrowthFactors = Object.entries(growthTrends).reduce((acc, [bank, annualRate]) => ({
      ...acc,
      [bank]: Math.pow(1 + (annualRate * scenarioMultiplier), 1/365)
    }), {} as { [key: string]: number });

    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0],
      };

      Object.entries(baseValues).forEach(([bank, basePrice]) => {
        const baseVolatility = volatilityFactors[bank];
        const adjustedVolatility = baseVolatility * volatility;
        const growthFactor = dailyGrowthFactors[bank];
        const trend = Math.pow(growthFactor, i);
        const randomWalk = (Math.random() * 2 - 1) * adjustedVolatility;
        const price = basePrice * trend * (1 + randomWalk);
        dataPoint[bank] = Number(price.toFixed(2));
      });

      predictions.push(dataPoint);
    }
    
    return predictions;
  };

  const pricePredictions = generatePredictions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {timeframe}-Day Price Predictions ({scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pricePredictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            />
            <YAxis 
              domain={['auto', 'auto']}
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

export default BankPricePredictions;