import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors } from './constants';

interface RiskAssessmentProps {
  pricePredictions: any[];
}

const RiskAssessment = ({ pricePredictions }: RiskAssessmentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pricePredictions.slice(0, 30)}>
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

export default RiskAssessment;