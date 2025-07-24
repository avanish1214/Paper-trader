import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ symbol, socketConnected }) => {
  const containerRef = useRef();

  useEffect(() => {
    // Clear any existing widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": `BSE:${symbol}`, // Using NSE format for Indian stocks
      "chartOnly": false, // Shows price info + chart
      "dateRange": "12M", // 12 months of data
      "noTimeScale": false,
      "colorTheme": "light", // You can change to "dark"
      "isTransparent": false,
      "locale": "en",
      "width": "100%",
      "autosize": true,
      "height": "100%"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {symbol} Price Chart
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              socketConnected ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-500">
              TradingView Data
            </span>
          </div>
        </div>
      </div>

      {/* TradingView Mini Widget Container */}
      <div className="tradingview-widget-container" style={{ height: '400px' }} ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TradingViewWidget;
