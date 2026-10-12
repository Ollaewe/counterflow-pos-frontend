import React from "react";
import { X, Check, TriangleAlert } from "lucide-react";
import Login from "./pages/Login.jsx";
import Reports from "./pages/Reports.jsx";
import Overview from "./pages/Overview.jsx";
import PointOfSale from "./pages/PointOfSale.jsx";
import Products from "./pages/Products.jsx";
import Inventory from "./pages/Inventory.jsx";
import Sales from "./pages/Sales.jsx";
import Customers from "./pages/Customers.jsx";
import Staff from "./pages/Staff.jsx";
import Shifts from "./pages/Shifts.jsx";
import Settings from "./pages/Settings.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import PageHeader from "./components/layout/PageHeader.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppModals from "./components/dialogs/AppModals.jsx";
import { usePOS } from "./context/POSContext.jsx";

export default function App() {
  const { state, status, page, error, setError, toast, modal, load } = usePOS();
  if (!state) {
    if (!status)
      return (
        <div className="loading">
          <div className="brand-mark">c</div>
          <h2>Opening your workspace…</h2>
          {error && <p>{error}</p>}
        </div>
      );
    return <Login setup={status.needsSetup} onSuccess={load} />;
  }
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className={"content " + (page === "pos" ? "pos-content" : "")}>
          {error && !modal && (
            <div className="error inline">
              <TriangleAlert size={18} />
              {error}
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={16} />
              </button>
            </div>
          )}
          {page !== "pos" && <PageHeader />}
          {page === "overview" && <Overview />}
          {page === "pos" && <PointOfSale />}
          {page === "products" && <Products />}
          {page === "inventory" && <Inventory />}
          {page === "sales" && <Sales />}
          {page === "customers" && <Customers />}
          {page === "staff" && <Staff />}
          {page === "reports" && <Reports />}
          {page === "shifts" && <Shifts />}
          {page === "settings" && <Settings />}
        </main>
        <Footer />
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      <AppModals />
    </div>
  );
}
