
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';

interface StockDataPoint {
  date: string;
  price: number;
}

const baseValues = {
  'SBIN.NS': 778.10,
  'AXISBANK.NS': 1013.00,
  'HDFCBANK.NS': 1714.00,
  'KOTAKBANK.NS': 1910.00,
  'ICICIBANK.NS': 1267.00
};

export const useStockData = (selectedBank: string, onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();

  const generateMockPrice = (basePrice: number) => {
    const volatility = 0.002; // 0.2% volatility
    const change = basePrice * volatility * (Math.random() - 0.5);
    return basePrice + change;
  };

  const fetchRealData = async () => {
    try {
      console.log('Fetching real data for:', selectedBank);
      
      // Transform the symbol to standard format if needed (remove .NS for some APIs)
      const apiSymbol = selectedBank;
      
      // Try to use the Supabase edge function
      const response = await fetch('https://dlpamlngvsugbqopciqq.supabase.co/functions/v1/fetch-stock-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: apiSymbol }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`Failed to fetch from API: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log('API data received:', apiData);
      
      // Check if the API returned an error
      if (apiData.error) {
        console.error('API returned an error:', apiData.error);
        throw new Error(apiData.error);
      }
      
      // Fall back to mock data if the API doesn't return expected format
      if (!apiData['Time Series (5min)']) {
        console.log('API returned unexpected format, using mock data');
        setUseMockData(true);
        return;
      }
      
      // Process the real data
      const timeSeries = apiData['Time Series (5min)'];
      const timeSeriesEntries = Object.entries(timeSeries);
      
      if (timeSeriesEntries.length === 0) {
        console.log('No time series data available, using mock data');
        setUseMockData(true);
        return;
      }
      
      const newDataPoints = timeSeriesEntries
        .slice(0, 6)
        .map(([timestamp, values]: [string, any]) => ({
          date: new Date(timestamp).toLocaleTimeString(),
          price: parseFloat(values['4. close'])
        }))
        .reverse();
      
      if (newDataPoints.length === 0) {
        console.log('No data points extracted, using mock data');
        setUseMockData(true);
        return;
      }
      
      setData(newDataPoints);
      setUseMockData(false);
      
      // Calculate price changes if we have enough data points
      if (newDataPoints.length >= 2) {
        const newPriceChanges = [];
        for (let i = 1; i < newDataPoints.length; i++) {
          const priceChange = ((newDataPoints[i].price - newDataPoints[i-1].price) / newDataPoints[i-1].price) * 100;
          newPriceChanges.push(priceChange);
        }
        
        setPriceChanges(newPriceChanges);
        
        if (newPriceChanges.length > 0 && Math.abs(newPriceChanges[newPriceChanges.length-1]) > 0.1) {
          const sentiment = analyzeSentiment(newPriceChanges);
          if (onSentimentUpdate) {
            onSentimentUpdate(sentiment, newPriceChanges);
          }
          
          toast({
            title: `${selectedBank} Market Update`,
            description: `${sentiment.emoji} ${Math.abs(newPriceChanges[newPriceChanges.length-1]).toFixed(2)}% ${newPriceChanges[newPriceChanges.length-1] > 0 ? 'increase' : 'decrease'} - ${sentiment.sentiment} sentiment`,
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching real data:', error);
      console.log('Falling back to mock data');
      setUseMockData(true);
    }
  };

  const fetchMockData = () => {
    try {
      console.log('Generating mock data for:', selectedBank);
      const basePrice = baseValues[selectedBank];
      
      // Generate new price point
      const newPrice = generateMockPrice(basePrice);
      const timestamp = new Date().toLocaleTimeString();

      // Update data points
      setData(prevData => {
        const newData = [...prevData, { date: timestamp, price: newPrice }];
        return newData.slice(-6); // Keep last 6 points
      });

      // Calculate price change
      if (data.length >= 2) {
        const priceChange = ((newPrice - data[data.length - 1].price) / data[data.length - 1].price) * 100;
        const newPriceChanges = [...priceChanges.slice(-5), priceChange];
        setPriceChanges(newPriceChanges);

        if (Math.abs(priceChange) > 0.1) {
          const sentiment = analyzeSentiment(newPriceChanges);
          if (onSentimentUpdate) {
            onSentimentUpdate(sentiment, newPriceChanges);
          }

          // Log when price change exceeds 50%
          if (Math.abs(priceChange) > 50) {
            console.log(`High volatility alert: Price change of ${priceChange.toFixed(2)}% exceeded 50% threshold`);
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
      setUseMockData(false);
      
      // Initial data point
      const basePrice = baseValues[selectedBank];
      setData([{ date: new Date().toLocaleTimeString(), price: basePrice }]);
      
      // First, try to fetch real data
      fetchRealData();
      
      // Set up interval for live updates
      const interval = setInterval(() => {
        if (useMockData) {
          fetchMockData();
        } else {
          // Try real data again
          fetchRealData().catch(() => {
            setUseMockData(true);
            fetchMockData();
          });
        }
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [selectedBank, useMockData]);

  const priceChange = data.length >= 2 
    ? ((data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price) * 100 
    : 0;

  const sentiment = analyzeSentiment(priceChanges);

  return { data, priceChange, sentiment };
};
