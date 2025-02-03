import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockData {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders
    });
  }

  try {
    const { symbol } = await req.json();
    console.log('Processing request for symbol:', symbol);

    if (!symbol) {
      console.error('No symbol provided in request body');
      return new Response(
        JSON.stringify({ 
          error: 'Symbol is required',
          details: 'No symbol provided in request body'
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      console.error('API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error',
          details: 'API key not configured'
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching data from Alpha Vantage for symbol:', symbol);
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Alpha Vantage API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          error: 'External API error',
          details: `Alpha Vantage API returned ${response.status}`
        }), 
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Alpha Vantage response:', JSON.stringify(data));

    if (data['Error Message']) {
      return new Response(
        JSON.stringify({ 
          error: 'Alpha Vantage error',
          details: data['Error Message']
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No data available',
          details: `No data found for symbol: ${symbol}`
        }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const quote = data['Global Quote'];
    const currentDate = new Date().toISOString();
    
    const stockData: StockData = {
      symbol,
      date: currentDate,
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      close: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume'])
    };

    return new Response(
      JSON.stringify(stockData), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});