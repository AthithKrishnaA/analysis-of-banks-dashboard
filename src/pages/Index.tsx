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

const getMetricsForBank = (bankId: string) => {
  const metrics = {
    'SBIN.NS': {
      previousClose: '776.45',
      open: '777.20',
      volume: '8.2M',
      marketCap: '6.94T'
    },
    'AXISBANK.NS': {
      previousClose: '1011.85',
      open: '1012.30',
      volume: '4.5M',
      marketCap: '3.12T'
    },
    'HDFCBANK.NS': {
      previousClose: '1712.55',
      open: '1713.25',
      volume: '6.8M',
      marketCap: '8.56T'
    },
    'KOTAKBANK.NS': {
      previousClose: '1908.75',
      open: '1909.15',
      volume: '3.2M',
      marketCap: '3.79T'
    },
    'ICICIBANK.NS': {
      previousClose: '1265.90',
      open: '1266.35',
      volume: '5.9M',
      marketCap: '4.43T'
    }
  };
  return metrics[bankId];
};

const bankMetricsData = {
  'SBIN.NS': {
    loanData: [
      { name: 'Corporate', value: 35 },
      { name: 'Retail', value: 40 },
      { name: 'SME', value: 15 },
      { name: 'Agriculture', value: 10 },
    ],
    branchData: {
      rural: 8500,
      urban: 6200,
      semiUrban: 7300,
    },
  },
  'AXISBANK.NS': {
    loanData: [
      { name: 'Corporate', value: 42 },
      { name: 'Retail', value: 35 },
      { name: 'SME', value: 13 },
      { name: 'Agriculture', value: 10 },
    ],
    branchData: {
      rural: 4200,
      urban: 5100,
      semiUrban: 4700,
    },
  },
  'HDFCBANK.NS': {
    loanData: [
      { name: 'Corporate', value: 45 },
      { name: 'Retail', value: 38 },
      { name: 'SME', value: 12 },
      { name: 'Agriculture', value: 5 },
    ],
    branchData: {
      rural: 5200,
      urban: 6800,
      semiUrban: 5500,
    },
  },
  'KOTAKBANK.NS': {
    loanData: [
      { name: 'Corporate', value: 38 },
      { name: 'Retail', value: 42 },
      { name: 'SME', value: 14 },
      { name: 'Agriculture', value: 6 },
    ],
    branchData: {
      rural: 3200,
      urban: 4500,
      semiUrban: 3800,
    },
  },
  'ICICIBANK.NS': {
    loanData: [
      { name: 'Corporate', value: 40 },
      { name: 'Retail', value: 37 },
      { name: 'SME', value: 15 },
      { name: 'Agriculture', value: 8 },
    ],
    branchData: {
      rural: 5800,
      urban: 5900,
      semiUrban: 5200,
    },
  },
};

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

  const metrics = getMetricsForBank(selectedBank);

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
          <MetricsCard label="Previous Close" value={`₹${metrics.previousClose}`} />
          <MetricsCard label="Open" value={`₹${metrics.open}`} />
          <MetricsCard label="Volume" value={metrics.volume} />
          <MetricsCard label="Market Cap" value={metrics.marketCap} />
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
          <BankMetrics bankData={bankMetricsData[selectedBank]} />
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
