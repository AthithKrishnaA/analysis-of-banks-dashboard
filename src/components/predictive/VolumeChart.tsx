import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors } from './constants';

interface VolumeChartProps {
  volumePredictions: any[];
}

const VolumeChart = ({ volumePredictions }: VolumeChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicted Trading Volume Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volumePredictions}>
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
              <Area
                key={bank}
                type="monotone"
                dataKey={bank}
                stackId="1"
                stroke={color}
                fill={color}
                name={bank}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolumeChart;