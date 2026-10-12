import React, { createContext, useContext } from "react";
import usePOSController from "../hooks/usePOSController.js";
const POSContext = createContext(null);
export function POSProvider({ children }) {
  const value = usePOSController();
  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}
export function usePOS() {
  const value = useContext(POSContext);
  if (!value) throw new Error("usePOS must be used inside POSProvider");
  return value;
}
