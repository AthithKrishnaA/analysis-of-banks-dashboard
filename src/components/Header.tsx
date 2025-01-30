import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Building2 } from "lucide-react";

const Header = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-bank-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                State Bank of India (SBIN.NS)
              </h1>
            </div>
            <p className="text-bank-secondary mt-2 text-lg">NSE - NSE Real Time Price. Currency in INR</p>
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Credit Rating: AAA
              </span>
              <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Total Branches: 22,000+
              </span>
            </div>
          </div>
          <div className="text-right bg-white p-4 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-bank-primary">₹621.90</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-green-600 text-lg font-semibold">+8.45 (+1.38%)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last Updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;