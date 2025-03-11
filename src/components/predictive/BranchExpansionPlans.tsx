
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Building } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { bankColors, bankSymbolToName } from './constants';

interface BranchExpansionPlansProps {
  selectedBank: string;
  timeframe?: number;
}

const BranchExpansionPlans = ({ selectedBank, timeframe = 30 }: BranchExpansionPlansProps) => {
  const generateBranchMetrics = () => {
    const predictions = [];
    const startDate = new Date();
    
    // Base branch counts
    const baseBranches: Record<string, Record<string, number>> = {
      'SBIN.NS': { 'total': 22000, 'rural': 8500, 'urban': 6200, 'semiUrban': 7300 },
      'AXISBANK.NS': { 'total': 14000, 'rural': 4200, 'urban': 5100, 'semiUrban': 4700 },
      'HDFCBANK.NS': { 'total': 17500, 'rural': 5200, 'urban': 6800, 'semiUrban': 5500 },
      'KOTAKBANK.NS': { 'total': 11500, 'rural': 3200, 'urban': 4500, 'semiUrban': 3800 },
      'ICICIBANK.NS': { 'total': 16900, 'rural': 5800, 'urban': 5900, 'semiUrban': 5200 },
    };
    
    const currentBranches = baseBranches[selectedBank] || { 'total': 15000, 'rural': 5000, 'urban': 5000, 'semiUrban': 5000 };
    
    // Growth strategies - different types of branches have different growth rates
    const growthRates = {
      'rural': 0.04, // 4% annual growth
      'urban': 0.02, // 2% annual growth
      'semiUrban': 0.03, // 3% annual growth
    };
    
    // Generate yearly data points
    const years = Math.max(2, Math.ceil(timeframe / 365));
    
    for (let i = 0; i < years; i++) {
      const year = new Date().getFullYear() + i;
      
      const ruralGrowth = Math.pow(1 + growthRates.rural, i);
      const urbanGrowth = Math.pow(1 + growthRates.urban, i);
      const semiUrbanGrowth = Math.pow(1 + growthRates.semiUrban, i);
      
      const ruralBranches = Math.round(currentBranches.rural * ruralGrowth);
      const urbanBranches = Math.round(currentBranches.urban * urbanGrowth);
      const semiUrbanBranches = Math.round(currentBranches.semiUrban * semiUrbanGrowth);
      
      predictions.push({
        year: year.toString(),
        'Rural Branches': ruralBranches,
        'Urban Branches': urbanBranches,
        'Semi-Urban Branches': semiUrbanBranches,
        'Total Branches': ruralBranches + urbanBranches + semiUrbanBranches
      });
    }
    
    return predictions;
  };

  const metrics = generateBranchMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-purple-600" />
          Branch Expansion Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="Rural Branches" 
              stackId="a" 
              fill="#10B981" 
              name="Rural" 
            />
            <Bar 
              dataKey="Urban Branches" 
              stackId="a" 
              fill="#3B82F6" 
              name="Urban" 
            />
            <Bar 
              dataKey="Semi-Urban Branches" 
              stackId="a" 
              fill="#A855F7" 
              name="Semi-Urban" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BranchExpansionPlans;
