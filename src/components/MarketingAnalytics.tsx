import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface MarketingAnalyticsProps {
  selectedBank: string;
}

const bankColors = {
  'HDFC Bank': '#1E40AF',
  'State Bank of India': '#047857',
  'ICICI Bank': '#BE123C',
  'Axis Bank': '#6D28D9',
  'Kotak Bank': '#EA580C'
};

const getBankNameFromSymbol = (symbol: string) => {
  const mapping: { [key: string]: string } = {
    'SBIN.NS': 'State Bank of India',
    'HDFCBANK.NS': 'HDFC Bank',
    'ICICIBANK.NS': 'ICICI Bank',
    'AXISBANK.NS': 'Axis Bank',
    'KOTAKBANK.NS': 'Kotak Bank'
  };
  return mapping[symbol] || symbol;
};

// Generate campaign data for the last 12 months up to current date
const generateCampaignData = () => {
  const currentDate = new Date();
  const baseValues = {
    'HDFC Bank': 85,
    'State Bank of India': 78,
    'ICICI Bank': 82,
    'Axis Bank': 75,
    'Kotak Bank': 72
  };
  
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - (11 - i));
    const monthData = {
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' })
    };

    Object.entries(baseValues).forEach(([bank, base]) => {
      const trend = Math.sin(i / 2) * 10; // Create a wave pattern
      const random = Math.random() * 15 - 7.5; // Random variation
      monthData[bank] = Math.max(50, Math.min(100, base + trend + random));
    });

    return monthData;
  });
};

const channelData = [
  { channel: 'Social Media', value: 35, color: '#0088FE' },
  { channel: 'Email Marketing', value: 25, color: '#00C49F' },
  { channel: 'Search Engine', value: 20, color: '#FFBB28' },
  { channel: 'Display Ads', value: 15, color: '#FF8042' },
  { channel: 'Content Marketing', value: 5, color: '#8884d8' },
];

// Generate conversion data with more realistic patterns
const generateConversionData = () => {
  const currentDate = new Date();
  const baseRates = {
    'HDFC Bank': 3.8,
    'State Bank of India': 3.5,
    'ICICI Bank': 3.6,
    'Axis Bank': 3.4,
    'Kotak Bank': 3.3
  };
  
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - (5 - i));
    const monthData = {
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' })
    };

    Object.entries(baseRates).forEach(([bank, base]) => {
      const seasonality = Math.cos(i / 2) * 0.3; // Seasonal variation
      const trend = i * 0.1; // Upward trend
      const random = (Math.random() - 0.5) * 0.4; // Random noise
      monthData[bank] = (base + seasonality + trend + random).toFixed(2);
    });

    return monthData;
  });
};

const generateAcquisitionCosts = () => {
  return {
    'HDFC Bank': {
      current: '₹2,450',
      trend: '+5.2%',
      color: 'text-green-600'
    },
    'State Bank of India': {
      current: '₹2,180',
      trend: '-2.1%',
      color: 'text-red-600'
    },
    'ICICI Bank': {
      current: '₹2,320',
      trend: '+3.4%',
      color: 'text-green-600'
    },
    'Axis Bank': {
      current: '₹2,150',
      trend: '+1.8%',
      color: 'text-green-600'
    },
    'Kotak Bank': {
      current: '₹2,280',
      trend: '-1.5%',
      color: 'text-red-600'
    }
  };
};

const MarketingAnalytics = ({ selectedBank }: MarketingAnalyticsProps) => {
  const campaignData = generateCampaignData();
  const conversionData = generateConversionData();
  const acquisitionCosts = generateAcquisitionCosts();
  
  const selectedBankName = getBankNameFromSymbol(selectedBank);
  console.log('Marketing Analytics - Selected Bank:', selectedBankName);

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
              <Legend />
              {Object.entries(bankColors).map(([bank, color]) => (
                <Line
                  key={bank}
                  type="monotone"
                  dataKey={bank}
                  stroke={color}
                  name={bank}
                  opacity={bank === selectedBankName ? 1 : 0.3}
                  strokeWidth={bank === selectedBankName ? 2 : 1}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
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
              <Legend />
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
