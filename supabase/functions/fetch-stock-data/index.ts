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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders
    })
  }

  try {
    const requestData = await req.json()
    const { symbol } = requestData
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    console.log('Processing request for symbol:', symbol)
    
    if (!apiKey) {
      console.error('API key not configured')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!symbol) {
      console.error('No symbol provided')
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert NSE symbol to BSE format for Alpha Vantage
    const alphaVantageSymbol = symbol.replace('.NSE', '.BSE')
    console.log('Converted symbol for Alpha Vantage:', alphaVantageSymbol)

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaVantageSymbol}&apikey=${apiKey}`
    console.log('Fetching data from Alpha Vantage')
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Supabase Edge Function'
      }
    })
    
    if (!response.ok) {
      console.error('Alpha Vantage API error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ 
          error: `Alpha Vantage API error: ${response.status} ${response.statusText}` 
        }), 
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const data = await response.json()
    console.log('Alpha Vantage response:', JSON.stringify(data))
    
    if (data['Error Message']) {
      console.error('Alpha Vantage error:', data['Error Message'])
      return new Response(
        JSON.stringify({ error: data['Error Message'] }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      console.error('No data available for symbol:', symbol)
      return new Response(
        JSON.stringify({ error: 'No data available for this symbol' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const quote = data['Global Quote']
    const currentDate = new Date().toISOString()
    
    const stockData: StockData = {
      symbol,
      date: currentDate.split('T')[0],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      close: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume'])
    }

    console.log('Processed stock data:', stockData)

    // Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: upsertError } = await supabaseClient
      .from('stock_prices')
      .upsert({
        symbol: stockData.symbol,
        date: stockData.date,
        open_price: stockData.open,
        high_price: stockData.high,
        low_price: stockData.low,
        close_price: stockData.close,
        volume: stockData.volume
      }, {
        onConflict: 'symbol,date'
      })

    if (upsertError) {
      console.error('Error upserting data:', upsertError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to store stock data', 
          details: upsertError.message 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully stored data in Supabase')

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: stockData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})