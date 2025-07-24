// src/components/StockCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/stock/${stock.symbol}`, { state: { stock } });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl p-4 mb-4">
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{stock.name}</h2>
            <p className="text-gray-600">{stock.symbol}</p>
            <p className="text-green-600 font-semibold">₹{stock.price}</p>
          </div>
          <Button onClick={handleView}>View</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
