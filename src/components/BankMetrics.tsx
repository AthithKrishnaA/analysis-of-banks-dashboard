
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartPie } from 'lucide-react';

interface BankMetricsProps {
  bankData?: {
    loanData: Array<{ name: string; value: number }>;
    branchData: {
      rural: number;
      urban: number;
      semiUrban: number;
    };
  };
  selectedBank?: string;
}

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#F2FCE2', '#FEF7CD', '#FEC6A1'];

const LOAN_DISTRIBUTION = {
  'SBIN.NS': [
    { name: 'Corporate', value: 35 },
    { name: 'Retail', value: 40 },
    { name: 'SME', value: 15 },
    { name: 'Agriculture', value: 10 },
  ],
  'AXISBANK.NS': [
    { name: 'Corporate', value: 42 },
    { name: 'Retail', value: 35 },
    { name: 'SME', value: 13 },
    { name: 'Agriculture', value: 10 },
  ],
  'HDFCBANK.NS': [
    { name: 'Corporate', value: 45 },
    { name: 'Retail', value: 38 },
    { name: 'SME', value: 12 },
    { name: 'Agriculture', value: 5 },
  ],
  'KOTAKBANK.NS': [
    { name: 'Corporate', value: 38 },
    { name: 'Retail', value: 42 },
    { name: 'SME', value: 14 },
    { name: 'Agriculture', value: 6 },
  ],
  'ICICIBANK.NS': [
    { name: 'Corporate', value: 40 },
    { name: 'Retail', value: 37 },
    { name: 'SME', value: 15 },
    { name: 'Agriculture', value: 8 },
  ],
};

const BRANCH_DISTRIBUTION = {
  'SBIN.NS': {
    rural: 8500,
    urban: 6200,
    semiUrban: 7300,
  },
  'AXISBANK.NS': {
    rural: 4200,
    urban: 5100,
    semiUrban: 4700,
  },
  'HDFCBANK.NS': {
    rural: 5200,
    urban: 6800,
    semiUrban: 5500,
  },
  'KOTAKBANK.NS': {
    rural: 3200,
    urban: 4500,
    semiUrban: 3800,
  },
  'ICICIBANK.NS': {
    rural: 5800,
    urban: 5900,
    semiUrban: 5200,
  },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const BankMetrics = ({ bankData, selectedBank = 'SBIN.NS' }: BankMetricsProps) => {
  // Use provided bankData or get data based on selectedBank
  const loanData = bankData?.loanData || LOAN_DISTRIBUTION[selectedBank];
  const branchData = bankData?.branchData || BRANCH_DISTRIBUTION[selectedBank];
  
  const branchDistribution = [
    { name: 'Rural', value: branchData.rural },
    { name: 'Urban', value: branchData.urban },
    { name: 'Semi-Urban', value: branchData.semiUrban },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <ChartPie className="w-6 h-6 text-bank-primary" />
          <CardTitle>Loan Portfolio Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={loanData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {loanData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <ChartPie className="w-6 h-6 text-bank-primary" />
          <CardTitle>Branch Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={branchDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {branchDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankMetrics;
