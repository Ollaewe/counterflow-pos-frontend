import React from "react";
import { usePOS } from "../../context/POSContext.jsx";

export default function Footer() {
  const {} = usePOS();
  return (
    <footer className="app-footer">
      <span>Counterflow POS</span>
      <span>One store. One clear picture.</span>
    </footer>
  );
}
