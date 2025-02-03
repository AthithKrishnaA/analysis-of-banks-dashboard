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
    
    console.log('Processing request for symbol:', symbol)
    
    if (!apiKey) {
      console.error('API key not configured')
      throw new Error('API key not configured')
    }

    if (!symbol) {
      console.error('No symbol provided')
      throw new Error('Symbol is required')
    }

    // Fetch from Alpha Vantage
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    console.log('Fetching data from:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Alpha Vantage response:', JSON.stringify(data))
    
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }

    if (!data['Global Quote']) {
      throw new Error('No data available for this symbol')
    }

    const quote = data['Global Quote']
    
    const stockData: StockData = {
      symbol,
      date: new Date().toISOString(),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      close: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume'])
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
      console.error('Error upserting data:', upsertError)
      throw upsertError
    }

    return new Response(JSON.stringify(stockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})