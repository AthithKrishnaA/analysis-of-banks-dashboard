
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface CustomerGrowthForecastProps {
  selectedBank: string;
  timeframe?: number;
}

const CustomerGrowthForecast = ({ selectedBank, timeframe = 30 }: CustomerGrowthForecastProps) => {
  const generateCustomerMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    
    // Base customer counts in millions
    const baseCustomers: Record<string, number> = {
      'SBIN.NS': 450,
      'AXISBANK.NS': 200,
      'HDFCBANK.NS': 320,
      'KOTAKBANK.NS': 160,
      'ICICIBANK.NS': 280,
    };
    
    const baseCount = baseCustomers[selectedBank] || 250;
    const baseDigital = baseCount * 0.75; // 75% are digital customers
    const baseMobile = baseCount * 0.65; // 65% are mobile app users
    
    // Generate monthly data points (roughly 30 days per month)
    const months = Math.ceil(timeframe / 30);
    
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 30);
      
      // Growth rates
      const totalGrowth = 1 + (0.008 + Math.random() * 0.004); // 0.8-1.2% monthly growth
      const totalFactor = Math.pow(totalGrowth, i);
      
      // Digital adoption grows faster
      const digitalGrowth = 1 + (0.015 + Math.random() * 0.005); // 1.5-2% monthly growth
      const digitalFactor = Math.pow(digitalGrowth, i);
      
      // Mobile adoption grows fastest
      const mobileGrowth = 1 + (0.02 + Math.random() * 0.006); // 2-2.6% monthly growth
      const mobileFactor = Math.pow(mobileGrowth, i);
      
      const currentTotal = Math.round(baseCount * totalFactor * 10) / 10;
      let currentDigital = Math.round(baseDigital * digitalFactor * 10) / 10;
      let currentMobile = Math.round(baseMobile * mobileFactor * 10) / 10;
      
      // Ensure digital and mobile don't exceed total
      currentDigital = Math.min(currentDigital, currentTotal * 0.95);
      currentMobile = Math.min(currentMobile, currentDigital * 0.95);
      
      predictions.push({
        date: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
        'Total Customers': currentTotal,
        'Digital Customers': currentDigital,
        'Mobile App Users': currentMobile
      });
    }
    
    return predictions;
  };

  const metrics = generateCustomerMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Customer Growth Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Total Customers"
              stroke={bankColors[bankSymbolToName[selectedBank]]}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Digital Customers"
              stroke="#3B82F6"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Mobile App Users"
              stroke="#8B5CF6"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerGrowthForecast;
