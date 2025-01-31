import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BankComparisonProps {
  selectedBank: string;
}

const BankComparison = ({ selectedBank }: BankComparisonProps) => {
  // Sample comparison data - in a real app, this would come from an API
  const comparisonData = [
    {
      metric: 'Market Cap (₹ Trillion)',
      'State Bank of India': 5.53,
      'HDFC Bank': 12.1,
      'ICICI Bank': 7.2,
      'Axis Bank': 3.8,
      'Kotak Bank': 3.5,
    },
    {
      metric: 'P/E Ratio',
      'State Bank of India': 12.45,
      'HDFC Bank': 18.2,
      'ICICI Bank': 15.8,
      'Axis Bank': 14.2,
      'Kotak Bank': 16.5,
    },
    {
      metric: 'NPA Ratio (%)',
      'State Bank of India': 3.2,
      'HDFC Bank': 1.8,
      'ICICI Bank': 2.1,
      'Axis Bank': 2.5,
      'Kotak Bank': 1.9,
    },
    {
      metric: 'ROE (%)',
      'State Bank of India': 14.5,
      'HDFC Bank': 16.8,
      'ICICI Bank': 15.2,
      'Axis Bank': 13.8,
      'Kotak Bank': 15.5,
    }
  ];

  const bankColors = {
    'State Bank of India': '#1E3A8A',
    'HDFC Bank': '#047857',
    'ICICI Bank': '#B91C1C',
    'Axis Bank': '#6D28D9',
    'Kotak Bank': '#C2410C'
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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Bank Comparison Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(bankColors).map((bank) => (
                <Bar
                  key={bank}
                  dataKey={bank}
                  fill={bankColors[bank as keyof typeof bankColors]}
                  opacity={bank === getBankNameFromSymbol(selectedBank) ? 1 : 0.6}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• HDFC Bank leads in market capitalization</li>
                <li>• SBI offers competitive ROE despite higher NPA ratio</li>
                <li>• Kotak maintains lowest NPA levels</li>
                <li>• ICICI shows balanced performance across metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Higher P/E ratio indicates growth expectations</li>
                <li>• Lower NPA ratio suggests better asset quality</li>
                <li>• ROE indicates profitability efficiency</li>
                <li>• Market cap reflects overall market value</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankComparison;