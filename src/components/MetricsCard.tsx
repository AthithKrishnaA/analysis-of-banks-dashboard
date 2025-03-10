
import React from 'react';
import { Card } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MetricProps {
  label: string;
  value: string;
}

const MetricsCard = ({ label, value }: MetricProps) => {
  const { toast } = useToast();

  const handleInfoClick = () => {
    let description = '';
    
    switch(label) {
      case 'Previous Close':
        description = `Average closing price from the previous trading day: ${value}`;
        break;
      case 'Open':
        description = `Average opening price from today: ${value}`;
        break;
      case 'Volume':
        description = `Average daily trading volume: ${value}`;
        break;
      case 'Market Cap':
        description = `Average daily market capitalization: ${value}`;
        break;
      default:
        description = `This shows the daily average ${label.toLowerCase()} for the selected bank. Current value: ${value}`;
    }
    
    toast({
      title: `Daily Average: ${label}`,
      description,
      duration: 3000,
    });
  };

  return (
    <Card 
      className="bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <p className="text-bank-secondary text-sm font-medium">{label}</p>
          <button 
            onClick={handleInfoClick}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="text-bank-primary font-bold text-2xl mt-2 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </Card>
  );
};

export default MetricsCard;
