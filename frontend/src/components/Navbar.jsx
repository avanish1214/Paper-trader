import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() !== "") {
        axios
          .get(`https://papertrader-1.onrender.com/api/stocks/search?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => {
            const filtered = res.data.results || [];
            setResults(filtered);
            setShowDropdown(true);
          })
          .catch(err => {
            console.error("Search error", err);
            setResults([]);
            setShowDropdown(false);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 shadow-md bg-white z-50">
      {/* Brand */}
      <div
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => navigate("/")}
      >
        PaperTrader
      </div>

      {/* Search */}
      <div className="relative w-1/3">
        <Input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {showDropdown && results.length > 0 && (
          <div className="absolute mt-1 w-full bg-white border shadow-md rounded max-h-64 overflow-y-auto z-50">
            {results.map((stock) => (
              <div
                key={stock.symbol}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(`/stock/${stock.symbol}`);
                  setQuery("");
                  setShowDropdown(false);
                }}
              >
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-gray-600">
                  {stock.name} • {stock.region}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/portfolio")}>
          Portfolio
        </Button>
        <Button variant="ghost" onClick={() => navigate("/trades")}>
          Past Trades
        </Button>
        <Button variant="outline" onClick={() => navigate("/add-money")}>
          Add Money
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
