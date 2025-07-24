import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const dummyTrades = [
  {
    id: 1,
    type: "Buy",
    symbol: "AAPL",
    quantity: 10,
    price: 150,
    total: 1500,
    date: "2025-07-20",
  },
  {
    id: 2,
    type: "Sell",
    symbol: "AAPL",
    quantity: 5,
    price: 180,
    total: 900,
    profit: 150,
    date: "2025-07-22",
  },
  {
    id: 3,
    type: "Buy",
    symbol: "TSLA",
    quantity: 3,
    price: 600,
    total: 1800,
    date: "2025-07-18",
  },
  {
    id: 4,
    type: "Sell",
    symbol: "TSLA",
    quantity: 3,
    price: 580,
    total: 1740,
    profit: -60,
    date: "2025-07-23",
  },
];

export default function PastTrades() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Past Trades</h1>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Symbol</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              {dummyTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="text-sm border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2">{trade.date}</td>
                  <td
                    className={`p-2 font-medium ${
                      trade.type === "Buy" ? "text-blue-600" : "text-orange-600"
                    }`}
                  >
                    {trade.type}
                  </td>
                  <td className="p-2">{trade.symbol}</td>
                  <td className="p-2">{trade.quantity}</td>
                  <td className="p-2">₹{trade.price}</td>
                  <td className="p-2">₹{trade.total}</td>
                  <td className="p-2 font-semibold">
                    {trade.type === "Sell" ? (
                      <span
                        className={
                          trade.profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        ₹{trade.profit}
                      </span>
                    ) : (
                      "--"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
