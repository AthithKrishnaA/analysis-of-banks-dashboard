import React, { useState } from 'react';
import Header from '../components/Header';
import StockChart from '../components/StockChart';
import MetricsCard from '../components/MetricsCard';
import BankSelector from '../components/BankSelector';
import BankMetrics from '../components/BankMetrics';

// Mock data - In a real application, this would come from an API
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
  // Add mock data for other banks...
};

const Index = () => {
  const [selectedBank, setSelectedBank] = useState('SBIN.NS');

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    console.log('Selected bank changed:', bankId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <BankSelector onBankChange={handleBankChange} selectedBank={selectedBank} />
        </div>
        
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard label="Previous Close" value="₹613.45" />
          <MetricsCard label="Open" value="₹615.00" />
          <MetricsCard label="Volume" value="12.5M" />
        </div>
        
        <StockChart />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricsCard label="Market Cap" value="₹5.53T" />
          <MetricsCard label="P/E Ratio" value="12.45" />
          <MetricsCard label="Dividend Yield" value="2.80%" />
          <MetricsCard label="52 Week Range" value="₹501.85 - ₹629.35" />
        </div>

        <BankMetrics bankData={mockBankData[selectedBank]} />
      </div>
    </div>
  );
};

export default Index;