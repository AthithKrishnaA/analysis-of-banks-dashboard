import React from 'react';
import { Card } from "@/components/ui/card";

interface MetricProps {
  label: string;
  value: string;
}

const MetricsCard = ({ label, value }: MetricProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-4">
        <p className="text-bank-secondary text-sm font-medium">{label}</p>
        <p className="text-bank-primary font-bold text-2xl mt-2 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </Card>
  );
};

export default MetricsCard;