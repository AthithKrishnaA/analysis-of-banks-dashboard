import React from 'react';

const Header = () => {
  return (
    <div className="bg-white shadow-sm p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-bank-primary">State Bank of India (SBIN.NS)</h1>
          <p className="text-bank-secondary mt-1">NSE - NSE Real Time Price. Currency in INR</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-bank-primary">₹621.90</p>
          <p className="text-green-600 text-sm">+8.45 (+1.38%)</p>
        </div>
      </div>
    </div>
  );
};

export default Header;