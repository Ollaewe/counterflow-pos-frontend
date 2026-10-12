import React, { useState, useEffect } from "react";
import {
  ReceiptText,
  ChartNoAxesCombined,
  Wallet,
  ArrowDownToLine,
  Store,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Field from "../components/ui/Field.jsx";
import Stat from "../components/dashboard/Stat.jsx";
import { api } from "../services/api.js";
import { money, today } from "../utils/format.js";
import { download } from "../utils/exportCsv.js";

export default function Reports() {
  const [from, setFrom] = useState(today().slice(0, 7) + "-01"),
    [to, setTo] = useState(today()),
    [r, setR] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    setR(null);
    api("/reports?from=" + from + "&to=" + to)
      .then((v) => {
        if (live) {
          setR(v);
          setError("");
        }
      })
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [from, to]);
  return (
    <>
      <section className="report-controls">
        <div className="form-grid">
          <Field
            label="From (UTC)"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Field
            label="To (UTC)"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <Button
          icon={ArrowDownToLine}
          disabled={!r}
          onClick={() =>
            download("daily-sales-report.csv", [
              ["Date (UTC)", "Revenue NGN", "Transactions"],
              ...r.daily.map((d) => [d.day, d.revenue / 100, d.count]),
            ])
          }
        >
          Export report
        </Button>
      </section>
      {error && <div className="error">{error}</div>}
      {r ? (
        <>
          <div className="stats">
            <Stat
              label="Net sales collected"
              value={money(r.totals.revenue)}
              icon={Wallet}
              highlight
            />
            <Stat
              label="Transactions"
              value={r.totals.transactions}
              icon={ReceiptText}
            />
            <Stat
              label="Gross profit"
              value={money(r.totals.gross_profit)}
              icon={ChartNoAxesCombined}
              foot="Excludes tax; after discounts"
            />
            <Stat
              label="Tax collected"
              value={money(r.totals.tax)}
              icon={Store}
            />
          </div>
          <div className="overview-grid">
            <section className="card">
              <div className="card-head">
                <h2>Best-selling products</h2>
                <Badge>By sales value</Badge>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units</th>
                      <th>Before discounts & tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.top.map((p, i) => (
                      <tr key={i}>
                        <td>
                          <b>{p.name}</b>
                        </td>
                        <td>{p.quantity}</td>
                        <td>{money(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!r.top.length && <Empty title="No sales in this period" />}
              </div>
            </section>
            <section className="card">
              <div className="card-head">
                <h2>Payment breakdown</h2>
              </div>
              {r.payments.map((p) => (
                <div className="stock-watch" key={p.payment}>
                  <div className="mini-icon">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <b className="capitalize">{p.payment}</b>
                    <small>{p.count} transactions</small>
                  </div>
                  <strong>{money(p.revenue)}</strong>
                </div>
              ))}
              {!r.payments.length && <Empty />}
            </section>
          </div>
          <section className="card spaced">
            <div className="card-head">
              <h2>Daily sales</h2>
              <small>Refunded sales excluded</small>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date (UTC)</th>
                    <th>Transactions</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {r.daily.map((d) => (
                    <tr key={d.day}>
                      <td>{d.day}</td>
                      <td>{d.count}</td>
                      <td>{money(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!r.daily.length && <Empty />}
            </div>
          </section>
        </>
      ) : (
        !error && <div className="empty">Loading report…</div>
      )}
    </>
  );
}
