// src/pages/AddMoney.jsx

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AddMoney() {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      const res = await axios.post(
        "https://papertrader-1.onrender.com/api/add-money",
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Money added successfully!");
      setAmount(""); // Clear input after success
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-xl">Add Money to Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="amount" className="mb-1 block">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Money
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
