import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StockChart from '../components/StockChart';
import MetricsCard from '../components/MetricsCard';
import BankSelector from '../components/BankSelector';
import BankMetrics from '../components/BankMetrics';
import SentimentAnalysis from '../components/SentimentAnalysis';
import BankComparison from '../components/BankComparison';
import BankRiskMetrics from '../components/BankRiskMetrics';
import CommonAnalysis from '../components/CommonAnalysis';
import MarketingAnalytics from '../components/MarketingAnalytics';

const Index = () => {
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');
  const [sentiment, setSentiment] = useState({ 
    sentiment: 'Neutral', 
    emoji: '➖', 
    color: 'text-gray-500' 
  });
  const [priceChanges, setPriceChanges] = useState<number[]>([]);

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    console.log('Selected bank changed:', bankId);
  };

  const handleSentimentUpdate = (newSentiment: any, changes: number[]) => {
    setSentiment(newSentiment);
    setPriceChanges(changes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            INDIAN BANKS ANALYSIS DASHBOARD
          </h1>
          <BankSelector onBankChange={handleBankChange} selectedBank={selectedBank} />
          <Link
            to="/predictive-analysis"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Predictive Analysis
          </Link>
        </div>
        
        <Header selectedBank={selectedBank} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard label="Previous Close" value="₹613.45" />
          <MetricsCard label="Open" value="₹615.00" />
          <MetricsCard label="Volume" value="12.5M" />
          <MetricsCard label="Market Cap" value="₹5.53T" />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <StockChart 
            selectedBank={selectedBank} 
            onSentimentUpdate={handleSentimentUpdate}
          />
        </div>

        <BankRiskMetrics selectedBank={selectedBank} />

        <SentimentAnalysis 
          selectedBank={selectedBank}
          sentiment={sentiment}
          priceChanges={priceChanges}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard label="P/E Ratio" value="12.45" />
          <MetricsCard label="Dividend Yield" value="2.80%" />
          <MetricsCard label="52 Week High" value="₹629.35" />
          <MetricsCard label="52 Week Low" value="₹501.85" />
        </div>

        <BankComparison selectedBank={selectedBank} />

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <BankMetrics bankData={mockBankData[selectedBank]} />
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-bank-primary mb-6">Common Analysis</h2>
          <CommonAnalysis selectedBank={selectedBank} />
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-bank-primary mb-6">Marketing Analytics</h2>
          <MarketingAnalytics selectedBank={selectedBank} />
        </div>
      </div>
    </div>
  );
};

export default Index;