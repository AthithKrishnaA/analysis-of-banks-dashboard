
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json();
    console.log('Fetching data for symbol:', symbol);

    // Use the provided API key directly
    const API_KEY = '4EJSR2JEK3F455GU';
    
    // Log the URL we're fetching from
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alpha Vantage API error status:', response.status);
      console.error('Alpha Vantage API error text:', errorText);
      throw new Error(`Alpha Vantage API error: ${response.statusText}, Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received data from Alpha Vantage:', JSON.stringify(data).substring(0, 200) + '...');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-stock-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
