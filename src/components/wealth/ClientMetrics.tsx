import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Percent } from 'lucide-react';
import MetricsCard from '../MetricsCard';

interface ClientMetricsProps {
  selectedBank: string;
}

const ClientMetrics = ({ selectedBank }: ClientMetricsProps) => {
  const generateClientMetrics = () => ({
    retentionRate: '95.2%',
    avgClientAge: '47',
    totalClients: '2,845',
    avgPortfolioSize: '₹2.8M'
  });

  const metrics = generateClientMetrics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Client Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard label="Client Retention Rate" value={metrics.retentionRate} />
            <MetricsCard label="Average Client Age" value={metrics.avgClientAge} />
            <MetricsCard label="Total Active Clients" value={metrics.totalClients} />
            <MetricsCard label="Avg Portfolio Size" value={metrics.avgPortfolioSize} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMetrics;