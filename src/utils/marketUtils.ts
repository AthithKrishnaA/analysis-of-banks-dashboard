
import { format, parse, getDay, isWithinInterval, isWeekend } from 'date-fns';
import { MARKET_OPEN_TIME, MARKET_CLOSE_TIME, INDIAN_MARKET_HOLIDAYS_2025 } from './bankConstants';

/**
 * Checks if the market is currently open
 * @returns boolean indicating if the market is open
 */
export const checkMarketStatus = (): boolean => {
  const now = new Date();
  const currentDay = getDay(now);
  
  if (isWeekend(now)) {
    return false;
  }
  
  const isHoliday = INDIAN_MARKET_HOLIDAYS_2025.some(holiday => 
    holiday.getDate() === now.getDate() && 
    holiday.getMonth() === now.getMonth() && 
    holiday.getFullYear() === now.getFullYear()
  );
  
  if (isHoliday) {
    return false;
  }
  
  const currentTimeStr = format(now, 'HH:mm:ss');
  const openTime = parse(MARKET_OPEN_TIME, 'HH:mm:ss', new Date());
  const closeTime = parse(MARKET_CLOSE_TIME, 'HH:mm:ss', new Date());
  
  const isWithinTradingHours = isWithinInterval(
    parse(currentTimeStr, 'HH:mm:ss', new Date()),
    { start: openTime, end: closeTime }
  );
  
  return isWithinTradingHours;
};

/**
 * Generates a mock price based on the base price
 * @param basePrice The base price to modify
 * @returns A slightly modified price
 */
export const generateMockPrice = (basePrice: number): number => {
  const volatility = 0.002; // 0.2% volatility
  const change = basePrice * volatility * (Math.random() - 0.5);
  return basePrice + change;
};
