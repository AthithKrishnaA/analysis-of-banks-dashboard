
// Indian stock market hours: 9:15 AM to 3:30 PM
export const MARKET_OPEN_TIME = '09:15:00';
export const MARKET_CLOSE_TIME = '15:30:00';

// Indian holidays in 2025
export const INDIAN_MARKET_HOLIDAYS_2025 = [
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

// Base stock values for banks
export const BASE_VALUES = {
  'SBIN.NS': 778.10,
  'AXISBANK.NS': 1013.00,
  'HDFCBANK.NS': 1714.00,
  'KOTAKBANK.NS': 1910.00,
  'ICICIBANK.NS': 1267.00
};

// Bank website URLs for credit card offers and other products
export const BANK_WEBSITES = {
  'SBIN.NS': 'https://sbi.co.in/web/sbi-in-the-news',
  'AXISBANK.NS': 'https://www.axisbank.com/',
  'HDFCBANK.NS': 'https://www.hdfcbank.com/',
  'KOTAKBANK.NS': 'https://www.kotak.com/',
  'ICICIBANK.NS': 'https://www.icicibank.com/'
};
