import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import BankSelector from '../components/BankSelector';
import BankPricePredictions from '../components/predictive/BankPricePredictions';
import VolumeChart from '../components/predictive/VolumeChart';
import ConfidenceIntervals from '../components/predictive/ConfidenceIntervals';
import RiskAssessment from '../components/predictive/RiskAssessment';
import { bankSymbolToName } from '../components/predictive/constants';

// Generate mock future predictions
const generatePredictions = () => {
  const predictions = [];
  const startDate = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dataPoint = {
      date: date.toISOString().split('T')[0],
      'HDFC Bank': 1450 + Math.sin(i / 10) * 200 + i * 2,
      'State Bank of India': 580 + Math.sin(i / 8) * 100 + i * 1,
      'ICICI Bank': 980 + Math.sin(i / 12) * 150 + i * 1.5,
      'Axis Bank': 1120 + Math.sin(i / 9) * 180 + i * 1.8,
      'Kotak Bank': 1780 + Math.sin(i / 11) * 220 + i * 1.7,
    };
    predictions.push(dataPoint);
  }
  
  return predictions;
};

const generateVolumePredictions = () => {
  const predictions = [];
  const startDate = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      'HDFC Bank': Math.random() * 1200000 + 600000 + i * 10000,
      'State Bank of India': Math.random() * 900000 + 450000 + i * 8000,
      'ICICI Bank': Math.random() * 1000000 + 500000 + i * 9000,
      'Axis Bank': Math.random() * 800000 + 400000 + i * 7000,
      'Kotak Bank': Math.random() * 700000 + 350000 + i * 6000,
    });
  }
  
  return predictions;
};

// Generate confidence intervals for a specific bank
const generateConfidenceIntervals = (bankSymbol: string) => {
  const bankName = bankSymbolToName[bankSymbol];
  const predictions = [];
  const startDate = new Date();
  const baseValue = Math.random() * 1000 + 1000;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const uncertainty = i * 2;
    predictions.push({
      date: date.toISOString().split('T')[0],
      [bankName]: baseValue + Math.sin(i / 5) * 100 + i * 5,
      'Upper Bound': baseValue + Math.sin(i / 5) * 100 + i * 5 + uncertainty,
      'Lower Bound': baseValue + Math.sin(i / 5) * 100 + i * 5 - uncertainty,
    });
  }
  
  return predictions;
};

const PredictiveAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');
  const { toast } = useToast();
  
  const pricePredictions = generatePredictions();
  const volumePredictions = generateVolumePredictions();
  const confidenceIntervals = generateConfidenceIntervals(selectedBank);

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Predictions Updated",
        description: `ML models have generated new market predictions for ${bankId}`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
          <BankSelector onBankChange={handleBankChange} selectedBank={selectedBank} />
          <button
            onClick={() => handleBankChange(selectedBank)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Refresh Predictions
          </button>
        </div>

        <BankPricePredictions pricePredictions={pricePredictions} />
        <VolumeChart volumePredictions={volumePredictions} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfidenceIntervals 
            confidenceIntervals={confidenceIntervals}
            selectedBank={selectedBank}
          />
          <RiskAssessment pricePredictions={pricePredictions} />
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;