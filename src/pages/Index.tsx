import React from 'react';
import Header from '../components/Header';
import StockChart from '../components/StockChart';
import MetricsCard from '../components/MetricsCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
      </div>
    </div>
  );
};

export default Index;