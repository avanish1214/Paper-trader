import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import TradingComponent from "./TradingComponent";
import TradingViewWidget from "../components/TradingViewWidget";
import { BarChart3 } from "lucide-react";

// Socket server endpoint
const SOCKET_URL = "https://papertrader-1.onrender.com";

export default function StockDetail() {
  const { symbol } = useParams(); // e.g., "RELIANCE"
  const { token, user } = useAuth();
  const [stockData, setStockData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // Fetch static stock details once
  useEffect(() => {
    if (!symbol || !token) return;

    setLoading(true);
    setError("");

    // Using fetch instead of axios for consistency
    fetch(`https://papertrader-1.onrender.com/api/stocks-details/details/${symbol}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStockData(data.data);
        } else {
          setError("Failed to load stock data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stock data:", err);
        setError("Failed to load stock data");
        setLoading(false);
      });
  }, [symbol, token]);

  // Setup socket and watch stock
  useEffect(() => {
    if (!token || !symbol) return;

    const fullSymbol = `${symbol}.NS`;

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"], // fallback to polling if websocket fails
      timeout: 20000,
      forceNew: true // Force a new connection
    });

    // Connection event handlers
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setSocketConnected(true);
      
      // Subscribe to symbol updates after connection is established
      socketRef.current.emit("subscribe-symbol", fullSymbol);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setSocketConnected(false);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
    });

    // Listen for live price updates
    socketRef.current.on("symbol-price", (data) => {
      console.log("Received price update:", data);
      if (data.symbol === fullSymbol) {
        setLivePrice(data.price);
      }
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.emit("unsubscribe-symbol", fullSymbol);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
    };
  }, [symbol, token]);

  const currentPrice = livePrice ?? stockData?.price?.regularMarketPrice;

  // Helper function to format large numbers
  const formatMarketCap = (value) => {
    if (!value) return "N/A";
    const crores = value / 10000000;
    if (crores >= 100000) {
      return `₹${(crores / 100000).toFixed(2)}L Cr`;
    }
    return `₹${crores.toFixed(0)} Cr`;
  };

  const formatVolume = (value) => {
    if (!value) return "N/A";
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) return <div className="p-4 text-lg">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">{symbol}</h1>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              socketConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-600">
            {socketConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <p className="text-xl text-gray-600 mb-6">
        ₹{currentPrice ?? "N/A"}
        {livePrice && (
          <span className="text-sm text-green-600 ml-2">(Live)</span>
        )}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* TradingView Widget */}
          <div className="mb-4">
            <TradingViewWidget 
              symbol={symbol}
              socketConnected={socketConnected}
            />
          </div>

          {/* Key Trading Statistics - Fixed field mappings */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Key Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Market Cap</div>
                <div className="text-lg font-semibold">
                  {formatMarketCap(stockData?.price?.marketCap)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">P/E Ratio</div>
                <div className="text-lg font-semibold">
                  {stockData?.price?.trailingPE?.toFixed(2) || stockData?.price?.forwardPE?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">52W High</div>
                <div className="text-lg font-semibold text-green-600">
                  ₹{stockData?.price?.fiftyTwoWeekHigh?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">52W Low</div>
                <div className="text-lg font-semibold text-red-600">
                  ₹{stockData?.price?.fiftyTwoWeekLow?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Volume</div>
                <div className="text-lg font-semibold">
                  {formatVolume(stockData?.price?.regularMarketVolume)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Avg Volume</div>
                <div className="text-lg font-semibold">
                  {formatVolume(stockData?.price?.averageDailyVolume3Month)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Book Value</div>
                <div className="text-lg font-semibold">
                  ₹{stockData?.price?.bookValue?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">EPS (TTM)</div>
                <div className="text-lg font-semibold">
                  ₹{stockData?.price?.epsTrailingTwelveMonths?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Day High</div>
                <div className="text-lg font-semibold text-green-600">
                  ₹{stockData?.price?.regularMarketDayHigh?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Day Low</div>
                <div className="text-lg font-semibold text-red-600">
                  ₹{stockData?.price?.regularMarketDayLow?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Previous Close</div>
                <div className="text-lg font-semibold">
                  ₹{stockData?.price?.regularMarketPreviousClose?.toFixed(2) || "N/A"}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Price to Book</div>
                <div className="text-lg font-semibold">
                  {stockData?.price?.priceToBook?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-fit">
          <TradingComponent 
            symbol={symbol}
            currentPrice={currentPrice}
            socketConnected={socketConnected}
            token={token}
            userCash={user?.cash || 0}
          />
        </div>
      </div>
    </div>
  );
}
