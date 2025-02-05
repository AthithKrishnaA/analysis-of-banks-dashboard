import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Fingerprint, AlertTriangle, Smartphone, Brain, Bell, Search, UserCheck } from 'lucide-react';
import { bankColors } from './predictive/constants';

interface FraudPreventionProps {
  selectedBank: string;
}

const FraudPrevention = ({ selectedBank }: FraudPreventionProps) => {
  const features = [
    {
      title: 'Real-time Fraud Detection',
      icon: Shield,
      status: 'Active',
      alerts: '24/7 Monitoring'
    },
    {
      title: 'Pattern Recognition',
      icon: Brain,
      status: 'Enhanced',
      alerts: 'ML-Powered'
    },
    {
      title: 'Identity Theft Prevention',
      icon: UserCheck,
      status: 'Active',
      alerts: 'Multi-layer Security'
    },
    {
      title: 'Transaction Authentication',
      icon: Fingerprint,
      status: 'Active',
      alerts: '2FA Enabled'
    },
    {
      title: 'Device Usage Analytics',
      icon: Smartphone,
      status: 'Monitoring',
      alerts: 'Real-time Tracking'
    },
    {
      title: 'Behavioral Biometrics',
      icon: Brain,
      status: 'Active',
      alerts: 'Advanced Analysis'
    },
    {
      title: 'Alert Management',
      icon: Bell,
      status: 'Active',
      alerts: 'Instant Notifications'
    },
    {
      title: 'Investigation Tracking',
      icon: Search,
      status: 'Active',
      alerts: 'Case Management'
    }
  ];

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Prevention Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <feature.icon 
                      className="h-8 w-8" 
                      style={{ color: bankColors[selectedBank as keyof typeof bankColors] }} 
                    />
                    <h3 className="font-semibold">{feature.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm text-gray-600">{feature.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{feature.alerts}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudPrevention;