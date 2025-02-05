import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import BankSelector from '../components/BankSelector';
import BankPricePredictions from '../components/predictive/BankPricePredictions';
import VolumeChart from '../components/predictive/VolumeChart';
import ConfidenceIntervals from '../components/predictive/ConfidenceIntervals';
import RiskAssessment from '../components/predictive/RiskAssessment';
import FraudPredictions from '../components/predictive/FraudPredictions';
import CompliancePredictions from '../components/predictive/CompliancePredictions';
import { bankSymbolToName } from '../components/predictive/constants';

const PredictiveAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');
  const { toast } = useToast();

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

        <BankPricePredictions selectedBank={selectedBank} />
        <VolumeChart selectedBank={selectedBank} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FraudPredictions selectedBank={selectedBank} />
          <CompliancePredictions selectedBank={selectedBank} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfidenceIntervals selectedBank={selectedBank} />
          <RiskAssessment selectedBank={selectedBank} />
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;