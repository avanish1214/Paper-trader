import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PastTrades() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'

  useEffect(() => {
    fetchTrades();
  }, [token]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://papertrader-1.onrender.com/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Trades from API:', data); // Debug log
        setTrades(data);
      } else {
        setError('Failed to fetch trades');
      }
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError('Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  // Helper function to get type color safely - using 'order' field
  const getTypeColor = (order) => {
    const lowerOrder = order?.toLowerCase?.();
    if (lowerOrder === 'buy') return 'bg-green-100 text-green-800';
    if (lowerOrder === 'sell') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-600'; // fallback for unknown/missing types
  };

  // Safe filter function - using 'order' field
  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    const tradeOrder = trade.order?.toLowerCase?.();
    return tradeOrder === filter;
  });

  // Updated calculations using 'order' and correct field names
  const totalValue = trades.reduce((sum, trade) => sum + (trade.totalPrice || 0), 0);
  const totalBuys = trades.filter(t => t.order?.toLowerCase?.() === 'buy').length;
  const totalSells = trades.filter(t => t.order?.toLowerCase?.() === 'sell').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading trades...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTrades}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trading History</h1>
            <p className="text-gray-600 mt-1">View all your past trades</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Trades</div>
            <div className="text-2xl font-bold text-gray-900">{trades.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Buy Orders</div>
            <div className="text-2xl font-bold text-green-600">{totalBuys}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Sell Orders</div>
            <div className="text-2xl font-bold text-red-600">{totalSells}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All Trades ({trades.length})
            </Button>
            <Button
              variant={filter === 'buy' ? 'default' : 'outline'}
              onClick={() => setFilter('buy')}
              size="sm"
              className={filter === 'buy' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              Buy Orders ({totalBuys})
            </Button>
            <Button
              variant={filter === 'sell' ? 'default' : 'outline'}
              onClick={() => setFilter('sell')}
              size="sm"
              className={filter === 'sell' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            >
              Sell Orders ({totalSells})
            </Button>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTrades.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You haven't made any trades yet." 
                  : `No ${filter} orders found.`
                }
              </p>
              {filter !== 'all' && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilter('all')}
                  className="mt-4"
                >
                  View All Trades
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>Date & Time</div>
                  <div>Symbol</div>
                  <div>Type</div>
                  <div>Quantity</div>
                  <div>Price</div>
                  <div>Total Amount</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredTrades.map((trade, index) => (
                  <div key={trade._id || index} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Date & Time */}
                      <div className="text-sm text-gray-900">
                        {formatDate(trade.timestamp)}
                      </div>
                      
                      {/* Symbol */}
                      <div className="text-sm">
                        <button
                          onClick={() => navigate(`/stock/${trade.symbol}`)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {trade.symbol || 'N/A'}
                        </button>
                      </div>
                      
                      {/* Type - Using 'order' field */}
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(trade.order)}`}>
                          {(trade.order || 'N/A').toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="text-sm text-gray-900">
                        {trade.quantity || 0}
                      </div>
                      
                      {/* Price - Using 'pricePerstock' field */}
                      <div className="text-sm text-gray-900">
                        {formatCurrency(trade.pricePerstock)}
                      </div>
                      
                      {/* Total Amount - Using 'totalPrice' field */}
                      <div className={`text-sm font-medium ${
                        trade.order?.toLowerCase?.() === 'buy' ? 'text-red-600' : 
                        trade.order?.toLowerCase?.() === 'sell' ? 'text-green-600' : 
                        'text-gray-600'
                      }`}>
                        {trade.order?.toLowerCase?.() === 'buy' ? '-' : 
                         trade.order?.toLowerCase?.() === 'sell' ? '+' : ''}
                        {formatCurrency(trade.totalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination info */}
        {filteredTrades.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredTrades.length} of {trades.length} trades
          </div>
        )}
      </div>
    </div>
  );
}
