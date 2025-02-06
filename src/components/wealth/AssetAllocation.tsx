import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartPie } from 'lucide-react';

interface AssetAllocationProps {
  selectedBank: string;
}

const AssetAllocation = ({ selectedBank }: AssetAllocationProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const generateAllocationData = () => {
    return [
      { name: 'Equities', value: 45 },
      { name: 'Fixed Income', value: 30 },
      { name: 'Real Estate', value: 10 },
      { name: 'Commodities', value: 8 },
      { name: 'Cash', value: 7 },
    ];
  };

  const data = generateAllocationData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartPie className="h-5 w-5" />
          Asset Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AssetAllocation;