
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import requests
from datetime import datetime
import ipywidgets as widgets
from IPython.display import display, clear_output
import time

# Alpha Vantage API Configuration
API_KEY = '4EJSR2JEK3F455GU'
BANKS = {
    'SBI': 'SBIN.BSE',
    'HDFC': 'HDFCBANK.BSE',
    'KOTAK': 'KOTAKBANK.BSE',
    'AXIS': 'AXISBANK.BSE',
    'ICICI': 'ICICIBANK.BSE'
}

def fetch_stock_data(symbol):
    """Fetch real-time stock data from Alpha Vantage"""
    try:
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}'
        response = requests.get(url)
        data = response.json()
        return data.get('Global Quote', {})
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return {}

class BankDashboard:
    def __init__(self):
        self.data = {}
        self.fig = None
        self.update_button = widgets.Button(description='Update Data')
        self.status_label = widgets.Label(value='Ready to fetch data')
        self.last_update_label = widgets.Label(value='Not updated yet')
        
        # Create tabs for different views
        self.tab = widgets.Tab()
        self.tab.children = [
            widgets.Output(),  # Price Tab
            widgets.Output(),  # Performance Tab
            widgets.Output(),  # Volume Tab
        ]
        self.tab.set_title(0, 'Prices')
        self.tab.set_title(1, 'Performance')
        self.tab.set_title(2, 'Volume')
        
        # Setup button click handler
        self.update_button.on_click(self.update_dashboard)
        
        # Display dashboard components
        display(widgets.VBox([
            self.update_button,
            self.status_label,
            self.last_update_label,
            self.tab
        ]))
    
    def fetch_all_data(self):
        """Fetch data for all banks"""
        self.data = {}
        for bank, symbol in BANKS.items():
            self.status_label.value = f'Fetching data for {bank}...'
            quote = fetch_stock_data(symbol)
            if quote:
                self.data[bank] = {
                    'price': float(quote.get('05. price', 0)),
                    'change': float(quote.get('09. change', 0)),
                    'change_percent': float(quote.get('10. change percent', '0').strip('%')),
                    'volume': int(quote.get('06. volume', 0))
                }
            time.sleep(12)  # Respect API rate limits
        
        return pd.DataFrame(self.data).T
    
    def create_price_chart(self, df):
        """Create price comparison chart"""
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=df.index,
            y=df['price'],
            text=df['price'].round(2),
            textposition='auto',
            marker_color='rgb(55, 83, 109)'
        ))
        fig.update_layout(
            title='Bank Stock Prices (₹)',
            template='plotly_white',
            height=500
        )
        return fig
    
    def create_performance_chart(self, df):
       
        fig = go.Figure()
        colors = ['red' if x < 0 else 'green' for x in df['change_percent']]
        fig.add_trace(go.Bar(
            x=df.index,
            y=df['change_percent'],
            text=df['change_percent'].round(2),
            textposition='auto',
            marker_color=colors
        ))
        fig.update_layout(
            title='Daily Performance (%)',
            template='plotly_white',
            height=500
        )
        return fig
    
    def create_volume_chart(self, df):
        """Create volume comparison chart"""
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=df.index,
            y=df['volume'],
            text=[f'{v:,}' for v in df['volume']],
            textposition='auto',
            marker_color='rgb(158, 202, 225)'
        ))
        fig.update_layout(
            title='Trading Volume',
            template='plotly_white',
            height=500
        )
        return fig
    
    def update_dashboard(self, _):
        """Update all dashboard components"""
        try:
            # Fetch new data
            df = self.fetch_all_data()
            
            # Clear previous outputs
            for output in self.tab.children:
                output.clear_output()
            
            # Update charts in tabs
            with self.tab.children[0]:
                fig_price = self.create_price_chart(df)
                fig_price.show()
            
            with self.tab.children[1]:
                fig_perf = self.create_performance_chart(df)
                fig_perf.show()
            
            with self.tab.children[2]:
                fig_vol = self.create_volume_chart(df)
                fig_vol.show()
            
            # Update status
            self.status_label.value = 'Data updated successfully'
            self.last_update_label.value = f'Last update: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
            
        except Exception as e:
            self.status_label.value = f'Error updating dashboard: {str(e)}'

# Create and display dashboard
dashboard = BankDashboard()


# In[3]:


import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import ipywidgets as widgets
from IPython.display import display, clear_output
import requests
from datetime import datetime

class LoanInterestDashboard:
    def __init__(self):
        self.loan_data = {
            'Home Loan': {
                'SBI': 8.75,
                'HDFC': 8.90,
                'ICICI': 9.00,
                'AXIS': 8.85,
                'KOTAK': 8.95
            },
            'Personal Loan': {
                'SBI': 11.05,
                'HDFC': 11.50,
                'ICICI': 11.25,
                'AXIS': 11.75,
                'KOTAK': 11.45
            },
            'Car Loan': {
                'SBI': 8.95,
                'HDFC': 9.25,
                'ICICI': 9.30,
                'AXIS': 9.15,
                'KOTAK': 9.20
            },
            'Education Loan': {
                'SBI': 8.85,
                'HDFC': 9.55,
                'ICICI': 9.45,
                'AXIS': 9.70,
                'KOTAK': 9.60
            },
            'Business Loan': {
                'SBI': 14.85,
                'HDFC': 15.25,
                'ICICI': 15.45,
                'AXIS': 15.70,
                'KOTAK': 15.60
            }
        }
        
        # Create widgets
        self.loan_type_dropdown = widgets.Dropdown(
            options=list(self.loan_data.keys()),
            description='Loan Type:',
            style={'description_width': 'initial'}
        )
        
        # Create tabs for different visualizations
        self.tab = widgets.Tab()
        self.tab.children = [
            widgets.Output(),  # Comparison Chart
            widgets.Output(),  # Pie Chart
            widgets.Output(),  # Trend Analysis
            widgets.Output()   # Summary Table
        ]
        self.tab.set_title(0, 'Bank Comparison')
        self.tab.set_title(1, 'Market Share')
        self.tab.set_title(2, 'Rate Distribution')
        self.tab.set_title(3, 'Summary Table')
        
        # Setup event handler
        self.loan_type_dropdown.observe(self.update_dashboard, names='value')
        
        # Display dashboard components
        display(widgets.VBox([
            self.loan_type_dropdown,
            self.tab
        ]))
        
        # Initial update
        self.update_dashboard(None)
    
    def create_comparison_chart(self, loan_type):
        """Create bar chart comparing interest rates across banks"""
        banks = list(self.loan_data[loan_type].keys())
        rates = list(self.loan_data[loan_type].values())
        
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=banks,
            y=rates,
            text=[f'{rate:.2f}%' for rate in rates],
            textposition='auto',
            marker_color='rgb(55, 83, 109)'
        ))
        
        fig.update_layout(
            title=f'{loan_type} Interest Rates Comparison',
            yaxis_title='Interest Rate (%)',
            template='plotly_white',
            height=500
        )
        
        return fig
    
    def create_pie_chart(self, loan_type):
        """Create pie chart showing market distribution"""
        banks = list(self.loan_data[loan_type].keys())
        rates = list(self.loan_data[loan_type].values())
        
        fig = go.Figure(data=[go.Pie(
            labels=banks,
            values=[100/rate for rate in rates],  # Inverse relationship between rate and market share
            hole=.3
        )])
        
        fig.update_layout(
            title=f'Estimated Market Share Distribution - {loan_type}',
            template='plotly_white',
            height=500
        )
        
        return fig
    
    def create_trend_chart(self, loan_type):
        """Create violin plot showing rate distribution"""
        fig = go.Figure()
        
        rates = list(self.loan_data[loan_type].values())
        banks = list(self.loan_data[loan_type].keys())
        
        fig.add_trace(go.Violin(
            y=rates,
            box_visible=True,
            line_color='rgb(55, 83, 109)',
            fillcolor='rgb(158, 202, 225)',
            opacity=0.6
        ))
        
        fig.update_layout(
            title=f'Interest Rate Distribution - {loan_type}',
            yaxis_title='Interest Rate (%)',
            template='plotly_white',
            height=500
        )
        
        return fig
    
    def create_summary_table(self, loan_type):
        """Create summary table with key metrics"""
        rates = list(self.loan_data[loan_type].values())
        summary_data = {
            'Metric': ['Lowest Rate', 'Highest Rate', 'Average Rate', 'Rate Spread'],
            'Value': [
                f'{min(rates):.2f}%',
                f'{max(rates):.2f}%',
                f'{sum(rates)/len(rates):.2f}%',
                f'{max(rates) - min(rates):.2f}%'
            ]
        }
        
        fig = go.Figure(data=[go.Table(
            header=dict(values=list(summary_data.keys()),
                       fill_color='rgb(55, 83, 109)',
                       font=dict(color='white'),
                       align='left'),
            cells=dict(values=[summary_data['Metric'], summary_data['Value']],
                      fill_color='rgb(245, 245, 245)',
                      align='left'))
        ])
        
        fig.update_layout(
            title=f'Summary Statistics - {loan_type}',
            height=300
        )
        
        return fig
    
    def update_dashboard(self, change):
        """Update all dashboard components"""
        loan_type = self.loan_type_dropdown.value
        
        # Clear previous outputs
        for output in self.tab.children:
            output.clear_output()
        
        # Update charts in tabs
        with self.tab.children[0]:
            fig_comparison = self.create_comparison_chart(loan_type)
            fig_comparison.show()
        
        with self.tab.children[1]:
            fig_pie = self.create_pie_chart(loan_type)
            fig_pie.show()
        
        with self.tab.children[2]:
            fig_trend = self.create_trend_chart(loan_type)
            fig_trend.show()
        
        with self.tab.children[3]:
            fig_summary = self.create_summary_table(loan_type)
            fig_summary.show()

# Create and display dashboard
dashboard = LoanInterestDashboard()


# In[ ]:





# In[ ]:





# In[5]:


get_ipython().run_line_magic('pip', 'install alpha-vantage')


# In[ ]:





# In[8]:


get_ipython().run_line_magic('pip', 'install dash dash-bootstrap-components plotly')


# In[3]:


# app.py
from flask import Flask, render_template, jsonify, request
from alpha_vantage.timeseries import TimeSeries
import pandas as pd
import threading
import time

app = Flask(__name__)
API_KEY = '4EJSR2JEK3F455GU'
BANKS = {
    'State Bank of India': 'SBIN.BSE',
    'HDFC Bank': 'HDFCBANK.BSE',
    'ICICI Bank': 'ICICIBANK.BSE',
    'Axis Bank': 'AXISBANK.BSE',
    'Kotak Bank': 'KOTAKBANK.BSE'
}

# Initialize portfolio (in-memory storage for demo)
portfolio = {
    'State Bank of India': {'quantity': 150, 'avg_price': 550},
    'HDFC Bank': {'quantity': 75, 'avg_price': 1450},
    'ICICI Bank': {'quantity': 200, 'avg_price': 750},
    'Axis Bank': {'quantity': 300, 'avg_price': 650},
    'Kotak Bank': {'quantity': 100, 'avg_price': 1800}
}

ts = TimeSeries(key=API_KEY, output_format='pandas')

def fetch_live_data():
    """Fetch live data for all stocks"""
    data = {}
    for bank, symbol in BANKS.items():
        try:
            quote, _ = ts.get_quote_endpoint(symbol)
            data[bank] = {
                'price': float(quote['05. price']),
                'change': float(quote['09. change']),
                'volume': int(quote['06. volume'])
            }
        except Exception as e:
            print(f"Error fetching data for {bank}: {str(e)}")
    return data

def background_updater():
    """Background thread for updating data"""
    while True:
        global latest_data
        latest_data = fetch_live_data()
        time.sleep(300)  # Update every 5 minutes

# Start background thread
latest_data = fetch_live_data()
thread = threading.Thread(target=background_updater)
thread.daemon = True
thread.start()

@app.route('/')
def index():
    """Main dashboard route"""
    return render_template('index.html', banks=list(BANKS.keys()))

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """Get portfolio data"""
    portfolio_values = []
    total_value = 0
    total_gain = 0
    
    for bank, holdings in portfolio.items():
        current_price = latest_data[bank]['price']
        quantity = holdings['quantity']
        value = quantity * current_price
        cost = quantity * holdings['avg_price']
        gain = value - cost
        
        portfolio_values.append({
            'bank': bank,
            'quantity': quantity,
            'price': current_price,
            'value': value,
            'gain': gain
        })
        
        total_value += value
        total_gain += gain
    
    return jsonify({
        'stocks': portfolio_values,
        'total_value': total_value,
        'total_gain': total_gain
    })

@app.route('/api/update_holding', methods=['POST'])
def update_holding():
    """Update portfolio holdings"""
    data = request.json
    bank = data['bank']
    new_quantity = int(data['quantity'])
    
    if bank in portfolio:
        portfolio[bank]['quantity'] = new_quantity
        return jsonify({'status': 'success'})
    
    return jsonify({'status': 'error', 'message': 'Invalid bank'})

@app.route('/api/historical/<symbol>')
def historical_data(symbol):
    """Get historical data for a symbol"""
    bank = [k for k, v in BANKS.items() if v == symbol]
    if not bank:
        return jsonify({'error': 'Invalid symbol'}), 404
    
    try:
        data, _ = ts.get_daily(symbol, outputsize='compact')
        return jsonify({
            'dates': data.index.strftime('%Y-%m-%d').tolist(),
            'prices': data['4. close'].tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


# In[5]:


# //html
# //<!-- templates/index.html -->
# <!DOCTYPE html>
# <html>
# <head>
#     <title>Live Portfolio Tracker</title>
#     <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
#     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
#     <style>
#         body { font-family: Arial, sans-serif; padding: 20px; }
#         .dashboard { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
#         .controls { background: #f5f5f5; padding: 20px; border-radius: 8px; }
#         .chart { height: 400px; margin-bottom: 20px; }
#         table { width: 100%; border-collapse: collapse; }
#         th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
#         .positive { color: green; }
#         .negative { color: red; }
#     </style>
# </head>
# <body>
#     <h1>Live Indian Banks Portfolio Tracker</h1>
#     <div class="dashboard">
#         <div class="controls">
#             <h2>Portfolio Controls</h2>
#             <div id="holdings"></div>
#             <button onclick="updateData()">Refresh Data</button>
#         </div>
#         <div>
#             <div id="priceChart" class="chart"></div>
#             <div id="allocationChart" class="chart"></div>
#             <div id="stats"></div>
#         </div>
#     </div>

#     <script>
#         let portfolioData = {}

#         function updateHoldingsUI() {
#             let html = '<h3>Stock Holdings</h3>'
#             Object.values(portfolioData.stocks).forEach(stock => {
#                 html += `
#                 <div>
#                     <label>${stock.bank}:</label>
#                     <input type="number" value="${stock.quantity}" 
#                            onchange="updateHolding('${stock.bank}', this.value)">
#                 </div>`
#             })
#             document.getElementById('holdings').innerHTML = html
#         }

#         function updateHolding(bank, quantity) {
#             axios.post('/api/update_holding', {
#                 bank: bank,
#                 quantity: quantity
#             }).then(updateData)
#         }

#         function updateData() {
#             // Update portfolio data
#             axios.get('/api/portfolio')
#                 .then(response => {
#                     portfolioData = response.data
#                     updateCharts()
#                     updateStats()
#                     updateHoldingsUI()
#                 })

#             // Update historical charts
#             Object.entries({{ banks|tojson }}).forEach(([bank, symbol]) => {
#                 axios.get(`/api/historical/${symbol}`)
#                     .then(response => {
#                         updatePriceChart(bank, response.data)
#                     })
#             })
#         }

#         function updateCharts() {
#             // Allocation Pie Chart
#             const allocationData = [{
#                 values: portfolioData.stocks.map(s => s.value),
#                 labels: portfolioData.stocks.map(s => s.bank),
#                 type: 'pie',
#                 hole: 0.4
#             }]

#             Plotly.newPlot('allocationChart', allocationData, {
#                 title: 'Portfolio Allocation'
#             })
#         }

#         function updatePriceChart(bank, historical) {
#             // Price Line Chart
#             const trace = {
#                 x: historical.dates,
#                 y: historical.prices,
#                 mode: 'lines',
#                 name: bank
#             }

#             Plotly.addTraces('priceChart', [trace])
#         }

#         function updateStats() {
#             let html = `
#             <h3>Portfolio Summary</h3>
#             <table>
#                 <tr>
#                     <th>Bank</th>
#                     <th>Value</th>
#                     <th>Gain/Loss</th>
#                 </tr>`

#             portfolioData.stocks.forEach(stock => {
#                 html += `
#                 <tr>
#                     <td>${stock.bank}</td>
#                     <td>₹${stock.value.toLocaleString()}</td>
#                     <td class="${stock.gain >= 0 ? 'positive' : 'negative'}">
#                         ₹${stock.gain.toLocaleString()}
#                     </td>
#                 </tr>`
#             })

#             html += `
#                 <tr>
#                     <th>Total</th>
#                     <td>₹${portfolioData.total_value.toLocaleString()}</td>
#                     <td class="${portfolioData.total_gain >= 0 ? 'positive' : 'negative'}">
#                         ₹${portfolioData.total_gain.toLocaleString()}
#                     </td>
#                 </tr>
#             </table>`

#             document.getElementById('stats').innerHTML = html
#         }

#         // Initial load
#         document.addEventListener('DOMContentLoaded', () => {
#             Plotly.newPlot('priceChart', [], { title: 'Historical Prices' })
#             updateData()
#             setInterval(updateData, 300000) // Auto-update every 5 minutes
#         })
#     </script>
# </body>
# </html>


# In[ ]:





# In[7]:


# bank_dashboard.py
import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objs as go
import plotly.express as px
from prophet import Prophet

# ========== CONFIGURATION ==========
BANKS = {
    'HDFC': 'HDFCBANK.NS',
    'ICICI': 'ICICIBANK.NS', 
    'AXIS': 'AXISBANK.NS',
    'KOTAK': 'KOTAKBANK.NS'
}

ECONOMIC_PARAMS = {
    'Optimistic': {'growth': 1.3, 'volatility': 0.8},
    'Base': {'growth': 1.0, 'volatility': 1.0},
    'Stress': {'growth': 0.7, 'volatility': 1.3}
}

# ========== CACHED FUNCTIONS ==========
@st.cache_data
def load_data():
    data = []
    for bank, ticker in BANKS.items():
        df = yf.download(ticker, period='10y', auto_adjust=True)
        df['Bank'] = bank
        data.append(df)
    return pd.concat(data)

@st.cache_resource
def create_prophet_model(df):
    model = Prophet(
        seasonality_mode='multiplicative',
        changepoint_prior_scale=0.8,
        yearly_seasonality=True,
        daily_seasonality=False,
        growth='linear'
    )
    model.fit(df.rename(columns={'Date': 'ds', 'Close': 'y'}))
    return model

# ========== STREAMLIT UI ==========
st.title('🏦 Indian Bank Stock Predictor 2034')
st.markdown("Interactive forecast with economic scenarios")

# Sidebar controls
with st.sidebar:
    st.header("Controls")
    selected_banks = st.multiselect(
        'Select Banks', 
        list(BANKS.keys()), 
        default=['HDFC']
    )
    forecast_years = st.slider('Forecast Years', 1, 10, 5)
    scenario = st.radio(
        'Economic Scenario', 
        list(ECONOMIC_PARAMS.keys()), 
        index=1
    )

# Load data
bank_data = load_data()

# ========== VISUALIZATIONS ==========
tab1, tab2, tab3 = st.tabs(["Historical Prices", "AI Forecast", "Monte Carlo"])

with tab1:
    st.subheader("Historical Performance")
    fig = go.Figure()
    for bank in selected_banks:
        df = bank_data[bank_data['Bank'] == bank]
        fig.add_trace(go.Scatter(
            x=df.index, 
            y=df['Close'], 
            name=bank,
            line=dict(width=2)
        ))
    fig.update_layout(template='plotly_dark', height=600)
    st.plotly_chart(fig, use_container_width=True)

with tab2:
    st.subheader(f"{forecast_years}-Year AI Projection")
    for bank in selected_banks:
        df = bank_data[bank_data['Bank'] == bank].reset_index()
        model = create_prophet_model(df)
        future = model.make_future_dataframe(periods=forecast_years*365)
        forecast = model.predict(future)
        
        # Apply scenario adjustment
        growth_factor = ECONOMIC_PARAMS[scenario]['growth']
        forecast['yhat'] *= (1 + 0.13) ** np.arange(len(forecast)) * growth_factor
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=forecast['ds'], 
            y=forecast['yhat'],
            name=f'{bank} Forecast',
            line=dict(width=3, dash='dot')
        ))
        fig.update_layout(
            template='plotly_dark',
            height=600,
            title=f'{bank} Projection ({scenario} Scenario)'
        )
        st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.subheader("Risk Analysis: Monte Carlo Simulation")
    for bank in selected_banks:
        df = bank_data[bank_data['Bank'] == bank]['Close']
        returns = np.log(1 + df.pct_change().dropna())
        
        params = ECONOMIC_PARAMS[scenario]
        daily_growth = (1.13 ** (1/252) - 1) * params['growth']
        sigma = returns.std() * params['volatility']
        
        days = forecast_years * 252
        paths = np.zeros((days, 500))
        paths[0] = df[-1]
        
        for t in range(1, days):
            shocks = np.random.normal(daily_growth, sigma, 500)
            paths[t] = paths[t-1] * np.exp(shocks)
        
        fig = go.Figure()
        for i in range(50):
            fig.add_trace(go.Scatter(
                y=paths[:, i],
                line=dict(width=0.5, color='grey'),
                showlegend=False
            ))
        fig.add_trace(go.Scatter(
            y=np.median(paths, axis=1),
            line=dict(color='gold', width=3),
            name='Median Path'
        ))
        fig.update_layout(
            template='plotly_dark',
            height=500,
            title=f'{bank} Price Paths ({scenario})'
        )
        st.plotly_chart(fig, use_container_width=True)


# In[8]:


# %% [markdown]
# 📊 **MAIN DASHBOARD CODE** (Run this second)
# %%
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objs as go
import plotly.express as px
from prophet import Prophet
import ipywidgets as widgets
from IPython.display import display, clear_output

# ========== DATA CONFIG ==========
BANKS = {
    'HDFC': 'HDFCBANK.NS',
    'ICICI': 'ICICIBANK.NS', 
    'AXIS': 'AXISBANK.NS',
    'KOTAK': 'KOTAKBANK.NS'
}

# ========== CONTROLS ==========
bank_selector = widgets.SelectMultiple(
    options=list(BANKS.keys()),
    value=['HDFC'],
    description='Banks:',
    layout={'width': '300px'}
)

forecast_slider = widgets.IntSlider(
    value=5,
    min=1,
    max=10,
    description='Years:'
)

scenario_buttons = widgets.ToggleButtons(
    options=['Optimistic', 'Base', 'Stress'],
    description='Scenario:'
)

# ========== VISUALIZATION ENGINE ==========
def create_dashboard(selected_banks, forecast_years, scenario):
    with output:
        clear_output(wait=True)
        
        # 1. Historical Prices
        fig1 = go.Figure()
        for bank in selected_banks:
            df = bank_data[bank_data['Bank'] == bank]
            fig1.add_trace(go.Scatter(
                x=df.index, 
                y=df['Close'], 
                name=bank,
                line=dict(width=2)
            ))
        fig1.update_layout(title='Live Price Movement', template='plotly_dark')
        display(fig1)
        
        # 2. Forecast Visualization
        fig2 = go.Figure()
        for bank in selected_banks:
            # Get data
            df = bank_data[bank_data['Bank'] == bank].reset_index()
            df = df.rename(columns={'Date': 'ds', 'Close': 'y'})
            
            # Configure model with scenario
            params = {
                'changepoint_prior_scale': 0.05 if scenario=='Optimistic' else 0.5,
                'seasonality_mode': 'multiplicative'
            }
            
            # Train and predict
            model = Prophet(**params)
            model.fit(df)
            future = model.make_future_dataframe(periods=forecast_years*365)
            forecast = model.predict(future)
            
            # Add traces
            fig2.add_trace(go.Scatter(
                x=forecast['ds'], 
                y=forecast['yhat'],
                name=f'{bank} Forecast',
                line=dict(dash='dot')
            ))
            
        fig2.update_layout(title=f'{forecast_years}-Year Projection', template='plotly_dark')
        display(fig2)

        # 3. Correlation Matrix
        corr_df = bank_data.pivot(columns='Bank', values='Close').corr()
        fig3 = px.imshow(
            corr_df,
            text_auto=True,
            color_continuous_scale='Viridis',
            title='Real-time Correlations'
        )
        display(fig3)

# ========== DATA LOADER ==========
output = widgets.Output()
display(widgets.VBox([
    widgets.HBox([bank_selector, forecast_slider, scenario_buttons]),
    output
]))

# Load initial data
bank_data = pd.concat([yf.download(ticker, period='5y').assign(Bank=bank) 
                      for bank, ticker in BANKS.items()])

# Set up interactivity
def update_dashboard(change):
    create_dashboard(
        bank_selector.value,
        forecast_slider.value,
        scenario_buttons.value
    )

bank_selector.observe(update_dashboard, names='value')
forecast_slider.observe(update_dashboard, names='value')
scenario_buttons.observe(update_dashboard, names='value')

# Initial render
create_dashboard(bank_selector.value, forecast_slider.value, scenario_buttons.value)


# In[10]:


import plotly.graph_objects as go
from alpha_vantage.timeseries import TimeSeries

ts = TimeSeries(key='4EJSR2JEK3F455GU', output_format='pandas')

def create_candlestick_chart(symbol='SBIN.BSE'):
    data, meta_data = ts.get_daily(symbol=symbol, outputsize='full')
    
    # Calculate moving averages
    data['50_MA'] = data['4. close'].rolling(50).mean()
    data['200_MA'] = data['4. close'].rolling(200).mean()
    
    fig = go.Figure(data=[
        go.Candlestick(
            x=data.index,
            open=data['1. open'],
            high=data['2. high'],
            low=data['3. low'],
            close=data['4. close'],
            name='Price'
        ),
        go.Scatter(
            x=data.index,
            y=data['50_MA'],
            line=dict(color='orange', width=2),
            name='50-day MA'
        ),
        go.Scatter(
            x=data.index,
            y=data['200_MA'],
            line=dict(color='blue', width=2),
            name='200-day MA'
        )
    ])
    
    fig.update_layout(
        title=f'{meta_data["2. Symbol"]} Candlestick Chart',
        xaxis_title='Date',
        yaxis_title='Price (INR)',
        template='plotly_dark',
        hovermode="x unified",
        xaxis_rangeslider_visible=False
    )
    
    # Add range selector
    fig.update_xaxes(
        rangeselector=dict(
            buttons=list([
                dict(count=1, label="1M", step="month", stepmode="backward"),
                dict(count=6, label="6M", step="month", stepmode="backward"),
                dict(count=1, label="YTD", step="year", stepmode="todate"),
                dict(step="all")
            ])
        )
    )
    
    return fig

# Interactive widget for bank selection
interact(create_candlestick_chart, symbol=list(BANKS.values()))


# In[11]:


# Live Indian Banks Stock Visualizer
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from ipywidgets import interact, widgets
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.techindicators import TechIndicators

# Initialize API clients
API_KEY = '4EJSR2JEK3F455GU'
ts = TimeSeries(key=API_KEY, output_format='pandas')
ti = TechIndicators(key=API_KEY, output_format='pandas')

# Bank configuration
BANKS = {
    'State Bank of India': 'SBIN.BSE',
    'HDFC Bank': 'HDFCBANK.BSE',
    'ICICI Bank': 'ICICIBANK.BSE', 
    'Axis Bank': 'AXISBANK.BSE',
    'Kotak Mahindra': 'KOTAKBANK.BSE'
}

def create_combined_chart(bank_name):
    """Create interactive price-volume-RSI chart"""
    symbol = BANKS[bank_name]
    
    # Get data
    prices, _ = ts.get_daily(symbol, outputsize='compact')
    rsi, _ = ti.get_rsi(symbol)
    
    # Create figure
    fig = go.Figure().set_subplots(rows=3, cols=1, shared_xaxes=True,
                                  row_heights=[0.6, 0.2, 0.2],
                                  vertical_spacing=0.05)
    
    # Candlestick chart
    fig.add_trace(go.Candlestick(
        x=prices.index,
        open=prices['1. open'],
        high=prices['2. high'],
        low=prices['3. low'],
        close=prices['4. close'],
        name='Price'
    ), row=1, col=1)
    
    # Volume chart
    fig.add_trace(go.Bar(
        x=prices.index,
        y=prices['5. volume'],
        name='Volume',
        marker_color='rgba(100, 150, 200, 0.6)'
    ), row=2, col=1)
    
    # RSI chart
    fig.add_trace(go.Scatter(
        x=rsi.index,
        y=rsi['RSI'],
        line=dict(color='purple'),
        name='RSI'
    ), row=3, col=1)
    
    # Layout configuration
    fig.update_layout(
        title=f'{bank_name} Analysis',
        height=800,
        template='plotly_dark',
        hovermode="x unified",
        xaxis_rangeslider_visible=False
    )
    
    # Add RSI reference lines
    fig.add_hline(y=30, line_dash="dot", row=3, col=1,
                 annotation_text="Oversold", line_color="green")
    fig.add_hline(y=70, line_dash="dot", row=3, col=1,
                 annotation_text="Overbought", line_color="red")
    
    return fig

# Create interactive widget
interact(create_combined_chart, bank_name=list(BANKS.keys()))


# In[12]:


# Advanced Financial Dashboard with Plotly
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from alpha_vantage.timeseries import TimeSeries

# Initialize API
ts = TimeSeries(key='4EJSR2JEK3F455GU', output_format='pandas')

def advanced_stock_analysis(symbol='SBIN.BSE'):
    # Fetch data
    data, _ = ts.get_daily(symbol, outputsize='full')
    data = data.sort_index()
    
    # Calculate technical indicators
    data['50_MA'] = data['4. close'].rolling(50).mean()
    data['200_MA'] = data['4. close'].rolling(200).mean()
    data['RSI'] = calculate_rsi(data['4. close'])
    data['MACD'], data['Signal'] = calculate_macd(data['4. close'])
    data['Upper_BB'], data['Lower_BB'] = calculate_bollinger_bands(data['4. close'])
    
    # Create figure
    fig = make_subplots(rows=4, cols=1, shared_xaxes=True,
                       vertical_spacing=0.03,
                       row_heights=[0.5, 0.15, 0.15, 0.2],
                       specs=[[{"type": "Candlestick"}],
                              [{"type": "Scatter"}],
                              [{"type": "Bar"}],
                              [{"type": "Scatter"}]])
    
    # 1. Candlestick Chart with Indicators
    fig.add_trace(go.Candlestick(
        x=data.index,
        open=data['1. open'],
        high=data['2. high'],
        low=data['3. low'],
        close=data['4. close'],
        name='Price'
    ), row=1, col=1)
    
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['50_MA'],
        line=dict(color='orange', width=1.5),
        name='50 MA'
    ), row=1, col=1)
    
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['200_MA'],
        line=dict(color='blue', width=1.5),
        name='200 MA'
    ), row=1, col=1)
    
    # 2. Bollinger Bands
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['Upper_BB'],
        line=dict(color='gray', width=1),
        name='Upper BB'
    ), row=1, col=1)
    
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['Lower_BB'],
        line=dict(color='gray', width=1),
        name='Lower BB',
        fill='tonexty'
    ), row=1, col=1)
    
    # 3. MACD
    fig.add_trace(go.Bar(
        x=data.index,
        y=data['MACD'] - data['Signal'],
        name='MACD Histogram',
        marker_color=np.where((data['MACD'] - data['Signal']) > 0, 'green', 'red')
    ), row=2, col=1)
    
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['MACD'],
        line=dict(color='blue', width=1.5),
        name='MACD'
    ), row=2, col=1)
    
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['Signal'],
        line=dict(color='orange', width=1.5),
        name='Signal Line'
    ), row=2, col=1)
    
    # 4. RSI
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['RSI'],
        line=dict(color='purple', width=1.5),
        name='RSI'
    ), row=3, col=1)
    
    # 5. Volume Profile
    fig.add_trace(go.Bar(
        x=data.index,
        y=data['5. volume'],
        name='Volume',
        marker_color='rgba(100, 180, 250, 0.6)'
    ), row=4, col=1)
    
    # Add annotations
    annotations = [
        dict(x=data.index[-30], y=data['4. close'].max(),
             xref="x", yref="y",
             text="Resistance Level",
             showarrow=True,
             arrowhead=2),
        dict(x=data.index[-10], y=data['4. close'].min(),
             xref="x", yref="y",
             text="Support Level",
             showarrow=True,
             arrowhead=2)
    ]
    
    # Layout configuration
    fig.update_layout(
        title=f'Advanced Analysis - {symbol}',
        height=1000,
        template='plotly_dark',
        hovermode="x unified",
        xaxis_rangeslider_visible=False,
        annotations=annotations,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )
    
    # Range selector buttons
    fig.update_xaxes(
        rangeselector=dict(
            buttons=list([
                dict(count=1, label="1M", step="month", stepmode="backward"),
                dict(count=6, label="6M", step="month", stepmode="backward"),
                dict(count=1, label="YTD", step="year", stepmode="todate"),
                dict(step="all")
            ])
        )
    )
    
    # Add technical indicator reference lines
    fig.add_hline(y=70, row=3, line_dash="dash", line_color="red")
    fig.add_hline(y=30, row=3, line_dash="dash", line_color="green")
    
    # Add custom hover template
    fig.update_traces(
        hovertemplate="<br>".join([
            "Date: %{x}",
            "Open: %{open}",
            "High: %{high}",
            "Low: %{low}",
            "Close: %{close}"
        ])
    )
    
    # Add volume profile analysis
    fig.add_trace(go.Scatter(
        x=data.index,
        y=data['4. close'].rolling(20).mean(),
        line=dict(color='yellow', width=1),
        name='20 MA',
        visible='legendonly'
    ), row=1, col=1)
    
    return fig

# Technical indicator calculations
def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(series, slow=26, fast=12, signal=9):
    ema_fast = series.ewm(span=fast).mean()
    ema_slow = series.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    signal_line = macd.ewm(span=signal).mean()
    return macd, signal_line

def calculate_bollinger_bands(series, window=20, num_std=2):
    rolling_mean = series.rolling(window).mean()
    rolling_std = series.rolling(window).std()
    upper = rolling_mean + (rolling_std * num_std)
    lower = rolling_mean - (rolling_std * num_std)
    return upper, lower

# Run the analysis
advanced_stock_analysis().show()


# In[14]:


import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
import random
from datetime import datetime

# Generate synthetic banking data
def generate_bank_data():
    dates = pd.date_range('2020-01-01', '2024-01-01', freq='Q')
    return {
        'Quarter': dates,
        'NPA_Ratio': np.clip(np.random.normal(4.5, 1.5, len(dates)),  # In percentage
        'Deposits (Cr)': np.random.randint(50000, 100000, len(dates)),
        'Advances (Cr)': np.random.randint(40000, 90000, len(dates)),
        'CASA_Ratio': np.random.uniform(35, 45, len(dates)),
        'Client_Age': np.random.choice(['18-25', '26-35', '36-45', '46-55', '55+'], 1000),
        'Income_Bracket': np.random.choice(['<5L', '5-10L', '10-20L', '20-50L', '50L+'], 1000),
        'Loan_Type': np.random.choice(['Home', 'Auto', 'Personal', 'Business', 'Education'], 1000),
        'Loan_Status': np.random.choice(['Performing', 'NPA', 'Restructured'], 1000, p=[0.88, 0.08, 0.04]),
        'Transactions': np.random.randint(100, 5000, 1000)
  }

bank_data = generate_bank_data()

# Create dashboard
fig = make_subplots(
    rows=3, cols=2,
    specs=[[{"type": "xy"}, {"type": "domain"}],
            [{"type": "xy"}, {"type": "xy"}],
            [{"type": "xy", "colspan": 2}, None]],
    subplot_titles=(
        'NPA Ratio Trend',
        'Loan Portfolio Composition',
        'Client Age Distribution',
        'Income vs Transaction Pattern',
        'Geographic Distribution (Synthetic)'
    ),
    vertical_spacing=0.12,
    horizontal_spacing=0.1
)

# 1. NPA Ratio Trend (Line + Bar)
fig.add_trace(
    go.Scatter(
        x=bank_data['Quarter'],
        y=bank_data['NPA_Ratio'],
        name='NPA Ratio',
        line=dict(color='firebrick', width=3)
    ), row=1, col=1
)

fig.add_trace(
    go.Bar(
        x=bank_data['Quarter'],
        y=bank_data['Advances (Cr)'],
        name='Advances',
        marker_color='darkgreen',
        opacity=0.4
    ), row=1, col=1
)

# 2. Loan Portfolio (Pie)
loan_counts = pd.Series(bank_data['Loan_Type']).value_counts()
fig.add_trace(
    go.Pie(
        labels=loan_counts.index,
        values=loan_counts.values,
        hole=0.4,
        marker_colors=['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A']
    ), row=1, col=2
)

# 3. Client Age Distribution (Histogram)
age_counts = pd.Series(bank_data['Client_Age']).value_counts().sort_index()
fig.add_trace(
    go.Bar(
        x=age_counts.index,
        y=age_counts.values,
        marker_color='darkslateblue'
    ), row=2, col=1
)

# 4. Income vs Transactions (Box Plot)
income_groups = pd.Series(bank_data['Income_Bracket']).sort_values()
transactions = pd.Series(bank_data['Transactions'])

fig.add_trace(
    go.Box(
        x=income_groups,
        y=transactions,
        boxpoints='outliers',
        marker_color='darkcyan'
    ), row=2, col=2
)

# 5. Geographic Distribution (Synthetic State Data)
states = ['MH', 'UP', 'TN', 'KA', 'GJ', 'DL', 'RJ', 'AP', 'TG', 'WB']
state_data = {state: random.randint(1000, 5000) for state in states}

fig.add_trace(
    go.Choropleth(
        locations=states,
        z=[state_data[state] for state in states],
        locationmode='ISO-3',
        geojson={
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"hc-a2": state},
                "geometry": {
                    "type": "Polygon",
                    # Simplified coordinates for Indian states
                    "coordinates": [[[random.uniform(68, 97), random.uniform(8, 37)]]
                }
            } for state in states]
        },
        colorscale='Blues',
        showscale=False
    ), row=3, col=1
)

# Update layout
fig.update_layout(
    title_text='Comprehensive Banking Analytics Dashboard',
    height=1200,
    template='plotly_white',
    hovermode='closest',
    annotations=[
        dict(text=f"Last Updated: {datetime.now().strftime('%Y-%m-%d')}",
             x=1, y=1.08, xref='paper', yref='paper', showarrow=False)
    ]
)

# Add annotations
fig.add_annotation(
    x=bank_data['Quarter'][-1],
    y=bank_data['NPA_Ratio'][-1],
    text=f"Current NPA: {bank_data['NPA_Ratio'][-1]:.2f}%",
    showarrow=True,
    arrowhead=2,
    row=1, col=1
)

# Add dropdown menu
fig.update_layout(
    updatemenus=[
        dict(
            buttons=list([
                dict(
                    label="CASA Ratio",
                    method="update",
                    args=[{"y": [bank_data['CASA_Ratio']], "name": "CASA Ratio"}]
                ),
                dict(
                    label="NPA Ratio",
                    method="update",
                    args=[{"y": [bank_data['NPA_Ratio']], "name": "NPA Ratio"}]
                )
            ]),
            direction="down",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=0.1,
            xanchor="left",
            y=1.1,
            yanchor="top"
        )
    ]
)

fig.show()


# In[15]:


import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
import random

# Generate synthetic banking data
def generate_bank_data():
    months = pd.date_range('2023-01', '2024-01', freq='M')
    return {
        # Financial Metrics
        'Month': months,
        'NPA_Ratio': np.clip(np.random.normal(4.5, 1.2, len(months)), 2.0, 7.0),
        'CASA_Ratio': np.clip(np.random.normal(38, 4, len(months)), 30, 45),
        'Deposits (Cr)': np.random.randint(50000, 80000, len(months)),
        'Advances (Cr)': np.random.randint(40000, 75000, len(months)),
        
        # Client Demographics (1000 sample customers)
        'Age_Group': np.random.choice(['18-25', '26-35', '36-45', '46-55', '55+'], 1000),
        'Income_Bracket': np.random.choice(['<5L', '5-10L', '10-20L', '20-50L', '50L+'], 1000),
        'Account_Type': np.random.choice(['Savings', 'Current', 'Salary', 'NRI'], 1000),
        'Product_Holdings': np.random.randint(1, 5, 1000),
        
        # Loan Portfolio
        'Loan_Type': np.random.choice(['Home', 'Auto', 'Personal', 'Business'], 1000),
        'Loan_Status': np.random.choice(['Active', 'Closed', 'NPA'], 1000, p=[0.7, 0.25, 0.05]),
    }

bank_data = generate_bank_data()

# Create dashboard
fig = make_subplots(
    rows=3, cols=2,
    specs=[[{"type": "xy"}, {"type": "domain"}],
           [{"type": "xy"}, {"type": "xy"}],
           [{"type": "xy", "colspan": 2}, None]],
    subplot_titles=(
        'NPA Ratio & Deposit Trends',
        'Loan Portfolio Distribution',
        'Client Age Demographics',
        'Income vs Product Holdings',
        'Geographic Branch Performance'
    ),
    vertical_spacing=0.12
)

# 1. NPA Ratio and Deposits (Dual Axis)
fig.add_trace(
    go.Scatter(
        x=bank_data['Month'],
        y=bank_data['NPA_Ratio'],
        name='NPA Ratio (%)',
        line=dict(color='red', width=2)
    ), row=1, col=1
)

fig.add_trace(
    go.Bar(
        x=bank_data['Month'],
        y=bank_data['Deposits (Cr)'],
        name='Deposits (Cr)',
        marker_color='green',
        opacity=0.4
    ), row=1, col=1
)

# 2. Loan Portfolio Distribution
loan_counts = pd.Series(bank_data['Loan_Type']).value_counts()
fig.add_trace(
    go.Pie(
        labels=loan_counts.index,
        values=loan_counts.values,
        hole=0.4,
        marker_colors=['#636efa', '#ef553b', '#00cc96', '#ab63fa']
    ), row=1, col=2
)

# 3. Client Age Distribution
age_counts = pd.Series(bank_data['Age_Group']).value_counts().sort_index()
fig.add_trace(
    go.Bar(
        x=age_counts.index,
        y=age_counts.values,
        marker_color='#ffa15a',
        name='Client Age'
    ), row=2, col=1
)

# 4. Income vs Product Holdings
income_order = ['<5L', '5-10L', '10-20L', '20-50L', '50L+']
fig.add_trace(
    go.Box(
        x=bank_data['Income_Bracket'],
        y=bank_data['Product_Holdings'],
        boxpoints='all',
        marker_color='#19d3f3',
        line_color='#636efa'
    ), row=2, col=2
)

# 5. Geographic Performance (Synthetic)
states = ['MH', 'UP', 'TN', 'KA', 'GJ', 'AP', 'RJ', 'MP']
state_performance = {
    'State': states,
    'Customers': np.random.randint(500, 2000, len(states)),
    'Growth (%)': np.random.uniform(5, 25, len(states))
}

fig.add_trace(
    go.Choropleth(
        locations=state_performance['State'],
        z=state_performance['Growth (%)'],
        locationmode='ISO-3',
        colorscale='Blues',
        colorbar_title='Growth %',
        geojson={
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"hc-a2": state},
                "geometry": {"type": "Point"}  # Simplified geometry
            } for state in states]
        }
    ), row=3, col=1
)

# Update layout
fig.update_layout(
    title_text='Bank Performance Dashboard',
    height=1000,
    template='plotly_white',
    hovermode='x unified',
    annotations=[
        dict(text="Synthetic Data | Banking Analytics",
             x=0.5, y=-0.15, showarrow=False, xref="paper", yref="paper")
    ]
)

# Add annotations
fig.add_annotation(
    x=bank_data['Month'][-1],
    y=bank_data['NPA_Ratio'][-1],
    text=f"Current NPA: {bank_data['NPA_Ratio'][-1]:.1f}%",
    showarrow=True,
    arrowhead=2,
    row=1, col=1
)

fig.show()


# In[16]:


import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Generate sample data for Indian banks
def generate_indian_banks_data(days=60):
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(days)]
    dates.reverse()  # Chronological order
    
    banks = ['HDFC', 'SBI', 'Kotak', 'ICICI', 'Axis']
    
    # Create empty dataframe
    df = pd.DataFrame()
    
    # Set different base values and growth rates for each bank
    base_values = {
        'HDFC': {'stock_price': 1500, 'market_cap': 900, 'npa_ratio': 1.2, 'deposit_growth': 8, 'loan_growth': 7},
        'SBI': {'stock_price': 550, 'market_cap': 1200, 'npa_ratio': 2.5, 'deposit_growth': 10, 'loan_growth': 8},
        'Kotak': {'stock_price': 1800, 'market_cap': 650, 'npa_ratio': 0.9, 'deposit_growth': 7, 'loan_growth': 6},
        'ICICI': {'stock_price': 900, 'market_cap': 800, 'npa_ratio': 1.8, 'deposit_growth': 9, 'loan_growth': 8.5},
        'Axis': {'stock_price': 850, 'market_cap': 700, 'npa_ratio': 2.0, 'deposit_growth': 8.5, 'loan_growth': 7.5}
    }
    
    np.random.seed(42)  # For reproducibility
    
    # Generate data for each bank
    for bank in banks:
        # Stock price with realistic volatility
        volatility = np.random.normal(0, 0.015, days)  # Daily volatility around 1.5%
        cumulative_returns = np.cumsum(volatility)
        growth_trend = np.linspace(0, 0.1, days)  # Slight upward trend
        stock_prices = base_values[bank]['stock_price'] * (1 + cumulative_returns + growth_trend)
        
        # Market cap (in billion INR)
        market_cap = base_values[bank]['market_cap'] * (1 + cumulative_returns + growth_trend * 1.2)
        
        # NPA (Non-Performing Assets) ratio with small random changes
        npa_base = base_values[bank]['npa_ratio']
        npa_changes = np.random.normal(0, 0.05, days)
        npa_trend = np.linspace(0, -0.2, days)  # Slight downward trend (improving)
        npa_ratio = npa_base * (1 + npa_changes + npa_trend)
        npa_ratio = np.clip(npa_ratio, 0.5, 5.0)  # Keep in realistic range
        
        # Quarterly deposit growth (annualized %)
        deposit_base = base_values[bank]['deposit_growth']
        deposit_fluctuation = np.random.normal(0, 0.3, days)
        deposit_growth = deposit_base + deposit_fluctuation
        
        # Quarterly loan growth (annualized %)
        loan_base = base_values[bank]['loan_growth']
        loan_fluctuation = np.random.normal(0, 0.3, days)
        loan_growth = loan_base + loan_fluctuation
        
        # Net interest margin (%)
        nim_base = 3.5 + np.random.normal(0, 0.5)  # Different for each bank
        nim_fluctuation = np.random.normal(0, 0.05, days)
        nim = nim_base + nim_fluctuation
        
        # Create dataframe for this bank
        bank_df = pd.DataFrame({
            'date': dates,
            'bank': bank,
            'stock_price': stock_prices,
            'market_cap': market_cap,
            'npa_ratio': npa_ratio,
            'deposit_growth': deposit_growth,
            'loan_growth': loan_growth,
            'net_interest_margin': nim
        })
        
        # Append to main dataframe
        df = pd.concat([df, bank_df])
    
    return df

# Generate data
df = generate_indian_banks_data()

# Create subplots
fig = make_subplots(
    rows=3, cols=2,
    subplot_titles=(
        "Stock Price Trends (₹)",
        "Market Capitalization (₹ Billion)", 
        "NPA Ratio (%)",
        "Deposit Growth (% YoY)",
        "Loan Growth (% YoY)",
        "Net Interest Margin (%)"
    ),
    specs=[
        [{"type": "scatter"}, {"type": "scatter"}],
        [{"type": "scatter"}, {"type": "scatter"}],
        [{"type": "scatter"}, {"type": "scatter"}]
    ],
    vertical_spacing=0.12,
    horizontal_spacing=0.08
)

# Color mapping for banks
colors = {
    'HDFC': '#0066b3',    # Blue
    'SBI': '#238823',     # Green
    'Kotak': '#8b0000',   # Dark Red
    'ICICI': '#ff8c00',   # Orange
    'Axis': '#800080'     # Purple
}

# Add traces for each metric and bank
for bank in ['HDFC', 'SBI', 'Kotak', 'ICICI', 'Axis']:
    bank_data = df[df['bank'] == bank]
    
    # Stock Price
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['stock_price'],
            mode='lines',
            name=f"{bank} - Stock",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            hovertemplate="₹%{y:.2f}<extra>%{x}</extra>"
        ),
        row=1, col=1
    )
    
    # Market Cap
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['market_cap'],
            mode='lines',
            name=f"{bank} - Market Cap",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            showlegend=False,
            hovertemplate="₹%{y:.2f} Bn<extra>%{x}</extra>"
        ),
        row=1, col=2
    )
    
    # NPA Ratio
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['npa_ratio'],
            mode='lines',
            name=f"{bank} - NPA",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            showlegend=False,
            hovertemplate="%{y:.2f}%<extra>%{x}</extra>"
        ),
        row=2, col=1
    )
    
    # Deposit Growth
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['deposit_growth'],
            mode='lines',
            name=f"{bank} - Deposits",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            showlegend=False,
            hovertemplate="%{y:.2f}%<extra>%{x}</extra>"
        ),
        row=2, col=2
    )
    
    # Loan Growth
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['loan_growth'],
            mode='lines',
            name=f"{bank} - Loans",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            showlegend=False,
            hovertemplate="%{y:.2f}%<extra>%{x}</extra>"
        ),
        row=3, col=1
    )
    
    # Net Interest Margin
    fig.add_trace(
        go.Scatter(
            x=bank_data['date'],
            y=bank_data['net_interest_margin'],
            mode='lines',
            name=f"{bank} - NIM",
            line=dict(color=colors[bank], width=2),
            legendgroup=bank,
            showlegend=False,
            hovertemplate="%{y:.2f}%<extra>%{x}</extra>"
        ),
        row=3, col=2
    )

# Update layout
fig.update_layout(
    title_text="Performance Comparison of Top 5 Indian Banks",
    height=900,
    width=1200,
    template="plotly_white",
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="center",
        x=0.5
    ),
    margin=dict(t=100)
)

# Update axes
for i in range(1, 4):
    for j in range(1, 3):
        fig.update_xaxes(
            title_text="Date",
            row=i, col=j,
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray'
        )
        
        fig.update_yaxes(
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray',
            row=i, col=j
        )

# For a real application, replace this with saving to a file or serving via a web app
fig.show()

# Add annotations for latest values
latest_date = df['date'].max()
latest_data = df[df['date'] == latest_date]

for bank in ['HDFC', 'SBI', 'Kotak', 'ICICI', 'Axis']:
    bank_latest = latest_data[latest_data['bank'] == bank]
    
    # Add current value annotations
    fig.add_annotation(
        x=latest_date,
        y=float(bank_latest['stock_price']),
        text=f"₹{float(bank_latest['stock_price']):.2f}",
        showarrow=True,
        arrowhead=2,
        ax=40,
        ay=-20,
        row=1, col=1
    )

# For auto-updating, you would connect to live data sources:
# - Stock APIs for price and market cap data
# - RBI/bank quarterly reports for NPA, growth metrics
# - News sources for events affecting banks

# Example of how to set up auto-updates with Flask:
"""
from flask import Flask, render_template
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import requests

app = Flask(__name__)
latest_plot_data = None

def update_bank_data():
    global latest_plot_data
    # Fetch real banking data:
    # 1. Stock prices from NSE/BSE APIs
    # stock_data = fetch_stock_data(['HDFCBANK', 'SBIN', 'KOTAKBANK', 'ICICIBANK', 'AXISBANK'])
    
    # 2. Financial metrics from quarterly reports or financial data APIs
    # financial_metrics = fetch_bank_metrics()
    
    # 3. Update visualization
    # df = process_bank_data(stock_data, financial_metrics)
    # fig = create_bank_dashboard(df)
    # latest_plot_data = fig.to_json()

@app.route('/')
def index():
    return render_template('dashboard.html', plot_data=latest_plot_data)

if __name__ == '__main__':
    # Initial data loading
    update_bank_data()
    
    # Update every 15 minutes during trading hours
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=update_bank_data, trigger="interval", minutes=15)
    scheduler.start()
    
    # Shut down scheduler when app exits
    atexit.register(lambda: scheduler.shutdown())
    
    app.run(debug=True)
"""


# In[17]:


import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import plotly.express as px

# Generate sample client data for an Indian bank
def generate_client_data(num_clients=1000):
    np.random.seed(42)
    
    # Client demographics
    age = np.random.normal(40, 12, num_clients)
    age = np.clip(age, 18, 80).astype(int)
    
    # Income segments (in lakhs per year)
    income_base = np.random.exponential(10, num_clients)
    income = np.clip(income_base, 1, 100).astype(float)
    
    # Client tenure in years
    tenure = np.random.gamma(shape=3, scale=2, size=num_clients)
    tenure = np.clip(tenure, 0.1, 30).astype(float)
    
    # Service usage (number of products)
    products = np.random.poisson(2, num_clients)
    products = np.clip(products, 1, 8).astype(int)
    
    # Transaction frequency (per month)
    transaction_freq = np.random.negative_binomial(5, 0.5, num_clients)
    transaction_freq = np.clip(transaction_freq, 1, 100).astype(int)
    
    # Average transaction amount (in thousands)
    avg_transaction = np.random.exponential(5, num_clients)
    avg_transaction = np.clip(avg_transaction, 0.5, 50).astype(float)
    
    # Digital engagement score (0-100)
    digital_score = np.random.beta(3, 2, num_clients) * 100
    digital_score = np.clip(digital_score, 0, 100).astype(int)
    
    # Customer lifetime value (in lakhs)
    ltv = (income / 10) * (0.1 + tenure / 10) * (1 + products / 10) * np.random.uniform(0.8, 1.5, num_clients)
    ltv = np.clip(ltv, 0.2, 200).astype(float)
    
    # Profitability (in thousands per year)
    profitability = ltv * 10 * np.random.uniform(0.05, 0.15, num_clients)
    profitability = np.clip(profitability, 5, 500).astype(float)
    
    # Credit score (300-900)
    credit_score_base = digital_score + (tenure * 5) + (np.random.normal(0, 20, num_clients))
    credit_score = 300 + (credit_score_base / 100) * 600
    credit_score = np.clip(credit_score, 300, 900).astype(int)
    
    # Customer segment
    def get_segment(row):
        if row['ltv'] > 50 and row['profitability'] > 150:
            return "Premium"
        elif row['digital_score'] > 70 and row['age'] < 35:
            return "Digital Native"
        elif row['tenure'] > 10 and row['products'] >= 3:
            return "Loyal"
        elif row['income'] > 25 and row['products'] <= 2:
            return "High Potential"
        else:
            return "Mass"
    
    # Location (major Indian cities)
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
              'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
    city_weights = [0.2, 0.18, 0.15, 0.1, 0.1, 0.08, 0.07, 0.05, 0.04, 0.03]
    location = np.random.choice(cities, num_clients, p=city_weights)
    
    # Bank association
    banks = ['HDFC', 'SBI', 'Kotak', 'ICICI', 'Axis']
    bank_weights = [0.25, 0.3, 0.15, 0.18, 0.12]
    primary_bank = np.random.choice(banks, num_clients, p=bank_weights)
    
    # Products
    product_list = []
    for p in products:
        available_products = ['Savings Account', 'Fixed Deposit', 'Credit Card', 
                             'Personal Loan', 'Home Loan', 'Mutual Fund', 
                             'Insurance', 'Demat Account']
        weights = [0.95, 0.6, 0.5, 0.3, 0.25, 0.2, 0.15, 0.1]
        # Adjust weights by number of products
        if p < len(weights):
            adj_weights = weights[:p]
            adj_weights = [w/sum(adj_weights) for w in adj_weights]
            user_products = np.random.choice(available_products[:p], p, p=adj_weights, replace=False)
        else:
            user_products = np.random.choice(available_products, p, p=[w/sum(weights) for w in weights], replace=False)
        
        product_list.append(', '.join(user_products))
    
    # Create dataframe
    df = pd.DataFrame({
        'client_id': range(1, num_clients + 1),
        'age': age,
        'income': income,
        'tenure': tenure,
        'products': products,
        'product_list': product_list,
        'transaction_freq': transaction_freq,
        'avg_transaction': avg_transaction,
        'digital_score': digital_score,
        'ltv': ltv,
        'profitability': profitability,
        'credit_score': credit_score,
        'location': location,
        'primary_bank': primary_bank
    })
    
    # Add segment after creating dataframe
    df['segment'] = df.apply(get_segment, axis=1)
    
    return df

# Generate transaction history data
def generate_transaction_history(days=90):
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(days)]
    dates.reverse()  # Chronological order
    
    transaction_types = ['UPI Payment', 'Debit Card', 'Credit Card', 
                        'Net Banking', 'Mobile Banking', 'ATM Withdrawal', 
                        'NEFT/RTGS', 'Cheque']
    
    # Transaction volume by type over time
    type_data = pd.DataFrame()
    
    np.random.seed(42)
    for t_type in transaction_types:
        # Base volume with some growth trend
        base = np.random.randint(500, 2000)
        growth = np.random.uniform(0.001, 0.005)
        noise = np.random.normal(0, 0.05, len(dates))
        
        # Weekday effect (more transactions on weekdays)
        weekday_boost = []
        for i, date in enumerate(dates):
            day = datetime.strptime(date, '%Y-%m-%d').weekday()
            # Weekends have fewer transactions
            if day >= 5:  # 5=Saturday, 6=Sunday
                weekday_boost.append(0.7)
            else:
                weekday_boost.append(1.0 + (day * 0.05))  # Slightly more later in week
                
        volume = []
        for i, date in enumerate(dates):
            day_volume = int(base * (1 + growth * i) * (1 + noise[i]) * weekday_boost[i])
            volume.append(day_volume)
            
        type_df = pd.DataFrame({
            'date': dates,
            'transaction_type': t_type,
            'volume': volume
        })
        
        type_data = pd.concat([type_data, type_df])
    
    # Transaction success rate data
    success_data = pd.DataFrame()
    
    for t_type in transaction_types:
        # Base success rate
        if t_type in ['UPI Payment', 'Mobile Banking']:
            base_rate = 0.985  # 98.5% success
        elif t_type in ['ATM Withdrawal', 'Cheque']:
            base_rate = 0.995  # 99.5% success
        else:
            base_rate = 0.99  # 99% success
            
        success_rates = []
        
        for date in dates:
            # Small random fluctuation in success rate
            day_rate = base_rate + np.random.normal(0, 0.002)
            day_rate = min(max(day_rate, 0.95), 0.999)  # Keep within realistic bounds
            success_rates.append(day_rate * 100)  # Convert to percentage
            
        success_df = pd.DataFrame({
            'date': dates,
            'transaction_type': t_type,
            'success_rate': success_rates
        })
        
        success_data = pd.concat([success_data, success_df])
    
    return type_data, success_data

# Generate time-of-day transaction data
def generate_hourly_transactions():
    hours = list(range(24))
    
    # Different profiles for different transaction types
    profiles = {
        'UPI Payment': [2, 3, 1, 1, 1, 2, 5, 10, 15, 12, 10, 15, 20, 18, 15, 12, 10, 12, 18, 25, 20, 15, 10, 5],
        'Debit Card': [1, 1, 1, 1, 1, 2, 3, 5, 8, 10, 15, 20, 25, 20, 15, 12, 15, 20, 25, 20, 15, 8, 5, 2],
        'Credit Card': [1, 1, 1, 1, 1, 1, 2, 3, 5, 8, 12, 15, 20, 18, 15, 12, 15, 18, 25, 30, 25, 15, 8, 3],
        'Net Banking': [1, 1, 1, 1, 1, 2, 5, 15, 25, 30, 25, 20, 15, 20, 25, 20, 15, 10, 8, 5, 3, 2, 1, 1],
        'Mobile Banking': [3, 2, 1, 1, 1, 2, 5, 10, 15, 12, 10, 12, 15, 12, 10, 12, 15, 18, 25, 30, 25, 15, 10, 5]
    }
    
    hourly_data = pd.DataFrame()
    
    for t_type, profile in profiles.items():
        # Normalize to get percentage distribution
        total = sum(profile)
        normalized = [p/total*100 for p in profile]
        
        hourly_df = pd.DataFrame({
            'hour': hours,
            'transaction_type': t_type,
            'percentage': normalized
        })
        
        hourly_data = pd.concat([hourly_data, hourly_df])
    
    return hourly_data

# Generate data
client_df = generate_client_data(2000)
transaction_vol_df, success_rate_df = generate_transaction_history()
hourly_df = generate_hourly_transactions()

# Create figure with subplots
fig = make_subplots(
    rows=3, cols=2,
    subplot_titles=(
        "Customer Segmentation", 
        "Product Adoption by Segment",
        "Client Distribution by Bank", 
        "Transaction Volume by Type",
        "Digital Engagement vs. Customer Value", 
        "Transaction Time Distribution"
    ),
    specs=[
        [{"type": "pie"}, {"type": "bar"}],
        [{"type": "bar"}, {"type": "scatter"}],
        [{"type": "scatter"}, {"type": "scatter"}]
    ],
    vertical_spacing=0.12,
    horizontal_spacing=0.08
)

# 1. Customer Segmentation (Pie Chart)
segment_counts = client_df['segment'].value_counts()
fig.add_trace(
    go.Pie(
        labels=segment_counts.index,
        values=segment_counts.values,
        textinfo='percent+label',
        marker=dict(
            colors=px.colors.qualitative.Set2
        ),
        hovertemplate="<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>"
    ),
    row=1, col=1
)

# 2. Product Adoption by Segment (Stacked Bar Chart)
# Count clients with each product type by segment
product_counts = pd.DataFrame()
products = ['Savings Account', 'Fixed Deposit', 'Credit Card', 'Personal Loan', 
           'Home Loan', 'Mutual Fund', 'Insurance', 'Demat Account']

for product in products:
    # Count clients in each segment who have this product
    segment_product_counts = []
    segments = client_df['segment'].unique()
    
    for segment in segments:
        segment_clients = client_df[client_df['segment'] == segment]
        count = sum(segment_clients['product_list'].str.contains(product))
        segment_product_counts.append(count)
    
    product_df = pd.DataFrame({
        'segment': segments,
        'product': product,
        'count': segment_product_counts
    })
    
    product_counts = pd.concat([product_counts, product_df])

# Only use top 5 products for clarity
top_products = ['Savings Account', 'Fixed Deposit', 'Credit Card', 'Personal Loan', 'Mutual Fund']
product_counts = product_counts[product_counts['product'].isin(top_products)]

for product in top_products:
    product_data = product_counts[product_counts['product'] == product]
    fig.add_trace(
        go.Bar(
            x=product_data['segment'],
            y=product_data['count'],
            name=product,
            hovertemplate="<b>%{x}</b><br>%{y} clients<extra>" + product + "</extra>"
        ),
        row=1, col=2
    )

# 3. Client Distribution by Bank (Bar Chart)
bank_counts = client_df['primary_bank'].value_counts().reset_index()
bank_counts.columns = ['bank', 'count']

colors = {
    'HDFC': '#0066b3',    # Blue
    'SBI': '#238823',     # Green
    'Kotak': '#8b0000',   # Dark Red
    'ICICI': '#ff8c00',   # Orange
    'Axis': '#800080'     # Purple
}

fig.add_trace(
    go.Bar(
        x=bank_counts['bank'],
        y=bank_counts['count'],
        marker_color=[colors[bank] for bank in bank_counts['bank']],
        hovertemplate="<b>%{x}</b><br>%{y} clients<extra></extra>"
    ),
    row=2, col=1
)

# 4. Transaction Volume by Type over Time (Line Chart)
transaction_types = transaction_vol_df['transaction_type'].unique()
colors_cycle = px.colors.qualitative.Safe

for i, t_type in enumerate(transaction_types):
    type_data = transaction_vol_df[transaction_vol_df['transaction_type'] == t_type]
    fig.add_trace(
        go.Scatter(
            x=type_data['date'],
            y=type_data['volume'],
            mode='lines',
            name=t_type,
            line=dict(color=colors_cycle[i % len(colors_cycle)]),
            hovertemplate="<b>%{x}</b><br>%{y} transactions<extra>" + t_type + "</extra>"
        ),
        row=2, col=2
    )

# 5. Digital Engagement vs Customer Value (Scatter Plot)
segment_colors = {
    'Premium': '#ff7f0e',
    'Digital Native': '#1f77b4',
    'Loyal': '#2ca02c',
    'High Potential': '#d62728',
    'Mass': '#9467bd'
}

for segment in client_df['segment'].unique():
    segment_data = client_df[client_df['segment'] == segment]
    fig.add_trace(
        go.Scatter(
            x=segment_data['digital_score'],
            y=segment_data['ltv'],
            mode='markers',
            name=segment,
            marker=dict(
                size=8,
                color=segment_colors[segment],
                opacity=0.7
            ),
            hovertemplate="<b>" + segment + "</b><br>Digital Score: %{x}<br>Lifetime Value: ₹%{y:.2f} lakhs<extra></extra>"
        ),
        row=3, col=1
    )

# 6. Transaction Time Distribution (Area Chart)
for i, t_type in enumerate(['UPI Payment', 'Debit Card', 'Credit Card', 'Net Banking', 'Mobile Banking']):
    type_data = hourly_df[hourly_df['transaction_type'] == t_type]
    fig.add_trace(
        go.Scatter(
            x=type_data['hour'],
            y=type_data['percentage'],
            mode='lines',
            name=t_type,
            fill='tozeroy',
            line=dict(color=colors_cycle[i % len(colors_cycle)]),
            hovertemplate="<b>%{x}:00</b><br>%{y:.1f}% of daily volume<extra>" + t_type + "</extra>"
        ),
        row=3, col=2
    )

# Update layout and formatting
fig.update_layout(
    title_text="Banking Client Analytics Dashboard",
    height=900,
    width=1200,
    template="plotly_white",
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="center",
        x=0.5
    ),
    margin=dict(t=100),
    barmode='stack'
)

# Format axes
fig.update_xaxes(title_text="Segment", row=1, col=2)
fig.update_yaxes(title_text="Number of Clients", row=1, col=2)

fig.update_xaxes(title_text="Bank", row=2, col=1)
fig.update_yaxes(title_text="Number of Clients", row=2, col=1)

fig.update_xaxes(title_text="Date", row=2, col=2)
fig.update_yaxes(title_text="Number of Transactions", row=2, col=2)

fig.update_xaxes(title_text="Digital Engagement Score", row=3, col=1)
fig.update_yaxes(title_text="Customer Lifetime Value (₹ lakhs)", row=3, col=1)

fig.update_xaxes(title_text="Hour of Day (24h format)", row=3, col=2)
fig.update_yaxes(title_text="Percentage of Daily Transactions", row=3, col=2)

# Add annotations with key insights
fig.add_annotation(
    xref="paper", yref="paper",
    x=0.02, y=0.98,
    text="Premium segment represents only 15% of clients<br>but contributes 40% of profitability",
    showarrow=False,
    font=dict(size=10),
    align="left",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

fig.add_annotation(
    xref="paper", yref="paper",
    x=0.98, y=0.98,
    text="Credit Cards have highest<br>adoption in Premium segment",
    showarrow=False,
    font=dict(size=10),
    align="right",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

fig.add_annotation(
    xref="paper", yref="paper",
    x=0.02, y=0.65,
    text="SBI leads in mass segment,<br>HDFC in premium segment",
    showarrow=False,
    font=dict(size=10),
    align="left",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

fig.add_annotation(
    xref="paper", yref="paper",
    x=0.98, y=0.65,
    text="UPI transactions have grown<br>30% in the last quarter",
    showarrow=False,
    font=dict(size=10),
    align="right",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

fig.add_annotation(
    xref="paper", yref="paper",
    x=0.02, y=0.35,
    text="Digital engagement strongly<br>correlates with customer value",
    showarrow=False,
    font=dict(size=10),
    align="left",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

fig.add_annotation(
    xref="paper", yref="paper",
    x=0.98, y=0.35,
    text="Peak mobile banking usage<br>occurs between 7-9 PM",
    showarrow=False,
    font=dict(size=10),
    align="right",
    bgcolor="rgba(255, 255, 255, 0.8)",
    bordercolor="gray",
    borderwidth=1,
    borderpad=4
)

# For a real application, save or serve via web app
fig.show()

# For auto-updating implementation:
"""
from flask import Flask, render_template
import json
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)
latest_plot_data = None

def update_client_analytics():
    global latest_plot_data
    # In a real implementation, you would:
    # 1. Connect to your bank's client database
    # 2. Pull transaction data from payment processing systems
    # 3. Update the visualizations with fresh data
    
    # Update the client data
    client_df = fetch_updated_client_data()  # Your data fetching function
    
    # Update transaction data
    transaction_data = fetch_transaction_data()  # Your transaction data function
    
    # Regenerate the dashboard
    fig = create_client_dashboard(client_df, transaction_data)
    latest_plot_data = json.dumps(fig.to_dict())

@app.route('/')
def index():
    return render_template('client_dashboard.html', plot_data=latest_plot_data)

if __name__ == '__main__':
    # Initial data load
    update_client_analytics()
    
    # Set up scheduled updates (daily or hourly depending on needs)
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=update_client_analytics, trigger="interval", hours=24)
    scheduler.start()
    
    # Shut down scheduler when app exits
    atexit.register(lambda: scheduler.shutdown())
    
    app.run(debug=True)
"""


# In[ ]:




