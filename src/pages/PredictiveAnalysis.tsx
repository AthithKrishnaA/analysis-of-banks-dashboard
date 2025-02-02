import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import BankSelector from '../components/BankSelector';

const bankColors = {
  'HDFC Bank': '#1E40AF',
  'State Bank of India': '#047857',
  'ICICI Bank': '#BE123C',
  'Axis Bank': '#6D28D9',
  'Kotak Bank': '#EA580C'
};

const bankSymbolToName: { [key: string]: string } = {
  'HDFCBANK.NS': 'HDFC Bank',
  'SBIN.NS': 'State Bank of India',
  'ICICIBANK.NS': 'ICICI Bank',
  'AXISBANK.NS': 'Axis Bank',
  'KOTAKBANK.NS': 'Kotak Bank'
};

// Generate mock future predictions
const generatePredictions = () => {
  const predictions = [];
  const startDate = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dataPoint = {
      date: date.toISOString().split('T')[0],
      'HDFC Bank': 1450 + Math.sin(i / 10) * 200 + i * 2,
      'State Bank of India': 580 + Math.sin(i / 8) * 100 + i * 1,
      'ICICI Bank': 980 + Math.sin(i / 12) * 150 + i * 1.5,
      'Axis Bank': 1120 + Math.sin(i / 9) * 180 + i * 1.8,
      'Kotak Bank': 1780 + Math.sin(i / 11) * 220 + i * 1.7,
    };
    predictions.push(dataPoint);
  }
  
  return predictions;
};

const generateVolumePredictions = () => {
  const predictions = [];
  const startDate = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      'HDFC Bank': Math.random() * 1200000 + 600000 + i * 10000,
      'State Bank of India': Math.random() * 900000 + 450000 + i * 8000,
      'ICICI Bank': Math.random() * 1000000 + 500000 + i * 9000,
      'Axis Bank': Math.random() * 800000 + 400000 + i * 7000,
      'Kotak Bank': Math.random() * 700000 + 350000 + i * 6000,
    });
  }
  
  return predictions;
};

// Generate confidence intervals for a specific bank
const generateConfidenceIntervals = (bankSymbol: string) => {
  const bankName = bankSymbolToName[bankSymbol];
  const predictions = [];
  const startDate = new Date();
  const baseValue = Math.random() * 1000 + 1000; // Random base value between 1000-2000
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const uncertainty = i * 2; // Increasing uncertainty over time
    predictions.push({
      date: date.toISOString().split('T')[0],
      [bankName]: baseValue + Math.sin(i / 5) * 100 + i * 5,
      'Upper Bound': baseValue + Math.sin(i / 5) * 100 + i * 5 + uncertainty,
      'Lower Bound': baseValue + Math.sin(i / 5) * 100 + i * 5 - uncertainty,
    });
  }
  
  return predictions;
};

const PredictiveAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');
  const { toast } = useToast();
  const pricePredictions = generatePredictions();
  const volumePredictions = generateVolumePredictions();
  const confidenceIntervals = generateConfidenceIntervals(selectedBank);

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    setIsLoading(true);
    // Simulate ML model processing time for new bank
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Predictions Updated",
        description: `ML models have generated new market predictions for ${bankId}`,
      });
    }, 2000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="text-sm font-semibold">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
          <BankSelector onBankChange={handleBankChange} selectedBank={selectedBank} />
          <button
            onClick={() => handleBankChange(selectedBank)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Refresh Predictions
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>90-Day Price Predictions</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pricePredictions}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;