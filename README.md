A full-stack web application for virtual stock trading with real-time market data, portfolio management, and comprehensive trading features.

## 🚀 Features

### Core Trading Features

- **Virtual Trading**: Buy and sell stocks with virtual money
- **Real-time Data**: Live stock prices via Socket.io connections
- **Portfolio Management**: Track holdings with real-time P\&L calculations
- **Trading History**: Complete record of all buy/sell transactions
- **Stock Search**: Search and discover stocks across NSE/BSE


### Advanced Features

- **Live Charts**: Integrated TradingView charts and mini widgets
- **Market Overview**: Real-time market indices and top movers
- **Performance Analytics**: Top performers and worst performers tracking
- **Responsive Design**: Mobile-friendly interface with shadcn/ui components
- **Real-time Updates**: Live price updates without page refresh


## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **shadcn/ui** - Beautiful and accessible UI components
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization and charts
- **TradingView Widgets** - Professional trading charts
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing


### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing


## 📦 Installation \& Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Git


### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/papertrader.git
cd papertrader
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Environment Variables**
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Start the backend server**
```bash
npm start
# or for development
npm run dev
```


### Frontend Setup

1. **Install frontend dependencies**
```bash
cd frontend
npm install
```

2. **Environment Variables**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000
```

3. **Start the frontend application**
```bash
npm start
```

The application will be available at `http://localhost:3000` (frontend) with the backend running on the same port.

## 🌐 Deployment

### Backend (Render)

1. Push your backend code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render dashboard
4. Deploy with Node.js environment

### Frontend (Vercel/Netlify)

1. Update environment variables for production:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

2. Build and deploy to your preferred platform

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile


### Trading Endpoints

- `POST /api/buy` - Buy stocks
- `POST /api/sell` - Sell stocks
- `GET /api/portfolio` - Get user portfolio
- `GET /api/trades/history` - Get trading history


### Market Data

- `GET /api/stocks/search` - Search stocks
- `GET /api/stocks-details/details/:symbol` - Get stock details
- `GET /api/prices` - Get current prices for multiple symbols


### Socket Events

- `subscribe-symbol` - Subscribe to real-time price updates
- `unsubscribe-symbol` - Unsubscribe from price updates
- `symbol-price` - Receive real-time price updates


## 🗂️ Project Structure

```
papertrader/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── config/
│   │   └── App.js
│   └── public/
└── README.md
```


## 🔧 Key Components

### Frontend Components

- **Home.jsx** - Dashboard with live market data
- **StockDetail.jsx** - Individual stock page with charts and trading
- **Portfolio.jsx** - Portfolio overview with P\&L tracking
- **TradingComponent.jsx** - Buy/sell interface
- **PastTrades.jsx** - Trading history display
- **Navbar.jsx** - Navigation with stock search


### Backend Models

- **User** - User authentication and cash balance
- **Portfolio** - User stock holdings
- **Trades** - Transaction history


## 🎯 Features in Detail

### Real-time Portfolio Tracking

- Live P\&L calculations with color-coded indicators
- Asset allocation pie charts
- Top performer and worst performer analysis
- Real-time value updates via WebSocket


### Advanced Trading Interface

- Real-time price display
- Quantity validation and insufficient funds checking
- Average price calculation for multiple purchases
- Complete buy/sell transaction flow


### Market Data Integration

- TradingView chart integration
- Live stock price feeds
- Market status indicators
- Stock search with autocomplete


## 🚦 Getting Started

1. **Register an Account**: Create a new account on the platform
2. **Add Virtual Funds**: Start with virtual money for trading
3. **Search Stocks**: Use the search bar to find stocks
4. **Place Trades**: Buy and sell stocks with real-time prices
5. **Track Portfolio**: Monitor your performance and P\&L


## 🔗 Live Demo
[https://your-frontend-url.vercel.app](https://frontend-papertrader.onrender.com)

