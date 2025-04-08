
export interface StockDataPoint {
  date: string;
  price: number;
}

export interface BankNewsItem {
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  date: string;
  source: string; // URL to the news source
}

export interface SentimentResult {
  sentiment: string;
  emoji: string;
  color: string;
}
