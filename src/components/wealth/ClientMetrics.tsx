
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Percent, TrendingUp, MousePointerClick, Circle, CheckCircle2, ToggleRight } from 'lucide-react';
import MetricsCard from '../MetricsCard';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ClientSegmentDetails from './ClientSegmentDetails';

interface ClientMetricsProps {
  selectedBank: string;
}

interface ClientSegment {
  name: string;
  enabled: boolean;
  features: string[];
}

const ClientMetrics = ({ selectedBank }: ClientMetricsProps) => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  const { toast } = useToast();

  // Client segments with feature availability
  const [segments, setSegments] = useState<ClientSegment[]>([
    { 
      name: "High Net Worth", 
      enabled: false,
      features: ["Premium Advisory", "Global Portfolio", "Tax Optimization", "Concierge Services"]
    },
    { 
      name: "Retail", 
      enabled: false,
      features: ["Basic Advisory", "National Portfolio", "Retirement Planning", "Mobile Banking"]
    },
    { 
      name: "Corporate", 
      enabled: false,
      features: ["Treasury Management", "Cross-Border Services", "Trade Finance", "FX Solutions"]
    },
    { 
      name: "Senior Citizens", 
      enabled: false,
      features: ["Fixed Income", "Health Insurance", "Estate Planning", "Priority Service"]
    }
  ]);

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

  const handleSegmentClick = (segmentIndex: number) => {
    const updatedSegments = [...segments];
    updatedSegments[segmentIndex].enabled = !updatedSegments[segmentIndex].enabled;
    setSegments(updatedSegments);
    
    toast({
      title: updatedSegments[segmentIndex].enabled ? "Segment Enabled" : "Segment Disabled",
      description: `${updatedSegments[segmentIndex].name} segment for ${selectedBank} ${updatedSegments[segmentIndex].enabled ? 'enabled' : 'disabled'}`,
      duration: 3000,
    });
  };

  const enableAllFeatures = () => {
    const updatedSegments = segments.map(segment => ({
      ...segment,
      enabled: true
    }));
    setSegments(updatedSegments);
    
    toast({
      title: "All Segments Enabled",
      description: `All client segments have been enabled for ${selectedBank}`,
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
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Client Segments</h4>
                <Button 
                  onClick={enableAllFeatures}
                  size="sm" 
                  variant="outline"
                  className="text-xs gap-1 h-8"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Enable All Features
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {segments.map((segment, index) => (
                  <div 
                    key={segment.name}
                    className={`border rounded-md transition-all ${
                      segment.enabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between p-3 border-b">
                      <h5 className="text-sm font-medium">{segment.name}</h5>
                      <Button
                        onClick={() => handleSegmentClick(index)}
                        size="sm"
                        variant={segment.enabled ? "default" : "outline"}
                        className="h-7 text-xs"
                      >
                        {segment.enabled ? (
                          <span className="flex items-center gap-1">
                            <ToggleRight className="h-3 w-3" />
                            Enabled
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Circle className="h-3 w-3" />
                            Disabled
                          </span>
                        )}
                      </Button>
                    </div>
                    <div className="p-3">
                      <ul className="space-y-2">
                        {segment.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex} 
                            className={`text-xs flex items-center gap-1.5 ${
                              segment.enabled 
                                ? 'text-blue-800' 
                                : 'text-gray-500'
                            }`}
                          >
                            {segment.enabled ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <Circle className="h-3 w-3 text-gray-400" />
                            )}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
      
      {/* Add segment details when segments are enabled */}
      {segments.some(segment => segment.enabled) && (
        <ClientSegmentDetails selectedBank={selectedBank} segments={segments} />
      )}
    </div>
  );
};

export default ClientMetrics;
