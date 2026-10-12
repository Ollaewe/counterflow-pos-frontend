import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { POSProvider } from "./context/POSContext.jsx";
import "./style.css";
createRoot(document.getElementById("root")).render(
  <POSProvider>
    <App />
  </POSProvider>,
);
