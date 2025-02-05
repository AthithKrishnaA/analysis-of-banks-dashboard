import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileCheck } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface CompliancePredictionsProps {
  selectedBank: string;
}

const CompliancePredictions = ({ selectedBank }: CompliancePredictionsProps) => {
  const generateComplianceMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    const bankName = bankSymbolToName[selectedBank];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        'Compliance Score': 85 + Math.random() * 10,
        'KYC Completion': 90 + Math.random() * 8,
        'Regulatory Changes': Math.round(Math.random() * 5)
      });
    }
    
    return predictions;
  };

  const metrics = generateComplianceMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Compliance Trend Predictions
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
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Compliance Score"
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              fill={bankColors[bankSymbolToName[selectedBank]]}
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="KYC Completion"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="Regulatory Changes"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompliancePredictions;