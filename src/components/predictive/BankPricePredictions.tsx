import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface BankPricePredictionsProps {
  pricePredictions: any[];
}

const BankPricePredictions = ({ pricePredictions }: BankPricePredictionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>90-Day Price Predictions</CardTitle>
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
            <YAxis />
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
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BankPricePredictions;