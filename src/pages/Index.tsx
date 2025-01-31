import React, { useState } from 'react';
import Header from '../components/Header';
import StockChart from '../components/StockChart';
import MetricsCard from '../components/MetricsCard';
import BankSelector from '../components/BankSelector';
import BankMetrics from '../components/BankMetrics';

const mockBankData = {
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

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    console.log('Selected bank changed:', bankId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
          <BankSelector onBankChange={handleBankChange} selectedBank={selectedBank} />
        </div>
        
        <Header selectedBank={selectedBank} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard label="Previous Close" value="₹613.45" />
          <MetricsCard label="Open" value="₹615.00" />
          <MetricsCard label="Volume" value="12.5M" />
          <MetricsCard label="Market Cap" value="₹5.53T" />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <StockChart selectedBank={selectedBank} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard label="P/E Ratio" value="12.45" />
          <MetricsCard label="Dividend Yield" value="2.80%" />
          <MetricsCard label="52 Week High" value="₹629.35" />
          <MetricsCard label="52 Week Low" value="₹501.85" />
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <BankMetrics bankData={mockBankData[selectedBank]} />
        </div>
      </div>
    </div>
  );
};

export default Index;