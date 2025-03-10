
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Building2 } from "lucide-react";
import { format } from 'date-fns';

interface HeaderProps {
  selectedBank: string;
  livePriceData?: {
    price: string;
    change: string;
    changePercent: string;
  };
}

const initialBankInfo = {
  'SBIN.NS': {
    name: 'State Bank of India',
    price: '778.10',
    change: '+12.45',
    changePercent: '+1.63',
    creditRating: 'AAA',
    branches: '22,000+'
  },
  'AXISBANK.NS': {
    name: 'Axis Bank',
    price: '1013.00',
    change: '+15.30',
    changePercent: '+1.53',
    creditRating: 'AA+',
    branches: '15,000+'
  },
  'HDFCBANK.NS': {
    name: 'HDFC Bank',
    price: '1714.00',
    change: '+21.50',
    changePercent: '+1.27',
    creditRating: 'AAA',
    branches: '18,000+'
  },
  'KOTAKBANK.NS': {
    name: 'Kotak Bank',
    price: '1910.00',
    change: '+18.40',
    changePercent: '+0.97',
    creditRating: 'AAA',
    branches: '12,000+'
  },
  'ICICIBANK.NS': {
    name: 'ICICI Bank',
    price: '1267.00',
    change: '+18.75',
    changePercent: '+1.50',
    creditRating: 'AAA',
    branches: '16,000+'
  }
};

const Header = ({ selectedBank, livePriceData }: HeaderProps) => {
  const [bankInfo, setBankInfo] = useState(initialBankInfo);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Update based on live price data from StockChart
  React.useEffect(() => {
    if (livePriceData) {
      setBankInfo(prevInfo => {
        const updatedInfo = { ...prevInfo };
        
        updatedInfo[selectedBank] = {
          ...updatedInfo[selectedBank],
          price: livePriceData.price,
          change: livePriceData.change,
          changePercent: livePriceData.changePercent
        };
        
        setLastUpdated(new Date());
        return updatedInfo;
      });
    }
  }, [livePriceData, selectedBank]);
  
  console.log('Header - Selected Bank:', selectedBank);
  console.log('Header - Bank Info:', bankInfo[selectedBank]);
  
  const bank = bankInfo[selectedBank];
  if (!bank) {
    console.error('Bank info not found for symbol:', selectedBank);
    return null;
  }

  const isPositiveChange = !bank.change.startsWith('-');

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-bank-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {bank.name} ({selectedBank})
              </h1>
            </div>
            <p className="text-bank-secondary mt-2 text-lg">NSE - NSE Real Time Price. Currency in INR</p>
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Credit Rating: {bank.creditRating}
              </span>
              <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Total Branches: {bank.branches}
              </span>
            </div>
          </div>
          <div className="text-right bg-white p-4 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-bank-primary">₹{bank.price}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className={`text-lg font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {bank.change} ({bank.changePercent}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last Updated: {format(lastUpdated, 'HH:mm:ss')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
