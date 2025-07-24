import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Star, Volume2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const socket = io("https://papertrader-1.onrender.com");

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("stock-update", (data) => {
      setStocks(data);
      setLoading(false);
    });

    return () => socket.off("stock-update");
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (change, price) => {
    if (!price || price === 0) return "0.00%";
    const percentage = (change / (price - change)) * 100;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-36"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile ticker */}
      <div className="block md:hidden overflow-hidden bg-gray-900 rounded-lg p-3">
        <div className="flex animate-scroll space-x-6">
          {stocks.map((stock) => {
            const isUp = stock.change >= 0;
            return (
              <div key={`ticker-${stock.symbol}`} className="flex items-center space-x-2 text-white whitespace-nowrap">
                <span className="font-semibold">{stock.symbol}</span>
                <span className="font-mono">{formatCurrency(stock.price)}</span>
                <span className={`text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{stock.change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => {
          const isUp = stock.change >= 0;
          const isHighVolume = Math.random() > 0.7; // Simulate high volume
          const isWatchlisted = Math.random() > 0.8; // Simulate watchlist
          const volumeLevel = Math.floor(Math.random() * 3) + 1; // 1-3 volume level

          return (
            <div
              key={stock.symbol}
              className={`group relative rounded-2xl shadow-lg p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl border-2 ${
                isUp 
                  ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:border-green-300" 
                  : "bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:border-red-300"
              }`}
              onClick={() => navigate(`/stock/${stock.symbol.replace('.NS', '')}`)}

            >
              {/* Top badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {isWatchlisted && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                    <Star className="w-3 h-3" />
                  </Badge>
                )}
                {isHighVolume && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                    <Volume2 className="w-3 h-3 mr-1" />
                    High Vol
                  </Badge>
                )}
              </div>

              {/* Stock info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 mb-1">
                  {stock.symbol}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">NSE</span>
                  <div className="flex">
                    {[...Array(volumeLevel)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 mr-1 rounded ${isUp ? 'bg-green-400' : 'bg-red-400'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 font-mono mb-1">
                  {formatCurrency(stock.price)}
                </div>
                <div className="text-xs text-gray-500">Last updated: Just now</div>
              </div>

              {/* Change and percentage */}
              <div className={`flex items-center justify-between mb-3 ${isUp ? "text-green-600" : "text-red-600"}`}>
                <div className="flex items-center space-x-1">
                  {isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  <span className="font-semibold text-sm">
                    {isUp ? '+' : ''}{formatCurrency(Math.abs(stock.change))}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {formatPercentage(stock.change, stock.price)}
                </div>
              </div>

              {/* Action buttons - only visible on hover */}
              <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="shadow-lg text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className={`shadow-lg text-xs ${isUp ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trade
                  </Button>
                </div>
              </div>

              {/* Bottom indicator line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
                isUp ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString('en-IN')} IST
        </div>
        <Button 
          variant="outline" 
          className="group"
          onClick={() => navigate('/stocks')}
        >
          View All Stocks
          <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
