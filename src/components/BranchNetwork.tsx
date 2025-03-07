
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MapPin } from 'lucide-react';

interface BranchNetworkProps {
  selectedBank: string;
}

const branchData = {
  'SBIN.NS': {
    urban: 6200,
    semiUrban: 7300,
    rural: 8500,
    metro: 3800,
  },
  'AXISBANK.NS': {
    urban: 5100,
    semiUrban: 4700,
    rural: 4200,
    metro: 2900,
  },
  'HDFCBANK.NS': {
    urban: 6800,
    semiUrban: 5500,
    rural: 5200,
    metro: 3400,
  },
  'KOTAKBANK.NS': {
    urban: 4500,
    semiUrban: 3800,
    rural: 3200,
    metro: 2500,
  },
  'ICICIBANK.NS': {
    urban: 5900,
    semiUrban: 5200,
    rural: 5800,
    metro: 3300,
  }
};

const BranchNetwork = ({ selectedBank }: BranchNetworkProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const getBranchDistribution = () => {
    const data = branchData[selectedBank];
    return [
      { name: 'Urban', value: data.urban },
      { name: 'Semi-Urban', value: data.semiUrban },
      { name: 'Rural', value: data.rural },
      { name: 'Metro', value: data.metro },
    ];
  };

  const branchDistribution = getBranchDistribution();
  const totalBranches = branchDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Branch Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {branchDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} branches`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-col space-y-2 text-center md:text-left mt-4 md:mt-0">
            <div className="text-3xl font-bold text-blue-900">{totalBranches.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total branches nationwide</div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
              {branchDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className="text-sm">
                    <span className="font-medium">{item.name}:</span> {Math.round((item.value / totalBranches) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchNetwork;
