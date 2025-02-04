export const bankColors = {
  'HDFC Bank': '#1E40AF',
  'State Bank of India': '#047857',
  'ICICI Bank': '#BE123C',
  'Axis Bank': '#6D28D9',
  'Kotak Bank': '#EA580C'
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