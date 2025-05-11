
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Zap, Bell, NewspaperIcon, LineChart, Percent, CreditCard, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LoanCalculator from './LoanCalculator';
import CreditCardOptions from './CreditCardOptions';
import RateAlertForm from './RateAlertForm';
import MarketCalendar from './MarketCalendar';
import { bankWebsites } from '@/hooks/useStockData';
import { Button } from "@/components/ui/button";

interface InteractiveBankFeaturesProps {
  selectedBank: string;
  toggleInteractiveMode: () => boolean;
  simulateMarketEvent: () => { price: number; description: string };
  interactiveMode: boolean;
  isMarketOpen?: boolean;
  news: Array<{
    title: string;
    summary: string;
    impact: 'positive' | 'negative' | 'neutral';
    date: string;
  }>;
}

const InteractiveBankFeatures = ({ 
  selectedBank, 
  toggleInteractiveMode, 
  simulateMarketEvent, 
  interactiveMode,
  isMarketOpen = true,
  news
}: InteractiveBankFeaturesProps) => {
  const { toast } = useToast();
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showCreditCardOptions, setShowCreditCardOptions] = useState(false);
  const [showRateAlertForm, setShowRateAlertForm] = useState(false);
  const [showMarketCalendar, setShowMarketCalendar] = useState(false);

  const handleCreditCardApplication = () => {
    setShowCreditCardOptions(true);
  };

  const handleInterestRateAlert = () => {
    setShowRateAlertForm(true);
  };

  const visitBankWebsite = () => {
    if (bankWebsites[selectedBank]) {
      const newsUrl = getNewsUrl(selectedBank);
      window.open(newsUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Visiting Bank Website",
        description: `Opening ${selectedBank.split('.')[0]} news section in a new tab`,
        duration: 3000,
      });
    }
  };

  const getNewsUrl = (bank: string) => {
    // Return specific URLs for each bank
    switch (bank) {
      case 'AXISBANK.NS':
        return "https://www.axisbank.com/about-us/press-releases";
      case 'ICICIBANK.NS':
        return "https://www.icicibank.com/about-us/in-the-news";
      case 'HDFCBANK.NS':
        return "https://www.hdfcbank.com/personal/about-us/news-room";
      case 'KOTAKBANK.NS':
        return "https://www.moneycontrol.com/news/tags/kotak-mahindra-bank.html";
      case 'SBIN.NS':
      default:
        return "https://www.moneycontrol.com/news/tags/sbi.html#google_vignette";
    }
  };

  return (
    <>
      {showLoanCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <LoanCalculator 
              selectedBank={selectedBank} 
              onClose={() => setShowLoanCalculator(false)}
            />
          </div>
        </div>
      )}

      {showCreditCardOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreditCardOptions
              selectedBank={selectedBank}
              onClose={() => setShowCreditCardOptions(false)}
            />
          </div>
        </div>
      )}

      {showRateAlertForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <RateAlertForm
              selectedBank={selectedBank}
              onClose={() => setShowRateAlertForm(false)}
            />
          </div>
        </div>
      )}

      {showMarketCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <MarketCalendar
              onClose={() => setShowMarketCalendar(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Interactive Banking Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleInteractiveMode}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    interactiveMode 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-100 hover:bg-blue-200 text-blue-900"
                  }`}
                >
                  <LineChart className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {interactiveMode ? "Dynamic Mode On" : "Enable Dynamic Mode"}
                  </span>
                </button>
                
                <button
                  onClick={simulateMarketEvent}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isMarketOpen
                      ? "bg-amber-100 hover:bg-amber-200 text-amber-900"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isMarketOpen}
                >
                  <Percent className="h-4 w-4" />
                  <span className="text-sm font-medium">Simulate Event</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setShowLoanCalculator(true)}
                  className="p-3 rounded-lg bg-green-100 hover:bg-green-200 text-green-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <Percent className="h-4 w-4" />
                  <span className="text-sm font-medium">Loan Calculator</span>
                </button>
                
                <button
                  onClick={handleCreditCardApplication}
                  className="p-3 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-medium">Apply for Credit Card</span>
                </button>
                
                <button
                  onClick={handleInterestRateAlert}
                  className="p-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Set Rate Alert</span>
                </button>
                
                <button
                  onClick={() => setShowMarketCalendar(true)}
                  className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Market Calendar</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <NewspaperIcon className="h-5 w-5 text-blue-600" />
              Recent Bank News
            </CardTitle>
            <Button 
              onClick={visitBankWebsite}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
            >
              <span>Visit Full News</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <div className="text-xs text-gray-500 flex items-center justify-between mb-3">
              <span>News is updated daily. Visit bank website for more updates.</span>
              <a 
                href={getNewsUrl(selectedBank)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>{selectedBank.split('.')[0]} News</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item, index) => (
                  <TableRow key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => {
                    toast({
                      title: item.title,
                      description: (
                        <div>
                          <p>{item.summary}</p>
                          <p className="text-xs text-blue-600 mt-2">
                            For the complete news, visit the {selectedBank.split('.')[0]} website.
                          </p>
                          <a 
                            href={getNewsUrl(selectedBank)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-700 mt-2 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Visit full news section</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ),
                      duration: 5000,
                    });
                  }}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.impact === 'positive' ? 'bg-green-100 text-green-800' :
                        item.impact === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.impact}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InteractiveBankFeatures;
