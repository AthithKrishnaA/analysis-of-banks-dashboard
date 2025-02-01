import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const bankColors = {
  'HDFC Bank': '#1E40AF',
  'State Bank of India': '#047857',
  'ICICI Bank': '#BE123C',
  'Axis Bank': '#6D28D9',
  'Kotak Bank': '#EA580C'
};

// Sample data - in a real app, this would come from an API
const campaignData = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2024, i, 1);
  return {
    month: date.toLocaleString('default', { month: 'short' }),
    'HDFC Bank': Math.random() * 100 + 50,
    'State Bank of India': Math.random() * 100 + 40,
    'ICICI Bank': Math.random() * 100 + 45,
    'Axis Bank': Math.random() * 100 + 35,
    'Kotak Bank': Math.random() * 100 + 30,
  };
});

const channelData = [
  { channel: 'Social Media', value: 35 },
  { channel: 'Email', value: 25 },
  { channel: 'Search', value: 20 },
  { channel: 'Display', value: 15 },
  { channel: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const conversionData = Array.from({ length: 6 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
  'HDFC Bank': (Math.random() * 2 + 2).toFixed(2),
  'State Bank of India': (Math.random() * 2 + 1.8).toFixed(2),
  'ICICI Bank': (Math.random() * 2 + 1.9).toFixed(2),
  'Axis Bank': (Math.random() * 2 + 1.7).toFixed(2),
  'Kotak Bank': (Math.random() * 2 + 1.6).toFixed(2),
}));

const acquisitionCosts = {
  'HDFC Bank': {
    current: '₹2,500',
    trend: '-12%',
    color: 'text-green-600'
  },
  'State Bank of India': {
    current: '₹2,800',
    trend: '-8%',
    color: 'text-green-600'
  },
  'ICICI Bank': {
    current: '₹2,600',
    trend: '-10%',
    color: 'text-green-600'
  },
  'Axis Bank': {
    current: '₹2,900',
    trend: '+2%',
    color: 'text-red-600'
  },
  'Kotak Bank': {
    current: '₹2,700',
    trend: '-5%',
    color: 'text-green-600'
  }
};

const MarketingAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {Object.entries(bankColors).map(([bank, color]) => (
                <Line
                  key={bank}
                  type="monotone"
                  dataKey={bank}
                  stroke={color}
                  name={bank}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketing Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rates</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {Object.entries(bankColors).map(([bank, color]) => (
                  <Bar
                    key={bank}
                    dataKey={bank}
                    fill={color}
                    name={bank}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(acquisitionCosts).map(([bank, data]) => (
              <div key={bank} className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-700">{bank}</h3>
                <p className="text-2xl font-bold mt-2">{data.current}</p>
                <p className={`text-sm ${data.color} mt-1`}>{data.trend} vs last month</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingAnalytics;