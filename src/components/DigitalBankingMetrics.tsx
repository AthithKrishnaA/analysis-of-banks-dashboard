import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Smartphone, Laptop, TrendingUp, Users } from 'lucide-react';

interface DigitalBankingMetricsProps {
  selectedBank: string;
}

const DigitalBankingMetrics = ({ selectedBank }: DigitalBankingMetricsProps) => {
  const generateDigitalTrends = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const baseValues = {
      'SBIN.NS': { mobile: 45, web: 30, growth: 8 },
      'AXISBANK.NS': { mobile: 52, web: 35, growth: 12 },
      'HDFCBANK.NS': { mobile: 58, web: 32, growth: 15 },
      'KOTAKBANK.NS': { mobile: 60, web: 28, growth: 18 },
      'ICICIBANK.NS': { mobile: 55, web: 33, growth: 14 }
    };
    
    const base = baseValues[selectedBank];
    return months.map((month, index) => {
      const growthFactor = 1 + (index / 120);
      
      return {
        month,
        mobileUsers: Math.round(base.mobile * growthFactor * (1 + Math.random() * 0.1 - 0.05)),
        webUsers: Math.round(base.web * growthFactor * (1 + Math.random() * 0.1 - 0.05)),
        growth: +(base.growth * (1 + (Math.random() * 0.2 - 0.1))).toFixed(1)
      };
    });
  };

  const digitalData = generateDigitalTrends();
  
  const getDigitalStats = () => {
    const stats = {
      'SBIN.NS': {
        mobilePercentage: 72,
        webPercentage: 48,
        yearlyGrowth: 28,
        activeUsers: '32M'
      },
      'AXISBANK.NS': {
        mobilePercentage: 78,
        webPercentage: 52,
        yearlyGrowth: 32,
        activeUsers: '18M'
      },
      'HDFCBANK.NS': {
        mobilePercentage: 84,
        webPercentage: 58,
        yearlyGrowth: 35,
        activeUsers: '24M'
      },
      'KOTAKBANK.NS': {
        mobilePercentage: 88,
        webPercentage: 50,
        yearlyGrowth: 42,
        activeUsers: '12M'
      },
      'ICICIBANK.NS': {
        mobilePercentage: 80,
        webPercentage: 54,
        yearlyGrowth: 30,
        activeUsers: '20M'
      }
    };
    
    return stats[selectedBank];
  };
  
  const stats = getDigitalStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-purple-600" />
          Digital Banking Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Mobile</div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stats.mobilePercentage}%</div>
                  <div className="text-xs text-gray-500">Customer adoption</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <Laptop className="h-5 w-5 text-blue-600" />
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Web</div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stats.webPercentage}%</div>
                  <div className="text-xs text-gray-500">Customer adoption</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Growth</div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">+{stats.yearlyGrowth}%</div>
                  <div className="text-xs text-gray-500">Year over year</div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <Users className="h-5 w-5 text-amber-600" />
                  <div className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Users</div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <div className="text-xs text-gray-500">Active monthly</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={digitalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="mobileUsers" 
                  name="Mobile Users (M)" 
                  stroke="#9333EA" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="webUsers" 
                  name="Web Users (M)" 
                  stroke="#3B82F6" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="growth" 
                  name="Growth Rate (%)" 
                  stroke="#10B981" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalBankingMetrics;
