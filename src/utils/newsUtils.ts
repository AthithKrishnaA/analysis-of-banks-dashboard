
import { BankNewsItem } from '../types/stockTypes';
import { addDays } from 'date-fns';

// This will store our news data and refresh daily
let newsCache: Record<string, BankNewsItem[]> | null = null;
let newsCacheDate: Date | null = null;

/**
 * Generate news for each bank with today's date
 * @returns An object with news items for each bank
 */
export const generateLatestNews = (): Record<string, BankNewsItem[]> => {
  const today = new Date();
  const yesterday = addDays(today, -1);
  const twoDaysAgo = addDays(today, -2);
  
  return {
    'SBIN.NS': [
      { 
        title: 'SBI Announces Digital Banking Partnership', 
        summary: 'State Bank of India forms strategic partnership with leading fintech to enhance digital banking services', 
        impact: 'positive', 
        date: today.toISOString(),
        source: 'https://www.sbi.co.in/web/sbi-in-the-news/all-news'
      },
      { 
        title: 'Government Initiatives Boost SBI Rural Banking', 
        summary: 'New government initiatives help SBI expand rural banking reach by 15% in Q1', 
        impact: 'positive', 
        date: yesterday.toISOString(),
        source: 'https://www.sbi.co.in/web/sbi-in-the-news/press-releases'
      },
      { 
        title: 'SBI Reports Strong Q1 Growth', 
        summary: 'State Bank of India reports 18% year-on-year profit growth in Q1 financial results', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString(),
        source: 'https://www.sbi.co.in/web/sbi-in-the-news/latest-news'
      }
    ],
    'AXISBANK.NS': [
      { 
        title: 'Axis Bank Introduces AI-Powered Customer Service', 
        summary: 'New AI chatbot expected to handle 40% of customer queries, reducing wait times significantly', 
        impact: 'positive', 
        date: today.toISOString(),
        source: 'https://www.axisbank.com/about-us/press-releases'
      },
      { 
        title: 'Axis Bank Expands Corporate Banking Division', 
        summary: 'Bank hires 200 new relationship managers to strengthen corporate banking segment', 
        impact: 'positive', 
        date: yesterday.toISOString(),
        source: 'https://www.axisbank.com/about-us/press-releases'
      },
      { 
        title: 'RBI Approves Axis Bank\'s New Digital Banking Initiative', 
        summary: 'Regulatory approval paves way for innovative banking solutions from Axis Bank', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString(),
        source: 'https://www.axisbank.com/about-us/press-releases'
      }
    ],
    'HDFCBANK.NS': [
      { 
        title: 'HDFC Bank Faces Technical Glitches', 
        summary: 'Customers report issues with mobile banking app during weekend maintenance', 
        impact: 'negative', 
        date: today.toISOString(),
        source: 'https://www.hdfcbank.com/personal/resources/about-us/media-room'
      },
      { 
        title: 'HDFC Bank Launches Premium Credit Card', 
        summary: 'New metal credit card targets high-net-worth individuals with exclusive benefits', 
        impact: 'positive', 
        date: yesterday.toISOString(),
        source: 'https://www.hdfcbank.com/personal/resources/about-us/media-room'
      },
      { 
        title: 'HDFC Bank Opens 100 New Rural Branches', 
        summary: 'Expansion aims to enhance financial inclusion in underserved areas', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString(),
        source: 'https://www.hdfcbank.com/personal/resources/about-us/media-room'
      }
    ],
    'KOTAKBANK.NS': [
      { 
        title: 'Kotak Mahindra Bank Updates Mobile Banking App', 
        summary: 'New features include voice banking and enhanced security measures', 
        impact: 'positive', 
        date: today.toISOString(),
        source: 'https://www.kotak.com/en/about-us/media.html'
      },
      { 
        title: 'Kotak Bank Announces Leadership Changes', 
        summary: 'New CTO appointment signals focus on technological innovation', 
        impact: 'neutral', 
        date: yesterday.toISOString(),
        source: 'https://www.kotak.com/en/about-us/media.html'
      },
      { 
        title: 'Kotak Bank Reports Lower NPAs', 
        summary: 'Successful debt recovery strategy leads to significant reduction in non-performing assets', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString(),
        source: 'https://www.kotak.com/en/about-us/media.html'
      }
    ],
    'ICICIBANK.NS': [
      { 
        title: 'ICICI Bank Partners with E-commerce Platform', 
        summary: 'Strategic partnership offers exclusive discounts and cashback for bank customers', 
        impact: 'positive', 
        date: today.toISOString(),
        source: 'https://www.icicibank.com/about-us/article/news'
      },
      { 
        title: 'ICICI Bank Increases Home Loan Interest Rates', 
        summary: 'Bank raises interest rates by 25 basis points following RBI policy changes', 
        impact: 'neutral', 
        date: yesterday.toISOString(),
        source: 'https://www.icicibank.com/about-us/article/news'
      },
      { 
        title: 'ICICI Bank Wins Banking Excellence Award', 
        summary: 'Bank recognized for innovation and customer service at industry awards', 
        impact: 'positive', 
        date: twoDaysAgo.toISOString(),
        source: 'https://www.icicibank.com/about-us/article/news'
      }
    ]
  };
};

/**
 * Refreshes the news cache if needed
 * @returns The latest news data
 */
export const refreshNewsIfNeeded = (): Record<string, BankNewsItem[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!newsCache || !newsCacheDate || newsCacheDate.getTime() !== today.getTime()) {
    console.log("Refreshing news cache for the day:", today);
    newsCache = generateLatestNews();
    newsCacheDate = today;
  }
  
  return newsCache;
};
