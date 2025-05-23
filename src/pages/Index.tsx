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
import RegulatoryCompliance from '../components/RegulatoryCompliance';
import FraudPrevention from '../components/FraudPrevention';
import ClientMetrics from '../components/wealth/ClientMetrics';
import BranchNetwork from '../components/BranchNetwork';
import CustomerSatisfaction from '../components/CustomerSatisfaction';
import DigitalBankingMetrics from '../components/DigitalBankingMetrics';
import PortfolioRecommendations from '../components/wealth/PortfolioRecommendations';
import LoanCalculatorDialog from '../components/banking/LoanCalculatorDialog';
import CardOffersDialog from '../components/banking/CardOffersDialog';
import FDRatesDialog from '../components/banking/FDRatesDialog';
import PriceAlertDialog from '../components/banking/PriceAlertDialog';
import SignOutButton from '../components/SignOutButton';
import { useStockData, BankNewsItem } from '@/hooks/useStockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { 
  Newspaper, 
  CreditCard, 
  Calculator, 
  Bell, 
  BanknoteIcon, 
  IndianRupee, 
  ChartBar,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const bankMetricsData = {
  'SBIN.NS': {
    previousClose: '776.45',
    open: '777.20',
    volume: '8.2M',
    marketCap: '6.94T',
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
    previousClose: '1011.85',
    open: '1012.30',
    volume: '4.5M',
    marketCap: '3.12T',
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
    previousClose: '1712.55',
    open: '1713.25',
    volume: '6.8M',
    marketCap: '8.56T',
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
    previousClose: '1908.75',
    open: '1909.15',
    volume: '3.2M',
    marketCap: '3.79T',
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
    previousClose: '1265.90',
    open: '1266.35',
    volume: '5.9M',
    marketCap: '4.43T',
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
  const [activeTab, setActiveTab] = useState("overview");
  const [livePriceData, setLivePriceData] = useState<{
    price: string;
    change: string;
    changePercent: string;
  } | undefined>(undefined);
  
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showCardOffers, setShowCardOffers] = useState(false);
  const [showFDRates, setShowFDRates] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    setLivePriceData(undefined);
    console.log('Selected bank changed:', bankId);
  };

  const handleSentimentUpdate = (newSentiment: any, changes: number[]) => {
    setSentiment(newSentiment);
    setPriceChanges(changes);
  };

  const handlePriceUpdate = (price: string, change: string, changePercent: string) => {
    setLivePriceData({
      price,
      change,
      changePercent
    });
  };

  const metrics = bankMetricsData[selectedBank];
  const { data, news } = useStockData(selectedBank, handleSentimentUpdate);

  const formatNewsDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newsDate = new Date(date);
      newsDate.setHours(0, 0, 0, 0);
      
      if (newsDate.getTime() === today.getTime()) {
        return 'Today';
      } else {
        return format(date, 'dd MMM yyyy');
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
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
        
        <Header selectedBank={selectedBank} livePriceData={livePriceData} />
        
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
            onPriceUpdate={handlePriceUpdate}
          />
        </div>

        <Card className="bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-blue-500" />
              Interactive Banking Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="p-6 h-auto flex flex-col items-center justify-center gap-3"
                onClick={() => setShowLoanCalculator(true)}
              >
                <Calculator className="h-8 w-8 text-blue-600" />
                <span>Loan Calculator</span>
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto flex flex-col items-center justify-center gap-3"
                onClick={() => setShowCardOffers(true)}
              >
                <CreditCard className="h-8 w-8 text-green-600" />
                <span>Card Offers</span>
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto flex flex-col items-center justify-center gap-3"
                onClick={() => setShowFDRates(true)}
              >
                <IndianRupee className="h-8 w-8 text-amber-600" />
                <span>FD Rates</span>
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto flex flex-col items-center justify-center gap-3"
                onClick={() => setShowPriceAlert(true)}
              >
                <Bell className="h-8 w-8 text-purple-600" />
                <span>Price Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <LoanCalculatorDialog 
          open={showLoanCalculator} 
          onOpenChange={setShowLoanCalculator} 
          selectedBank={selectedBank}
        />
        <CardOffersDialog 
          open={showCardOffers} 
          onOpenChange={setShowCardOffers} 
          selectedBank={selectedBank}
        />
        <FDRatesDialog 
          open={showFDRates} 
          onOpenChange={setShowFDRates} 
          selectedBank={selectedBank}
        />
        <PriceAlertDialog 
          open={showPriceAlert} 
          onOpenChange={setShowPriceAlert} 
          selectedBank={selectedBank}
        />

        <Card className="bg-white rounded-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-blue-500" />
              Latest Bank News
            </CardTitle>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated daily</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news && news.length > 0 ? (
                news.map((item: BankNewsItem, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            item.impact === 'positive' ? 'bg-green-100 text-green-800' : 
                            item.impact === 'negative' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {getImpactIcon(item.impact)}
                          {item.impact}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {formatNewsDate(item.date)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{item.summary}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent news available for this bank
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="risk">Risk & Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BranchNetwork selectedBank={selectedBank} />
              <ClientMetrics selectedBank={selectedBank} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BankComparison selectedBank={selectedBank} />
              </div>
              <div>
                <PortfolioRecommendations selectedBank={selectedBank} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricsCard label="P/E Ratio" value="12.45" />
              <MetricsCard label="Dividend Yield" value="2.80%" />
              <MetricsCard label="52 Week High" value="₹629.35" />
              <MetricsCard label="52 Week Low" value="₹501.85" />
            </div>
            
            <SentimentAnalysis 
              selectedBank={selectedBank}
              sentiment={sentiment}
              priceChanges={priceChanges}
            />
          </TabsContent>
          
          <TabsContent value="digital" className="space-y-6">
            <DigitalBankingMetrics selectedBank={selectedBank} />
            <MarketingAnalytics selectedBank={selectedBank} />
            <CommonAnalysis selectedBank={selectedBank} />
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <CustomerSatisfaction selectedBank={selectedBank} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BankMetrics selectedBank={selectedBank} />
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-bank-primary mb-6">Common Analysis</h2>
                <CommonAnalysis selectedBank={selectedBank} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
            <BankRiskMetrics selectedBank={selectedBank} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FraudPrevention selectedBank={selectedBank} />
              <RegulatoryCompliance selectedBank={selectedBank} />
            </div>
          </TabsContent>
        </Tabs>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Index;
