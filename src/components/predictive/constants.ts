export const bankColors = {
  'HDFC Bank': '#1A1F2C',      // Dark navy blue
  'State Bank of India': '#403E43',  // Dark charcoal
  'ICICI Bank': '#2C1A1F',     // Dark burgundy
  'Axis Bank': '#221F26',      // Dark purple
  'Kotak Bank': '#262A1F'      // Dark forest green
};

export const bankSymbolToName: { [key: string]: string } = {
  'HDFCBANK.NS': 'HDFC Bank',
  'SBIN.NS': 'State Bank of India',
  'ICICIBANK.NS': 'ICICI Bank',
  'AXISBANK.NS': 'Axis Bank',
  'KOTAKBANK.NS': 'Kotak Bank'
};

export const baseValues = {
  'HDFC Bank': 1714.00,
  'State Bank of India': 778.10,
  'ICICI Bank': 1267.00,
  'Axis Bank': 1013.00,
  'Kotak Bank': 1910.00
};

// Volatility factors for each bank
export const volatilityFactors = {
  'HDFC Bank': 0.015,
  'State Bank of India': 0.018,
  'ICICI Bank': 0.016,
  'Axis Bank': 0.017,
  'Kotak Bank': 0.014
};

// Growth trends (annual rate)
export const growthTrends = {
  'HDFC Bank': 0.12,
  'State Bank of India': 0.09,
  'ICICI Bank': 0.11,
  'Axis Bank': 0.10,
  'Kotak Bank': 0.13
};