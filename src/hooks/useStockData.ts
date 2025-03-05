import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';

interface StockDataPoint {
  date: string;
  price: number;
}

interface BankNewsItem {
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  date: string;
}

const baseValues = {
  'SBIN.NS': 778.10,
  'AXISBANK.NS': 1013.00,
  'HDFCBANK.NS': 1714.00,
  'KOTAKBANK.NS': 1910.00,
  'ICICIBANK.NS': 1267.00
};

const mockNews: Record<string, BankNewsItem[]> = {
  'SBIN.NS': [
    { title: 'SBI Announces New Digital Banking Initiative', summary: 'State Bank of India launches new digital banking platform with enhanced security features', impact: 'positive', date: new Date().toISOString() },
    { title: 'Government Increases Stake in SBI', summary: 'Indian government increases stake in SBI by 2% through open market operations', impact: 'neutral', date: new Date().toISOString() }
  ],
  'AXISBANK.NS': [
    { title: 'Axis Bank Reports Strong Q2 Results', summary: 'Axis Bank exceeds analyst expectations with 22% profit growth in Q2', impact: 'positive', date: new Date().toISOString() },
    { title: 'New Leadership at Axis Bank', summary: 'Axis Bank appoints new CTO to accelerate digital transformation', impact: 'positive', date: new Date().toISOString() }
  ],
  'HDFCBANK.NS': [
    { title: 'HDFC Bank Expands Rural Presence', summary: 'HDFC Bank opens 500 new branches in rural areas to boost financial inclusion', impact: 'positive', date: new Date().toISOString() },
    { title: 'HDFC Bank Faces Regulatory Scrutiny', summary: 'RBI examines HDFC Bank\'s IT infrastructure after recent outages', impact: 'negative', date: new Date().toISOString() }
  ],
  'KOTAKBANK.NS': [
    { title: 'Kotak Mahindra Bank Launches New Credit Card', summary: 'New premium credit card offers enhanced rewards for high-value customers', impact: 'positive', date: new Date().toISOString() },
    { title: 'Leadership Change at Kotak Bank', summary: 'Long-serving executive announces retirement from Kotak Bank board', impact: 'neutral', date: new Date().toISOString() }
  ],
  'ICICIBANK.NS': [
    { title: 'ICICI Bank Partners with Fintech Startup', summary: 'Strategic partnership aims to enhance digital lending capabilities', impact: 'positive', date: new Date().toISOString() },
    { title: 'ICICI Bank Increases Interest Rates', summary: 'Bank increases fixed deposit rates by 25 basis points', impact: 'neutral', date: new Date().toISOString() }
  ]
};

export const useStockData = (selectedBank: string, onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const [news, setNews] = useState<BankNewsItem[]>([]);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const { toast } = useToast();

  const generateMockPrice = (basePrice: number) => {
    const volatility = 0.002; // 0.2% volatility
    const change = basePrice * volatility * (Math.random() - 0.5);
    return basePrice + change;
  };

  const toggleInteractiveMode = () => {
    setInteractiveMode(!interactiveMode);
    toast({
      title: interactiveMode ? "Standard Mode Activated" : "Interactive Mode Activated",
      description: interactiveMode 
        ? "Reverting to standard price update frequency" 
        : "Prices will update more frequently for analysis",
      duration: 3000,
    });
    return interactiveMode;
  };

  const simulateMarketEvent = () => {
    const eventTypes = ['positive', 'negative', 'neutral'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    let multiplier = 1;
    let description = "";
    
    switch(eventType) {
      case 'positive':
        multiplier = 1 + (Math.random() * 0.03); // up to 3% increase
        description = "Positive market sentiment driving prices up";
        break;
      case 'negative':
        multiplier = 1 - (Math.random() * 0.03); // up to 3% decrease
        description = "Market uncertainty causing price dip";
        break;
      case 'neutral':
        multiplier = 1 + (Math.random() * 0.01 - 0.005); // -0.5% to +0.5%
        description = "Markets responding to mixed signals";
        break;
    }
    
    const basePrice = baseValues[selectedBank];
    const newPrice = basePrice * multiplier;
    
    setData(prevData => {
      const newData = [...prevData];
      if (newData.length > 0) {
        newData[newData.length - 1].price = newPrice;
      }
      return newData;
    });
    
    toast({
      title: "Market Event Detected",
      description: description,
      duration: 3000,
    });
    
    return { price: newPrice, description };
  };

  const generateMockData = () => {
    try {
      console.log('Generating mock data for:', selectedBank);
      const basePrice = baseValues[selectedBank];
      
      const newPrice = generateMockPrice(basePrice);
      const timestamp = new Date().toLocaleTimeString();

      setData(prevData => {
        const newData = [...prevData, { date: timestamp, price: newPrice }];
        return newData.slice(-6);
      });

      if (data.length >= 2) {
        const priceChange = ((newPrice - data[data.length - 1].price) / data[data.length - 1].price) * 100;
        const newPriceChanges = [...priceChanges.slice(-5), priceChange];
        setPriceChanges(newPriceChanges);

        if (Math.abs(priceChange) > 0.1) {
          const sentiment = analyzeSentiment(newPriceChanges);
          if (onSentimentUpdate) {
            onSentimentUpdate(sentiment, newPriceChanges);
          }

          toast({
            title: `${selectedBank} Market Update`,
            description: `${sentiment.emoji} ${Math.abs(priceChange).toFixed(2)}% ${priceChange > 0 ? 'increase' : 'decrease'} - ${sentiment.sentiment} sentiment`,
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error generating mock data:', error);
      toast({
        title: "Error",
        description: "Failed to update stock price",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (selectedBank) {
      setData([]);
      setPriceChanges([]);
      setNews(mockNews[selectedBank] || []);
      
      const basePrice = baseValues[selectedBank];
      setData([{ date: new Date().toLocaleTimeString(), price: basePrice }]);
      
      const interval = setInterval(() => {
        generateMockData();
      }, interactiveMode ? 5000 : 15000);
      
      return () => clearInterval(interval);
    }
  }, [selectedBank, interactiveMode]);

  const priceChange = data.length >= 2 
    ? ((data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price) * 100 
    : 0;

  const sentiment = analyzeSentiment(priceChanges);

  return { 
    data, 
    priceChange, 
    sentiment, 
    news, 
    toggleInteractiveMode, 
    simulateMarketEvent,
    interactiveMode 
  };
};
