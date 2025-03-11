
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';
import { format, parse, getDay, isWithinInterval, isWeekend } from 'date-fns';

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

// Indian stock market hours: 9:15 AM to 3:30 PM
const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';

// Indian holidays in 2025
const INDIAN_MARKET_HOLIDAYS_2025 = [
  new Date(2025, 0, 1),   // New Year's Day
  new Date(2025, 0, 26),  // Republic Day
  new Date(2025, 2, 28),  // Holi
  new Date(2025, 3, 18),  // Good Friday
  new Date(2025, 3, 1),   // Eid-ul-Fitr
  new Date(2025, 4, 1),   // Maharashtra Day
  new Date(2025, 5, 8),   // Bakri Eid
  new Date(2025, 7, 15),  // Independence Day
  new Date(2025, 8, 15),  // Ganesh Chaturthi
  new Date(2025, 9, 2),   // Gandhi Jayanti
  new Date(2025, 9, 21),  // Diwali-Laxmi Puja
  new Date(2025, 10, 3),  // Guru Nanak Jayanti
  new Date(2025, 11, 25)  // Christmas
];

const baseValues = {
  'SBIN.NS': 778.10,
  'AXISBANK.NS': 1013.00,
  'HDFCBANK.NS': 1714.00,
  'KOTAKBANK.NS': 1910.00,
  'ICICIBANK.NS': 1267.00
};

// Bank website URLs for credit card offers and other products
export const bankWebsites = {
  'SBIN.NS': 'https://www.onlinesbi.sbi/',
  'AXISBANK.NS': 'https://www.axisbank.com/',
  'HDFCBANK.NS': 'https://www.hdfcbank.com/',
  'KOTAKBANK.NS': 'https://www.kotak.com/',
  'ICICIBANK.NS': 'https://www.icicibank.com/'
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
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const { toast } = useToast();

  const checkMarketStatus = () => {
    const now = new Date();
    const currentDay = getDay(now);
    
    if (isWeekend(now)) {
      setIsMarketOpen(false);
      return false;
    }
    
    const isHoliday = INDIAN_MARKET_HOLIDAYS_2025.some(holiday => 
      holiday.getDate() === now.getDate() && 
      holiday.getMonth() === now.getMonth() && 
      holiday.getFullYear() === now.getFullYear()
    );
    
    if (isHoliday) {
      setIsMarketOpen(false);
      return false;
    }
    
    const currentTimeStr = format(now, 'HH:mm:ss');
    const openTime = parse(MARKET_OPEN_TIME, 'HH:mm:ss', new Date());
    const closeTime = parse(MARKET_CLOSE_TIME, 'HH:mm:ss', new Date());
    
    const isWithinTradingHours = isWithinInterval(
      parse(currentTimeStr, 'HH:mm:ss', new Date()),
      { start: openTime, end: closeTime }
    );
    
    setIsMarketOpen(isWithinTradingHours);
    return isWithinTradingHours;
  };

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
    if (!isMarketOpen) {
      toast({
        title: "Market Closed",
        description: "Cannot simulate market events when the market is closed.",
        duration: 3000,
      });
      return { price: baseValues[selectedBank], description: "Market is closed" };
    }
    
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
      if (!checkMarketStatus()) {
        console.log('Market is closed. Not generating new data.');
        return;
      }
      
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
    const initialMarketStatus = checkMarketStatus();
    
    if (!initialMarketStatus) {
      toast({
        title: "Market Status",
        description: "The stock market is currently closed. Data will not update until market hours.",
        duration: 5000,
      });
    }
    
    const marketStatusInterval = setInterval(() => {
      checkMarketStatus();
    }, 60000);
    
    if (selectedBank) {
      setData([]);
      setPriceChanges([]);
      setNews(mockNews[selectedBank] || []);
      
      const basePrice = baseValues[selectedBank];
      setData([{ date: new Date().toLocaleTimeString(), price: basePrice }]);
      
      let dataInterval: NodeJS.Timeout | null = null;
      
      if (initialMarketStatus) {
        dataInterval = setInterval(() => {
          generateMockData();
        }, interactiveMode ? 5000 : 15000);
      }
      
      return () => {
        if (dataInterval) clearInterval(dataInterval);
        clearInterval(marketStatusInterval);
      };
    }
  }, [selectedBank, interactiveMode]);
  
  useEffect(() => {
    if (isMarketOpen && selectedBank) {
      const interval = setInterval(() => {
        generateMockData();
      }, interactiveMode ? 5000 : 15000);
      
      return () => clearInterval(interval);
    }
  }, [isMarketOpen, selectedBank, interactiveMode]);

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
    interactiveMode,
    isMarketOpen,
    bankWebsite: bankWebsites[selectedBank] || 'https://www.onlinesbi.sbi/'
  };
};
