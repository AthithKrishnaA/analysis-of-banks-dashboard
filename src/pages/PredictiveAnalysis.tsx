import React, { useState } from 'react';
import { Loader2, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BankSelector from '../components/BankSelector';
import BankPricePredictions from '../components/predictive/BankPricePredictions';
import VolumeChart from '../components/predictive/VolumeChart';
import ConfidenceIntervals from '../components/predictive/ConfidenceIntervals';
import RiskAssessment from '../components/predictive/RiskAssessment';
import FraudPredictions from '../components/predictive/FraudPredictions';
import CompliancePredictions from '../components/predictive/CompliancePredictions';

const PredictiveAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');
  const [predictionDays, setPredictionDays] = useState(90);
  const [volatilityFactor, setVolatilityFactor] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('base');
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

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario);
    toast({
      title: "Scenario Changed",
      description: `Analyzing ${scenario} case market conditions`,
    });
  };

  const handleVolatilityChange = (value: number[]) => {
    setVolatilityFactor(value[0]);
    toast({
      title: "Volatility Adjusted",
      description: `Market volatility factor set to ${value[0]}x`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-4 items-center justify-between">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Prediction Timeframe</span>
                </div>
                <Slider
                  defaultValue={[90]}
                  max={365}
                  min={30}
                  step={30}
                  value={[predictionDays]}
                  onValueChange={(value) => setPredictionDays(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{predictionDays} days</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Market Volatility Factor</span>
                </div>
                <Slider
                  defaultValue={[1]}
                  max={2}
                  min={0.5}
                  step={0.1}
                  value={[volatilityFactor]}
                  onValueChange={handleVolatilityChange}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{volatilityFactor}x</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="base" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="base" onClick={() => handleScenarioChange('Base Case')}>Base Case</TabsTrigger>
            <TabsTrigger value="bull" onClick={() => handleScenarioChange('Bull Case')}>Bull Case</TabsTrigger>
            <TabsTrigger value="bear" onClick={() => handleScenarioChange('Bear Case')}>Bear Case</TabsTrigger>
          </TabsList>

          <TabsContent value="base" className="space-y-6">
            <BankPricePredictions selectedBank={selectedBank} timeframe={predictionDays} volatility={volatilityFactor} scenario="base" />
            <VolumeChart selectedBank={selectedBank} timeframe={predictionDays} />
          </TabsContent>

          <TabsContent value="bull" className="space-y-6">
            <BankPricePredictions selectedBank={selectedBank} timeframe={predictionDays} volatility={volatilityFactor} scenario="bull" />
            <VolumeChart selectedBank={selectedBank} timeframe={predictionDays} />
          </TabsContent>

          <TabsContent value="bear" className="space-y-6">
            <BankPricePredictions selectedBank={selectedBank} timeframe={predictionDays} volatility={volatilityFactor} scenario="bear" />
            <VolumeChart selectedBank={selectedBank} timeframe={predictionDays} />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FraudPredictions selectedBank={selectedBank} timeframe={predictionDays} />
          <CompliancePredictions selectedBank={selectedBank} timeframe={predictionDays} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfidenceIntervals selectedBank={selectedBank} timeframe={predictionDays} volatility={volatilityFactor} />
          <RiskAssessment selectedBank={selectedBank} timeframe={predictionDays} volatility={volatilityFactor} />
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;