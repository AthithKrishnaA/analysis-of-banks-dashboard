
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';
import { format, parse, getDay, isWithinInterval, isWeekend, addDays } from 'date-fns';

interface StockDataPoint {
  date: string;
  price: number;
}

export interface BankNewsItem {
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

// Generate news for each bank with today's date
const generateLatestNews = (): Record<string, BankNewsItem[]> => {
  const today = new Date();
  const yesterday = addDays(today, -1);
  const twoDaysAgo = addDays(today, -2);
  
  return {
    'SBIN.NS': [
      { 
        title: 'SBI Announces Digital Banking Partnership', 
        summary: 'State Bank of India forms strategic partnership with leading fintech to enhance digital banking services', 
        impact: 'positive', 
        date: today.toISOString() 
      },
      { 
        title: 'Government Initiatives Boost SBI Rural Banking', 
        summary: 'New government initiatives help SBI expand rural banking reach by 15% in Q1', 
        impact: 'positive', 
        date: yesterday.toISOString() 
      },
      { 
        title: 'SBI Reports Strong Q1 Growth', 
        summary: 'State Bank of India reports 18% year-on-year profit growth in Q1 financial results', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString() 
      }
    ],
    'AXISBANK.NS': [
      { 
        title: 'Axis Bank Introduces AI-Powered Customer Service', 
        summary: 'New AI chatbot expected to handle 40% of customer queries, reducing wait times significantly', 
        impact: 'positive', 
        date: today.toISOString() 
      },
      { 
        title: 'Axis Bank Expands Corporate Banking Division', 
        summary: 'Bank hires 200 new relationship managers to strengthen corporate banking segment', 
        impact: 'positive', 
        date: yesterday.toISOString() 
      },
      { 
        title: 'RBI Approves Axis Bank\'s New Digital Banking Initiative', 
        summary: 'Regulatory approval paves way for innovative banking solutions from Axis Bank', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString() 
      }
    ],
    'HDFCBANK.NS': [
      { 
        title: 'HDFC Bank Faces Technical Glitches', 
        summary: 'Customers report issues with mobile banking app during weekend maintenance', 
        impact: 'negative', 
        date: today.toISOString() 
      },
      { 
        title: 'HDFC Bank Launches Premium Credit Card', 
        summary: 'New metal credit card targets high-net-worth individuals with exclusive benefits', 
        impact: 'positive', 
        date: yesterday.toISOString() 
      },
      { 
        title: 'HDFC Bank Opens 100 New Rural Branches', 
        summary: 'Expansion aims to enhance financial inclusion in underserved areas', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString() 
      }
    ],
    'KOTAKBANK.NS': [
      { 
        title: 'Kotak Mahindra Bank Updates Mobile Banking App', 
        summary: 'New features include voice banking and enhanced security measures', 
        impact: 'positive', 
        date: today.toISOString() 
      },
      { 
        title: 'Kotak Bank Announces Leadership Changes', 
        summary: 'New CTO appointment signals focus on technological innovation', 
        impact: 'neutral', 
        date: yesterday.toISOString() 
      },
      { 
        title: 'Kotak Bank Reports Lower NPAs', 
        summary: 'Successful debt recovery strategy leads to significant reduction in non-performing assets', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString() 
      }
    ],
    'ICICIBANK.NS': [
      { 
        title: 'ICICI Bank Partners with E-commerce Platform', 
        summary: 'Strategic partnership offers exclusive discounts and cashback for bank customers', 
        impact: 'positive', 
        date: today.toISOString() 
      },
      { 
        title: 'ICICI Bank Increases Home Loan Interest Rates', 
        summary: 'Bank raises interest rates by 25 basis points following RBI policy changes', 
        impact: 'neutral', 
        date: yesterday.toISOString() 
      },
      { 
        title: 'ICICI Bank Wins Banking Excellence Award', 
        summary: 'Bank recognized for innovation and customer service at industry awards', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString() 
      }
    ]
  };
};

// This will store our news data and refresh daily
let newsCache: Record<string, BankNewsItem[]> | null = null;
let newsCacheDate: Date | null = null;

export const useStockData = (selectedBank: string, onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const [news, setNews] = useState<BankNewsItem[]>([]);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const { toast } = useToast();

  // Check if we need to refresh the news cache
  const refreshNewsIfNeeded = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!newsCache || !newsCacheDate || newsCacheDate.getTime() !== today.getTime()) {
      console.log("Refreshing news cache for the day:", today);
      newsCache = generateLatestNews();
      newsCacheDate = today;
    }
    
    return newsCache;
  };

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
      
      // Get fresh news when the selected bank changes
      const latestNews = refreshNewsIfNeeded();
      setNews(latestNews[selectedBank] || []);
      
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
  
  // Add a separate effect for daily news refresh
  useEffect(() => {
    // Set up a timer to check for news updates every hour
    const newsRefreshInterval = setInterval(() => {
      if (selectedBank) {
        const latestNews = refreshNewsIfNeeded();
        setNews(latestNews[selectedBank] || []);
        
        console.log("Checked for news updates for:", selectedBank);
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(newsRefreshInterval);
  }, [selectedBank]);
  
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
