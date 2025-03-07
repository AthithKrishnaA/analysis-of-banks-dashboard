
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { bankSymbolToName } from '../predictive/constants';

interface PortfolioRecommendationsProps {
  selectedBank: string;
}

const PortfolioRecommendations = ({ selectedBank }: PortfolioRecommendationsProps) => {
  const generateRecommendations = () => {
    const recommendations = [
      {
        asset: 'Fixed Deposits',
        action: 'Increase',
        reason: 'Rising interest rate environment',
        impact: '+2.3%'
      },
      {
        asset: 'Equity Funds',
        action: 'Hold',
        reason: 'Market volatility expected to continue',
        impact: 'Neutral'
      },
      {
        asset: 'Gold ETFs',
        action: 'Increase',
        reason: 'Hedge against inflation',
        impact: '+1.8%'
      },
      {
        asset: 'Corporate Bonds',
        action: 'Decrease',
        reason: 'Credit risk concerns in certain sectors',
        impact: '-0.9%'
      },
      {
        asset: 'Government Securities',
        action: 'Increase',
        reason: 'Safety in uncertain markets',
        impact: '+1.2%'
      }
    ];
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Portfolio Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Class</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead>Rationale</TableHead>
              <TableHead>Potential Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recommendations.map((recommendation, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{recommendation.asset}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {recommendation.action === 'Increase' && (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    {recommendation.action === 'Decrease' && (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    {recommendation.action}
                  </div>
                </TableCell>
                <TableCell>{recommendation.reason}</TableCell>
                <TableCell className={
                  recommendation.impact.startsWith('+') 
                    ? 'text-green-600' 
                    : recommendation.impact.startsWith('-') 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }>
                  {recommendation.impact}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PortfolioRecommendations;
