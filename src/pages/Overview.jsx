import React from "react";
import {
  Package,
  Boxes,
  ReceiptText,
  Wallet,
  Banknote,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Stat from "../components/dashboard/Stat.jsx";
import SalesTable from "../components/sales/SalesTable.jsx";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import { api } from "../services/api.js";
import { money } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Overview() {
  const {
    state,
    open,
    navigate,
    active,
    completed,
    daySales,
    low,
    categories,
  } = usePOS();
  return (
    <>
      <div className="stats">
        <Stat
          label="Today’s revenue"
          value={money(daySales.reduce((a, s) => a + s.total, 0))}
          icon={Wallet}
          highlight
        />
        <Stat
          label="Transactions today"
          value={daySales.length}
          icon={ReceiptText}
          foot="Completed sales"
        />
        <Stat
          label="Active products"
          value={active.length}
          icon={Package}
          foot={categories.length - 1 + " categories"}
        />
        <Stat
          label="Low-stock items"
          value={low.length}
          icon={Boxes}
          foot={
            low.length ? "Needs your attention" : "Stock levels look healthy"
          }
        />
      </div>
      <div className="overview-grid">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <h2>Sales activity</h2>
              <p>Revenue over the last 7 days</p>
            </div>
            <Badge>Last 7 days</Badge>
          </div>
          <RevenueChart sales={completed} />
        </section>
        <section className="card payment-card">
          <h2>Today’s payment mix</h2>
          <p>How your customers paid</p>
          <div className="payment-total">
            <span>Total collected</span>
            <b>{money(daySales.reduce((a, s) => a + s.total, 0))}</b>
          </div>
          {[
            ["cash", "Cash", Banknote],
            ["card", "Card", CreditCard],
            ["transfer", "Bank transfer", ArrowLeftRight],
          ].map(([key, label, Icon]) => {
            const v = daySales
              .filter((s) => s.payment === key)
              .reduce((a, s) => a + s.total, 0);
            return (
              <div className="payment-line" key={key}>
                <div>
                  <Icon size={18} />
                  <span>{label}</span>
                  <b>{money(v)}</b>
                </div>
                <div className="progress">
                  <span
                    style={{
                      width:
                        (v / (daySales.reduce((a, s) => a + s.total, 0) || 1)) *
                          100 +
                        "%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </div>
      <div className="overview-grid bottom">
        <section className="card">
          <div className="card-head">
            <h2>Recent transactions</h2>
            <button className="text-btn" onClick={() => navigate("sales")}>
              View all
            </button>
          </div>
          <SalesTable
            sales={state.sales.slice(0, 5)}
            onView={async (s) => open("receipt", await api("/sales/" + s.id))}
          />
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Stock watch</h2>
            <Badge type="warning">{low.length} items</Badge>
          </div>
          {low.length ? (
            low.slice(0, 4).map((p) => (
              <div className="stock-watch" key={p.id}>
                <div className="mini-icon">
                  <Package size={20} />
                </div>
                <div>
                  <b>{p.name}</b>
                  <small>{p.category}</small>
                </div>
                <Badge type={p.stock === 0 ? "danger" : "warning"}>
                  {p.stock} left
                </Badge>
              </div>
            ))
          ) : (
            <Empty
              title="Shelves are looking good"
              text="No products below their reorder level."
            />
          )}
          <button
            className="text-btn stock-link"
            onClick={() => navigate("inventory")}
          >
            Manage inventory
          </button>
        </section>
      </div>
    </>
  );
}
