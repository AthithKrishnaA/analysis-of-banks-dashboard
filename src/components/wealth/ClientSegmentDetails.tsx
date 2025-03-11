
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronDown, ChevronRight, Star, Shield, Landmark, BarChart4 } from 'lucide-react';

interface ClientSegmentDetailsProps {
  selectedBank: string;
  segments: {
    name: string;
    enabled: boolean;
    features: string[];
  }[];
}

const segmentDetails = {
  "High Net Worth": {
    minBalance: "₹50 Lakhs",
    dedicatedRM: true,
    internationalServices: true,
    benefits: [
      "Priority Banking at all branches",
      "Complimentary airport lounge access worldwide",
      "Preferential foreign exchange rates",
      "Tax advisory services",
      "Estate planning services"
    ]
  },
  "Retail": {
    minBalance: "₹10,000",
    dedicatedRM: false,
    internationalServices: false,
    benefits: [
      "Basic online and mobile banking",
      "Debit card with domestic benefits",
      "Standard savings account interest rates",
      "Fixed deposit schemes",
      "Basic insurance products"
    ]
  },
  "Corporate": {
    minBalance: "₹10 Lakhs",
    dedicatedRM: true,
    internationalServices: true,
    benefits: [
      "Specialized corporate banking solutions",
      "Trade finance facilities",
      "Cash management services",
      "Employee banking solutions",
      "Working capital financing"
    ]
  },
  "Senior Citizens": {
    minBalance: "₹5,000",
    dedicatedRM: false,
    internationalServices: false,
    benefits: [
      "Higher interest rates on deposits",
      "Priority service at branches",
      "Doorstep banking services",
      "Specialized health insurance products",
      "Pension account facilities"
    ]
  }
};

const ClientSegmentDetails: React.FC<ClientSegmentDetailsProps> = ({ 
  selectedBank,
  segments
}) => {
  // Get enabled segments
  const enabledSegments = segments.filter(segment => segment.enabled);

  if (enabledSegments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p>No client segments are currently enabled</p>
        <p className="text-sm">Enable segments to view their details</p>
      </div>
    );
  }

  const getBankName = (code: string) => {
    const bankNames: Record<string, string> = {
      'SBIN.NS': 'State Bank of India',
      'AXISBANK.NS': 'Axis Bank',
      'HDFCBANK.NS': 'HDFC Bank',
      'KOTAKBANK.NS': 'Kotak Mahindra Bank',
      'ICICIBANK.NS': 'ICICI Bank',
    };
    
    return bankNames[code] || code;
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Active Client Segments - {getBankName(selectedBank)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {enabledSegments.map((segment) => {
          const details = segmentDetails[segment.name as keyof typeof segmentDetails];
          return (
            <div key={segment.name} className="border border-blue-100 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {segment.name === "High Net Worth" && <Star className="h-5 w-5 text-amber-500" />}
                  {segment.name === "Retail" && <Users className="h-5 w-5 text-green-500" />}
                  {segment.name === "Corporate" && <Landmark className="h-5 w-5 text-purple-500" />}
                  {segment.name === "Senior Citizens" && <Shield className="h-5 w-5 text-blue-500" />}
                  <h3 className="font-semibold text-lg text-blue-900">{segment.name}</h3>
                </div>
                <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  Active
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded border border-blue-100">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Minimum Balance</h4>
                  <p className="font-semibold">{details.minBalance}</p>
                </div>
                
                <div className="bg-white p-3 rounded border border-blue-100">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Relationship Manager</h4>
                  <p className="font-semibold">{details.dedicatedRM ? 'Dedicated RM' : 'Shared RM'}</p>
                </div>
                
                <div className="bg-white p-3 rounded border border-blue-100">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">International Banking</h4>
                  <p className="font-semibold">{details.internationalServices ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BarChart4 className="h-4 w-4 text-blue-600" />
                  Key Benefits
                </h4>
                <ul className="space-y-1">
                  {details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ClientSegmentDetails;
