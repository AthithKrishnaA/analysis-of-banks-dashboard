
import { SentimentResult } from '@/types/stockTypes';

export const analyzeSentiment = (priceChanges: number[]): SentimentResult => {
  const averageChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  const volatility = Math.sqrt(
    priceChanges.reduce((sum, change) => sum + Math.pow(change - averageChange, 2), 0) / priceChanges.length
  );

  if (averageChange > 0.5 && volatility < 1) return { sentiment: 'Bullish', emoji: '🚀', color: 'text-green-600' };
  if (averageChange > 0.2) return { sentiment: 'Slightly Bullish', emoji: '📈', color: 'text-green-500' };
  if (averageChange < -0.5 && volatility < 1) return { sentiment: 'Bearish', emoji: '📉', color: 'text-red-600' };
  if (averageChange < -0.2) return { sentiment: 'Slightly Bearish', emoji: '🔻', color: 'text-red-500' };
  if (volatility > 1.5) return { sentiment: 'Volatile', emoji: '⚡', color: 'text-yellow-500' };
  return { sentiment: 'Neutral', emoji: '➖', color: 'text-gray-500' };
};
