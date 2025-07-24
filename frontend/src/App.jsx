// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import Layout from "./components/Layout";
import AddMoney from "./pages/AddMoney";
import PrivateRoute from "./components/PrivateRoute";
import StockDetail from "./pages/StockDetail";
import PastTrades from "./pages/PastTrades";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/add-money" element={<AddMoney />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/trades" element={<PastTrades />} />
      </Route>
    </Routes>
  );
}

export default App;
