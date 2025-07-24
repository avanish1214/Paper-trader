// src/components/PrivateRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a spinner

  return user ? children : <Navigate to="/login" replace />;
}
