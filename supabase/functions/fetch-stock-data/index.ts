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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!apiKey) {
      throw new Error('API key not configured')
    }

    // Fetch from Alpha Vantage
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
    )
    const data = await response.json()
    
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }

    const timeSeries = data['Time Series (5min)']
    if (!timeSeries) {
      throw new Error('No data available')
    }

    // Process the latest data point
    const latestTimestamp = Object.keys(timeSeries)[0]
    const latestData = timeSeries[latestTimestamp]
    
    const stockData: StockData = {
      symbol,
      date: latestTimestamp,
      open: parseFloat(latestData['1. open']),
      high: parseFloat(latestData['2. high']),
      low: parseFloat(latestData['3. low']),
      close: parseFloat(latestData['4. close']),
      volume: parseInt(latestData['5. volume'])
    }

    // Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: upsertError } = await supabaseClient
      .from('stock_prices')
      .upsert({
        symbol: stockData.symbol,
        date: new Date(stockData.date).toISOString(),
        open_price: stockData.open,
        high_price: stockData.high,
        low_price: stockData.low,
        close_price: stockData.close,
        volume: stockData.volume
      })

    if (upsertError) {
      throw upsertError
    }

    return new Response(JSON.stringify(stockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})