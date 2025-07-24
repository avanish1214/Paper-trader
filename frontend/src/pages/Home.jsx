import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Clock, 
  Activity, 
  Target,
  Wallet,
  Plus,
  Eye,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const { token } = useAuth(); // Only get token from auth context
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('https://papertrader-1.onrender.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setUserProfile(data.data);
        } else {
          setError('Failed to load user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  // Use fetched user data
  const userCash = userProfile?.cash || 0;
  const userName = userProfile?.userName || userProfile?.username || "Trader";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-white space-y-6">
              <div className="space-y-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-4">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(currentTime)} IST • {formatDate(currentTime)}
                </Badge>
                <h1 className="text-5xl font-bold leading-tight">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {userName}
                  </span>
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Monitor real-time market data, track your portfolio, and execute trades with confidence
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => navigate('/portfolio')}
                >
                  <PieChart className="w-5 h-5 mr-2" />
                  View Portfolio
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/trades')}
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Trading History
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/add-money')}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Add Funds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Live Stock Feed - Moved to top */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Live Stock Feed
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-normal">Real-time Updates</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StockTicker />
              </CardContent>
            </Card>

            {/* Cash Balance Card - Now below stock feed */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Balance</h3>
                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(userCash)}</div>
                    <p className="text-sm text-gray-600 mt-1">Ready to trade</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <CardContent className="p-6 text-center text-white space-y-4">
                <h3 className="text-lg font-bold flex items-center justify-center gap-2">
                  <Target className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                    onClick={() => navigate('/add-money')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/portfolio')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/trades')}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Trade History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Status */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Market Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NSE</span>
                  <Badge className="bg-green-100 text-green-800">Open</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">BSE</span>
                  <Badge className="bg-green-100 text-green-800">Open</Badge>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Market Close</span>
                    <span className="text-sm text-gray-900 font-medium">3:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Open</span>
                    <span className="text-sm text-gray-900 font-medium">9:15 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Cash</span>
                  <span className="text-sm text-gray-900 font-semibold">{formatCurrency(userCash)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-xs text-gray-600 font-mono">
                    {userProfile?._id ? `${userProfile._id.slice(-8)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge variant="outline">Paper Trading</Badge>
                </div>
                <div className="border-t pt-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/portfolio')}
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    View Full Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
