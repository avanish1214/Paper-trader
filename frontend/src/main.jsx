import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import "./index.css"; // Make sure Tailwind styles are loaded

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors /> {/* Sonner toast notifications */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
