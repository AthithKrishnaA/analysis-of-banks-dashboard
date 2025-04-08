
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';
import { StockDataPoint, BankNewsItem } from '@/types/stockTypes';
import { checkMarketStatus, generateMockPrice } from '@/utils/marketUtils';
import { refreshNewsIfNeeded } from '@/utils/newsUtils';
import { BASE_VALUES, BANK_WEBSITES } from '@/utils/bankConstants';

export { BankNewsItem } from '@/types/stockTypes';
export { BANK_WEBSITES } from '@/utils/bankConstants';

export const useStockData = (selectedBank: string, onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const [news, setNews] = useState<BankNewsItem[]>([]);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const { toast } = useToast();

  const checkAndUpdateMarketStatus = () => {
    const marketStatus = checkMarketStatus();
    setIsMarketOpen(marketStatus);
    return marketStatus;
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
      return { price: BASE_VALUES[selectedBank], description: "Market is closed" };
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
    
    const basePrice = BASE_VALUES[selectedBank];
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
      if (!checkAndUpdateMarketStatus()) {
        console.log('Market is closed. Not generating new data.');
        return;
      }
      
      console.log('Generating mock data for:', selectedBank);
      const basePrice = BASE_VALUES[selectedBank];
      
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
    const initialMarketStatus = checkAndUpdateMarketStatus();
    
    if (!initialMarketStatus) {
      toast({
        title: "Market Status",
        description: "The stock market is currently closed. Data will not update until market hours.",
        duration: 5000,
      });
    }
    
    const marketStatusInterval = setInterval(() => {
      checkAndUpdateMarketStatus();
    }, 60000);
    
    if (selectedBank) {
      setData([]);
      setPriceChanges([]);
      
      // Get fresh news when the selected bank changes
      const latestNews = refreshNewsIfNeeded();
      setNews(latestNews[selectedBank] || []);
      
      const basePrice = BASE_VALUES[selectedBank];
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
    bankWebsite: BANK_WEBSITES[selectedBank] || 'https://sbi.co.in/web/sbi-in-the-news',
    toast
  };
};
