import { useState, useEffect } from 'react';

const TradingComponent = ({ symbol, currentPrice, socketConnected, token, userCash: initialCash = 0 }) => {
  const [activeTab, setActiveTab] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userCash, setUserCash] = useState(initialCash);
  const [userProfile, setUserProfile] = useState(null);
  const [ownedQuantity, setOwnedQuantity] = useState(0);

  // Fetch user profile to get current cash
  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  // Update cash when initialCash prop changes
  useEffect(() => {
    if (initialCash > 0) {
      setUserCash(initialCash);
    }
  }, [initialCash]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://papertrader-1.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
        setUserCash(data.data.cash || 0);
        // If you have owned quantity in the profile, set it here
        // setOwnedQuantity(data.data.ownedQuantity || 0);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleTrade = async (action) => {
    if (!quantity || quantity <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    if (!currentPrice) {
      setMessage({ type: 'error', text: 'Price not available' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = action === 'buy' ? '/api/buy' : '/api/sell';
      const response = await fetch(`https://papertrader-1.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: symbol,
          quantity: parseInt(quantity)
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: data.message 
        });
        setQuantity('');
        
        // Refresh user profile to get updated cash
        fetchUserProfile();
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || `Failed to ${action} stock` 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Failed to ${action} stock` 
      });
    } finally {
      setLoading(false);
    }
  };

  const totalValue = quantity && currentPrice ? (parseFloat(quantity) * currentPrice).toFixed(2) : '0.00';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Trade {symbol}</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">
            {socketConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Price</span>
          <span className="text-lg font-semibold text-gray-800">
            ₹{currentPrice?.toFixed(2) || 'N/A'}
          </span>
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'buy'
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sell'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Trading Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter quantity"
            disabled={loading}
          />
        </div>

        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Value:</span>
            <span className="font-semibold">₹{totalValue}</span>
          </div>
          {activeTab === 'buy' && (
            <>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Available Cash:</span>
                <span className={`font-semibold ${userCash >= parseFloat(totalValue) ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{userCash?.toFixed(2) || '0.00'}
                </span>
              </div>
              {userCash < parseFloat(totalValue) && quantity && (
                <div className="text-xs text-red-500 mt-1">
                  Insufficient funds (Need: ₹{(parseFloat(totalValue) - userCash).toFixed(2)} more)
                </div>
              )}
            </>
          )}
          {activeTab === 'sell' && (
            <div className="text-xs text-yellow-500 mt-1">
              Note: Sell validation will be checked on server
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleTrade(activeTab)}
          disabled={
            loading || 
            !quantity || 
            !currentPrice ||
            (activeTab === 'buy' && userCash < parseFloat(totalValue))
          }
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === 'buy'
              ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
              : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${symbol}`
          )}
        </button>

        {/* Message Display */}
        {message.text && (
          <div className={`p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600 mb-2 block">Quick Select:</span>
        <div className="flex gap-2">
          {[1, 5, 10, 25].map((num) => (
            <button
              key={num}
              onClick={() => setQuantity(num.toString())}
              className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {num}
            </button>
          ))}
          {activeTab === 'sell' && ownedQuantity > 0 && (
            <button
              onClick={() => setQuantity(ownedQuantity.toString())}
              className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
              disabled={loading}
            >
              All ({ownedQuantity})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingComponent;
