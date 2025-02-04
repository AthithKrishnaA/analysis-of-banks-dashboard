import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeSentiment } from '@/utils/sentimentAnalysis';

interface StockDataPoint {
  date: string;
  price: number;
}

export const useStockData = (selectedBank: string, onSentimentUpdate?: (sentiment: any, priceChanges: number[]) => void) => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [priceChanges, setPriceChanges] = useState<number[]>([]);
  const { toast } = useToast();

  const fetchLatestPrice = async () => {
    if (!selectedBank) {
      console.error('No bank selected');
      return;
    }

    try {
      console.log('Fetching data for:', selectedBank);
      
      const { data: response, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { symbol: selectedBank }
      });

      if (error) {
        console.error('Error fetching stock data:', error);
        throw error;
      }

      const timeSeries = response['Time Series (5min)'];
      if (!timeSeries) {
        console.error('No time series data received');
        return;
      }

      const latestDataPoints = Object.entries(timeSeries)
        .slice(0, 6)
        .map(([timestamp, values]: [string, any]) => ({
          date: new Date(timestamp).toLocaleTimeString(),
          price: parseFloat(values['4. close'])
        }))
        .reverse();

      setData(latestDataPoints);

      if (latestDataPoints.length >= 2) {
        const priceChange = ((latestDataPoints[latestDataPoints.length - 1].price - latestDataPoints[latestDataPoints.length - 2].price) / latestDataPoints[latestDataPoints.length - 2].price) * 100;
        const newPriceChanges = [...priceChanges.slice(-5), priceChange];
        setPriceChanges(newPriceChanges);

        if (Math.abs(priceChange) > 0.5) {
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
      console.error('Error in fetchLatestPrice:', error);
      toast({
        title: "Error",
        description: "Failed to fetch latest stock price",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (selectedBank) {
      setData([]);
      setPriceChanges([]);
      fetchLatestPrice();
      const interval = setInterval(fetchLatestPrice, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedBank]);

  const priceChange = data.length >= 2 
    ? ((data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price) * 100 
    : 0;

  const sentiment = analyzeSentiment(priceChanges);

  return { data, priceChange, sentiment };
};