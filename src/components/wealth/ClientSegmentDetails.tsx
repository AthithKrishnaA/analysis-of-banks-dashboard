
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronDown, ChevronRight, Star, Shield, Landmark, BarChart4, HeartHandshake, Briefcase, UserCheck, Wallet } from 'lucide-react';

interface ClientSegmentDetailsProps {
  selectedBank: string;
  segments: {
    name: string;
    enabled: boolean;
    features: string[];
  }[];
  displayBelow?: boolean;
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
    ],
    eligibility: [
      "Maintain a minimum average monthly balance of ₹50 Lakhs",
      "Maintain investments of ₹30 Lakhs or above",
      "Annual income of ₹75 Lakhs or above",
      "Business owners with turnover of ₹2 Crores or more"
    ],
    products: [
      "International Debit & Credit Cards",
      "Premium Investment Advisory Services",
      "Offshore Investment Opportunities",
      "Customized Loan Products",
      "Private Equity Access"
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
    ],
    eligibility: [
      "Maintain a minimum average monthly balance of ₹10,000",
      "KYC compliant documentation",
      "Indian residency proof",
      "Age 18 years and above"
    ],
    products: [
      "Standard Savings Account",
      "Basic Debit & Credit Cards",
      "Fixed Deposits",
      "Personal Loans",
      "Two-Wheeler & Auto Loans"
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
    ],
    eligibility: [
      "Registered business entity (Private/Public Ltd, LLP, Partnership)",
      "Minimum annual turnover of ₹2 Crores",
      "Operational for at least 2 years",
      "Satisfactory credit history and banking relationship"
    ],
    products: [
      "Corporate Current Accounts",
      "Letter of Credit & Bank Guarantees",
      "Business Term Loans",
      "Point of Sale (POS) Solutions",
      "Payroll Management Services"
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
    ],
    eligibility: [
      "Age 60 years and above",
      "Valid age proof and KYC documents",
      "Maintain a minimum average monthly balance of ₹5,000",
      "Pension account (optional)"
    ],
    products: [
      "Senior Citizen Savings Account",
      "Special FD Schemes with Higher Interest",
      "Senior Citizen Health Insurance",
      "Will Advisory Services",
      "Reverse Mortgage Loan"
    ]
  }
};

const ClientSegmentDetails: React.FC<ClientSegmentDetailsProps> = ({ 
  selectedBank,
  segments,
  displayBelow = false
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
    <Card className={`bg-white rounded-lg shadow-md ${displayBelow ? 'mt-6' : ''}`}>
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
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
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
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    Eligibility Criteria
                  </h4>
                  <ul className="space-y-1">
                    {details.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    Available Products
                  </h4>
                  <ul className="space-y-1">
                    {details.products.map((product, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span>{product}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Additional services section */}
              <div className="mt-5 pt-4 border-t border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <HeartHandshake className="h-4 w-4 text-blue-700" />
                  <h4 className="text-sm font-medium text-blue-700">Special Services for {segment.name}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {segment.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <span className="text-xs text-blue-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ClientSegmentDetails;
