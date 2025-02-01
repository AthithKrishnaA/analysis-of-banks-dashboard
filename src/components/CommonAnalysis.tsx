import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, BoxPlot, BoxPlotChart } from 'recharts';

const bankColors = {
  'HDFC Bank': '#1E40AF',
  'State Bank of India': '#047857',
  'ICICI Bank': '#BE123C',
  'Axis Bank': '#6D28D9',
  'Kotak Bank': '#EA580C'
};

// Sample data - in a real app, this would come from an API
const stockPriceData = Array.from({ length: 180 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  return {
    date: date.toISOString().split('T')[0],
    'HDFC Bank': 1450 + Math.random() * 200 - 100,
    'State Bank of India': 580 + Math.random() * 100 - 50,
    'ICICI Bank': 980 + Math.random() * 150 - 75,
    'Axis Bank': 1120 + Math.random() * 180 - 90,
    'Kotak Bank': 1780 + Math.random() * 220 - 110,
  };
});

const dailyReturnsData = [
  { bank: 'HDFC Bank', min: -0.05, q1: -0.02, median: 0.001, q3: 0.02, max: 0.05 },
  { bank: 'State Bank of India', min: -0.06, q1: -0.025, median: 0, q3: 0.025, max: 0.06 },
  { bank: 'ICICI Bank', min: -0.055, q1: -0.022, median: 0.002, q3: 0.022, max: 0.055 },
  { bank: 'Axis Bank', min: -0.065, q1: -0.028, median: -0.001, q3: 0.028, max: 0.065 },
  { bank: 'Kotak Bank', min: -0.045, q1: -0.018, median: 0.003, q3: 0.018, max: 0.045 },
];

const volumeData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, 1 + i).toISOString().split('T')[0],
  'HDFC Bank': Math.random() * 1000000 + 500000,
  'State Bank of India': Math.random() * 800000 + 400000,
  'ICICI Bank': Math.random() * 900000 + 450000,
  'Axis Bank': Math.random() * 700000 + 350000,
  'Kotak Bank': Math.random() * 600000 + 300000,
}));

const correlationData = [
  { bank1: 'HDFC Bank', bank2: 'State Bank of India', correlation: 0.75 },
  { bank1: 'HDFC Bank', bank2: 'ICICI Bank', correlation: 0.82 },
  { bank1: 'HDFC Bank', bank2: 'Axis Bank', correlation: 0.78 },
  { bank1: 'HDFC Bank', bank2: 'Kotak Bank', correlation: 0.71 },
  { bank1: 'State Bank of India', bank2: 'ICICI Bank', correlation: 0.68 },
  { bank1: 'State Bank of India', bank2: 'Axis Bank', correlation: 0.65 },
  { bank1: 'State Bank of India', bank2: 'Kotak Bank', correlation: 0.62 },
  { bank1: 'ICICI Bank', bank2: 'Axis Bank', correlation: 0.79 },
  { bank1: 'ICICI Bank', bank2: 'Kotak Bank', correlation: 0.73 },
  { bank1: 'Axis Bank', bank2: 'Kotak Bank', correlation: 0.69 },
];

const CommonAnalysis = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Price Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Returns Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BoxPlotChart data={dailyReturnsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bank" />
                <YAxis />
                <Tooltip />
                <BoxPlot
                  dataKey="returns"
                  fill="#8884d8"
                  whiskers={[
                    { key: "min", fill: "#8884d8" },
                    { key: "max", fill: "#8884d8" }
                  ]}
                  median={{ stroke: "#8884d8" }}
                />
              </BoxPlotChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [new Intl.NumberFormat().format(value), '']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                />
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Correlation Matrix</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="category" 
                dataKey="bank1" 
                name="Bank 1"
                allowDuplicatedCategory={false}
              />
              <YAxis 
                type="category" 
                dataKey="bank2" 
                name="Bank 2"
                allowDuplicatedCategory={false}
              />
              <ZAxis 
                type="number" 
                dataKey="correlation" 
                range={[50, 400]} 
                name="Correlation"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any, name: string) => {
                  if (name === 'Correlation') {
                    return [`${(Number(value) * 100).toFixed(1)}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Scatter 
                data={correlationData} 
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommonAnalysis;