import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface ConfidenceIntervalsProps {
  confidenceIntervals: any[];
  selectedBank: string;
}

const ConfidenceIntervals = ({ confidenceIntervals, selectedBank }: ConfidenceIntervalsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Intervals</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={confidenceIntervals}>
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
              dataKey={bankSymbolToName[selectedBank]}
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              fill={bankColors[bankSymbolToName[selectedBank]]}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="Upper Bound"
              stroke="#94A3B8"
              fill="#94A3B8"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="Lower Bound"
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

export default ConfidenceIntervals;