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
    // Parse request body with better error handling
    let requestBody;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      requestBody = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { symbol } = requestBody;
    console.log('Processing request for symbol:', symbol);

    if (!symbol) {
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

    // Convert symbol format for Alpha Vantage
    const alphaVantageSymbol = symbol.replace('.NSE', '.BSE');
    console.log('Converted symbol for Alpha Vantage:', alphaVantageSymbol);

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaVantageSymbol}&apikey=${apiKey}`;
    console.log('Fetching data from Alpha Vantage');

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

    // Store data in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: upsertError } = await supabaseClient
      .from('stock_prices')
      .upsert({
        symbol: stockData.symbol,
        date: stockData.date.split('T')[0],
        open_price: stockData.open,
        high_price: stockData.high,
        low_price: stockData.low,
        close_price: stockData.close,
        volume: stockData.volume
      });

    if (upsertError) {
      console.error('Error storing data:', upsertError);
      return new Response(
        JSON.stringify({ 
          error: 'Database error',
          details: upsertError.message
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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