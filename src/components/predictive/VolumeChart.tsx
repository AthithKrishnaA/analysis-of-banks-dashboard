import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, baseValues } from './constants';

interface VolumeChartProps {
  selectedBank: string;
  timeframe?: number;
}

const VolumeChart = ({ selectedBank, timeframe = 30 }: VolumeChartProps) => {
  const generateVolumePredictions = () => {
    const predictions = [];
    const startDate = new Date();
    
    const baseVolumes = Object.entries(baseValues).reduce((acc, [bank, price]) => ({
      ...acc,
      [bank]: Math.round(price * 1000 * (Math.random() * 0.3 + 0.7))
    }), {} as { [key: string]: number });

    for (let i = 0; i < timeframe; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0],
      };

      Object.entries(baseVolumes).forEach(([bank, baseVolume]) => {
        const dayOfWeek = date.getDay();
        const weekPattern = Math.sin((dayOfWeek / 7) * Math.PI) * 0.2 + 1;
        const variation = (Math.random() * 0.4 + 0.8) * weekPattern;
        dataPoint[bank] = Math.round(baseVolume * variation);
      });

      predictions.push(dataPoint);
    }
    
    return predictions;
  };

  const volumePredictions = generateVolumePredictions();

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
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value: number) => [`${(value / 1000).toFixed(1)}K`, 'Volume']}
            />
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
                opacity={bank === selectedBank ? 0.8 : 0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolumeChart;