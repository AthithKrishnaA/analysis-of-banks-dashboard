
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MetricProps {
  label: string;
  value: string;
}

const MetricsCard = ({ label, value }: MetricProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  // Generate a random trend percentage between -5% and +15%
  const getTrendData = () => {
    const isPositive = Math.random() > 0.3; // 70% chance of positive trend
    const percentage = isPositive 
      ? (Math.random() * 15).toFixed(1)
      : (Math.random() * 5).toFixed(1);
    
    return {
      isPositive,
      percentage
    };
  };

  const trend = getTrendData();

  const handleInfoClick = () => {
    toast({
      title: `About ${label}`,
      description: `This metric shows ${label.toLowerCase()} for the selected bank. Current value: ${value}`,
      duration: 3000,
    });
  };

  return (
    <Card 
      className={`bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isHovered ? 'ring-2 ring-blue-200' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        
        {isHovered && (
          <div className="mt-3 flex items-center text-xs font-medium animate-fade-in">
            {trend.isPositive ? (
              <div className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+{trend.percentage}% from last quarter</span>
              </div>
            ) : (
              <div className="text-red-500 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>-{trend.percentage}% from last quarter</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricsCard;
