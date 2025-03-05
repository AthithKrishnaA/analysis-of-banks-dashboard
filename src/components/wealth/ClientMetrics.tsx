
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Percent, TrendingUp, MousePointerClick } from 'lucide-react';
import MetricsCard from '../MetricsCard';
import { useToast } from "@/hooks/use-toast";

interface ClientMetricsProps {
  selectedBank: string;
}

const ClientMetrics = ({ selectedBank }: ClientMetricsProps) => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  const { toast } = useToast();

  const generateClientMetrics = () => {
    const metricsMap = {
      'SBIN.NS': {
        retentionRate: '95.8%',
        avgClientAge: '44',
        totalClients: '1.2M+',
        avgPortfolioSize: '₹3.4M'
      },
      'AXISBANK.NS': {
        retentionRate: '94.2%',
        avgClientAge: '41',
        totalClients: '1.4M+',
        avgPortfolioSize: '₹2.9M'
      },
      'HDFCBANK.NS': {
        retentionRate: '96.5%',
        avgClientAge: '39',
        totalClients: '2.7M+',
        avgPortfolioSize: '₹4.2M'
      },
      'KOTAKBANK.NS': {
        retentionRate: '93.5%',
        avgClientAge: '42',
        totalClients: '1.6M+',
        avgPortfolioSize: '₹3.8M'
      },
      'ICICIBANK.NS': {
        retentionRate: '94.7%',
        avgClientAge: '38',
        totalClients: '2.1M+',
        avgPortfolioSize: '₹3.5M'
      }
    };
    
    return metricsMap[selectedBank] || metricsMap['SBIN.NS'];
  };

  const metrics = generateClientMetrics();

  const handleSegmentClick = (segment: string) => {
    toast({
      title: "Client Segment Selected",
      description: `Analyzing ${segment} segment for ${selectedBank}`,
      duration: 3000,
    });
  };

  const toggleDetailedView = () => {
    setShowDetailedView(!showDetailedView);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Analytics
            </CardTitle>
            <button 
              onClick={toggleDetailedView}
              className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full transition-colors"
            >
              <MousePointerClick className="h-3 w-3" />
              {showDetailedView ? "Simple View" : "Detailed View"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard label="Client Retention Rate" value={metrics.retentionRate} />
            <MetricsCard label="Average Client Age" value={metrics.avgClientAge} />
            <MetricsCard label="Total Active Clients" value={metrics.totalClients} />
            <MetricsCard label="Avg Portfolio Size" value={metrics.avgPortfolioSize} />
          </div>

          {showDetailedView && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Client Segments</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["High Net Worth", "Retail", "Corporate", "Senior Citizens"].map((segment) => (
                  <button
                    key={segment}
                    onClick={() => handleSegmentClick(segment)}
                    className="text-xs bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors hover:shadow-sm"
                  >
                    {segment}
                  </button>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium text-blue-800 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Client Growth Metrics
                  </h5>
                  <p className="text-xs text-blue-700 mt-1">
                    Monthly new clients: <span className="font-semibold">12,450+</span>
                  </p>
                  <p className="text-xs text-blue-700">
                    Quarterly growth rate: <span className="font-semibold">8.2%</span>
                  </p>
                  <p className="text-xs text-blue-700">
                    Relationship manager ratio: <span className="font-semibold">1:215</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMetrics;
