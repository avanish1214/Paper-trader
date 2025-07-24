import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Wallet, ArrowUpRight, ArrowDownRight, Eye, RefreshCw } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#8B5CF6", "#EC4899", "#10B981"];
const SOCKET_URL = "https://papertrader-1.onrender.com";

export default function Portfolio() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // Fetch portfolio holdings
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://papertrader-1.onrender.com/api/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPortfolio(response.data.portfolio);
      } catch (err) {
        setError("Failed to fetch portfolio.");
        console.error("Error fetching portfolio", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPortfolio();
    }
  }, [token]);

  // Setup socket connection for real-time prices
  useEffect(() => {
    if (!token || !portfolio?.holdings?.length) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true
    });

    socketRef.current.on("connect", () => {
      console.log("Portfolio socket connected");
      setSocketConnected(true);
      
      // Subscribe to all portfolio symbols
      portfolio.holdings.forEach(holding => {
        const fullSymbol = `${holding.symbol}.NS`;
        socketRef.current.emit("subscribe-symbol", fullSymbol);
      });
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Portfolio socket connection error:", error);
      setSocketConnected(false);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Portfolio socket disconnected:", reason);
      setSocketConnected(false);
    });

    // Listen for live price updates
    socketRef.current.on("symbol-price", (data) => {
      const symbol = data.symbol.replace('.NS', '');
      setCurrentPrices(prev => ({
        ...prev,
        [symbol]: data.price
      }));
    });

    return () => {
      if (socketRef.current) {
        portfolio.holdings.forEach(holding => {
          socketRef.current.emit("unsubscribe-symbol", `${holding.symbol}.NS`);
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
    };
  }, [token, portfolio?.holdings]);

  // Fetch current prices from API (fallback or initial load)
  const fetchCurrentPrices = async () => {
    if (!portfolio?.holdings?.length) return;

    try {
      setPricesLoading(true);
      const symbols = portfolio.holdings.map(h => h.symbol).join(',');
      
      // Replace with your actual price API endpoint
      const response = await axios.get(`https://papertrader-1.onrender.com/api/prices?symbols=${symbols}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCurrentPrices(response.data.prices);
      }
    } catch (err) {
      console.error("Error fetching current prices:", err);
    } finally {
      setPricesLoading(false);
    }
  };

  // Fetch prices when portfolio loads
  useEffect(() => {
    if (portfolio?.holdings?.length) {
      fetchCurrentPrices();
    }
  }, [portfolio?.holdings]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio) return null;

  // Enhanced calculations with current prices
  const enrichedHoldings = portfolio.holdings.map(holding => {
    const currentPrice = currentPrices[holding.symbol] || holding.price; // Fallback to portfolio price
    const averagePrice = holding.averagePrice || holding.price;
    const gainLoss = currentPrice - averagePrice;
    const gainLossPercentage = (gainLoss / averagePrice) * 100;
    const currentValue = currentPrice * holding.quantity;
    
    return {
      ...holding,
      currentPrice,
      averagePrice,
      gainLoss,
      gainLossPercentage,
      currentValue
    };
  });

  const totalInvestment = enrichedHoldings.reduce((acc, h) => acc + h.averagePrice * h.quantity, 0);
  const currentValue = enrichedHoldings.reduce((acc, h) => acc + h.currentValue, 0);
  const totalGainLoss = currentValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
  const cashBalance = user?.cash || 0;
  const totalPortfolioValue = currentValue + cashBalance;

  const pieData = enrichedHoldings.map((h) => ({
    name: h.symbol,
    value: h.currentValue,
    percentage: (h.currentValue / currentValue) * 100,
  }));

  const topPerformer = enrichedHoldings.reduce((max, h) => 
    h.gainLossPercentage > max.gainLossPercentage ? h : max, enrichedHoldings[0]
  );

  const worstPerformer = enrichedHoldings.reduce((min, h) => 
    h.gainLossPercentage < min.gainLossPercentage ? h : min, enrichedHoldings[0]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Overview
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Track your investments and performance
            {socketConnected && (
              <Badge className="bg-green-100 text-green-800">
                Live Prices
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchCurrentPrices}
            disabled={pricesLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${pricesLoading ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
          <Button variant="outline" onClick={() => navigate('/trades')}>
            <Eye className="w-4 h-4 mr-2" />
            View Trades
          </Button>
          <Button onClick={() => navigate('/')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Trade Now
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              Including {formatCurrency(cashBalance)} cash
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolio.holdings.length} holdings
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${totalGainLoss >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalGainLoss >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-600" /> : 
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
            <p className={`text-xs flex items-center ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {formatPercentage(totalGainLossPercentage)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cashBalance)}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => navigate('/add-money')}
            >
              Add more funds →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Current Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedHoldings.map((holding, index) => (
                  <TableRow key={holding.symbol} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{holding.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{holding.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.averagePrice)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {formatCurrency(holding.currentPrice)}
                        {currentPrices[holding.symbol] && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Price" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={holding.gainLoss >= 0 ? "default" : "destructive"} 
                             className={holding.gainLoss >= 0 ? "bg-green-100 text-green-800" : ""}>
                        {formatPercentage(holding.gainLossPercentage)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(holding.currentValue)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/stock/${holding.symbol}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.percentage.toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{topPerformer.symbol}</span>
                <Badge className="bg-green-100 text-green-800">
                  +{topPerformer.gainLossPercentage.toFixed(2)}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {topPerformer.quantity} shares • {formatCurrency(topPerformer.currentValue)} value
              </div>
              <Progress 
                value={Math.min(topPerformer.gainLossPercentage, 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{worstPerformer.symbol}</span>
                <Badge variant="destructive">
                  {worstPerformer.gainLossPercentage.toFixed(2)}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {worstPerformer.quantity} shares • {formatCurrency(worstPerformer.currentValue)} value
              </div>
              <Progress 
                value={Math.abs(Math.max(worstPerformer.gainLossPercentage, -100))} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
