import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, TrendingUp, TrendingDown, Percent, BarChart3 } from "lucide-react";

interface RiskMetric {
  label: string;
  value: string | number;
  status: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
}

interface BankRiskMetricsProps {
  selectedBank: string;
}

const BankRiskMetrics = ({ selectedBank }: BankRiskMetricsProps) => {
  // This would typically come from an API - using mock data for demonstration
  const bankRiskData: { [key: string]: RiskMetric[] } = {
    'SBIN.NS': [
      { label: 'Credit Risk Score', value: '7.2/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Market Risk VaR', value: '2.8%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> },
      { label: 'Operational Risk Rating', value: 'B+', status: 'medium', icon: <ShieldAlert className="h-5 w-5" /> },
      { label: 'Liquidity Coverage Ratio', value: '118%', status: 'low', icon: <Percent className="h-5 w-5" /> },
      { label: 'Counterparty Risk Index', value: '6.5/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Stress Test Score', value: '8.1/10', status: 'low', icon: <BarChart3 className="h-5 w-5" /> },
      { label: 'Collateral Quality Score', value: 'A-', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Risk-Adjusted Return', value: '14.2%', status: 'medium', icon: <TrendingUp className="h-5 w-5" /> }
    ],
    'HDFCBANK.NS': [
      { label: 'Credit Risk Score', value: '8.5/10', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Market Risk VaR', value: '2.1%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> },
      { label: 'Operational Risk Rating', value: 'A', status: 'low', icon: <ShieldAlert className="h-5 w-5" /> },
      { label: 'Liquidity Coverage Ratio', value: '135%', status: 'low', icon: <Percent className="h-5 w-5" /> },
      { label: 'Counterparty Risk Index', value: '8.2/10', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Stress Test Score', value: '8.8/10', status: 'low', icon: <BarChart3 className="h-5 w-5" /> },
      { label: 'Collateral Quality Score', value: 'A+', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Risk-Adjusted Return', value: '16.8%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> }
    ],
    'ICICIBANK.NS': [
      { label: 'Credit Risk Score', value: '7.8/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Market Risk VaR', value: '2.4%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> },
      { label: 'Operational Risk Rating', value: 'A-', status: 'low', icon: <ShieldAlert className="h-5 w-5" /> },
      { label: 'Liquidity Coverage Ratio', value: '125%', status: 'low', icon: <Percent className="h-5 w-5" /> },
      { label: 'Counterparty Risk Index', value: '7.5/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Stress Test Score', value: '8.4/10', status: 'low', icon: <BarChart3 className="h-5 w-5" /> },
      { label: 'Collateral Quality Score', value: 'A', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Risk-Adjusted Return', value: '15.5%', status: 'medium', icon: <TrendingUp className="h-5 w-5" /> }
    ],
    'AXISBANK.NS': [
      { label: 'Credit Risk Score', value: '7.5/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Market Risk VaR', value: '2.6%', status: 'medium', icon: <TrendingUp className="h-5 w-5" /> },
      { label: 'Operational Risk Rating', value: 'B+', status: 'medium', icon: <ShieldAlert className="h-5 w-5" /> },
      { label: 'Liquidity Coverage Ratio', value: '122%', status: 'low', icon: <Percent className="h-5 w-5" /> },
      { label: 'Counterparty Risk Index', value: '7.0/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Stress Test Score', value: '8.0/10', status: 'medium', icon: <BarChart3 className="h-5 w-5" /> },
      { label: 'Collateral Quality Score', value: 'A-', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Risk-Adjusted Return', value: '14.8%', status: 'medium', icon: <TrendingUp className="h-5 w-5" /> }
    ],
    'KOTAKBANK.NS': [
      { label: 'Credit Risk Score', value: '8.0/10', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Market Risk VaR', value: '2.3%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> },
      { label: 'Operational Risk Rating', value: 'A-', status: 'low', icon: <ShieldAlert className="h-5 w-5" /> },
      { label: 'Liquidity Coverage Ratio', value: '128%', status: 'low', icon: <Percent className="h-5 w-5" /> },
      { label: 'Counterparty Risk Index', value: '7.8/10', status: 'medium', icon: <Shield className="h-5 w-5" /> },
      { label: 'Stress Test Score', value: '8.5/10', status: 'low', icon: <BarChart3 className="h-5 w-5" /> },
      { label: 'Collateral Quality Score', value: 'A', status: 'low', icon: <Shield className="h-5 w-5" /> },
      { label: 'Risk-Adjusted Return', value: '15.8%', status: 'low', icon: <TrendingUp className="h-5 w-5" /> }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const metrics = bankRiskData[selectedBank] || [];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Risk Assessment Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={getStatusColor(metric.status)}>{metric.icon}</span>
                  <h3 className="font-medium text-sm text-gray-600">{metric.label}</h3>
                </div>
                <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BankRiskMetrics;