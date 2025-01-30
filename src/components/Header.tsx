import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Header = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-bank-primary">State Bank of India (SBIN.NS)</h1>
            <p className="text-bank-secondary mt-1">NSE - NSE Real Time Price. Currency in INR</p>
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="mr-4">Credit Rating: AAA</span>
              <span>Total Branches: 22,000+</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-bank-primary">₹621.90</p>
            <p className="text-green-600 text-sm">+8.45 (+1.38%)</p>
            <p className="text-xs text-muted-foreground mt-1">Last Updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;