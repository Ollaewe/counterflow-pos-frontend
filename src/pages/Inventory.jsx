import React from "react";
import { Boxes, Wallet, TriangleAlert } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Toolbar from "../components/ui/Toolbar.jsx";
import Stat from "../components/dashboard/Stat.jsx";
import { money, date } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Inventory() {
  const { state, query, setQuery, open, active, low, matches } = usePOS();
  return (
    <>
      <div className="stats three">
        <Stat
          label="Units in stock"
          value={active.reduce((a, p) => a + p.stock, 0).toLocaleString()}
          icon={Boxes}
        />
        <Stat
          label="Stock value at cost"
          value={money(active.reduce((a, p) => a + p.stock * p.cost, 0))}
          icon={Wallet}
          highlight
        />
        <Stat
          label="Below reorder level"
          value={low.length}
          icon={TriangleAlert}
        />
      </div>
      <section className="card">
        <Toolbar
          query={query}
          setQuery={setQuery}
          placeholder="Find a product"
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Available</th>
                <th>Reorder level</th>
                <th>Stock value</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matches(active).map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <small>
                      {p.sku} · {p.category}
                    </small>
                  </td>
                  <td className="big-number">{p.stock}</td>
                  <td>{p.reorder_level}</td>
                  <td>{money(p.stock * p.cost)}</td>
                  <td>
                    <Badge
                      type={
                        p.stock === 0
                          ? "danger"
                          : p.stock <= p.reorder_level
                            ? "warning"
                            : "success"
                      }
                    >
                      {p.stock === 0
                        ? "Out of stock"
                        : p.stock <= p.reorder_level
                          ? "Reorder soon"
                          : "In stock"}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => open("stock", { product_id: p.id })}
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card spaced">
        <div className="card-head">
          <h2>Stock movement ledger</h2>
          <small>Latest 100 movements</small>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Team member</th>
              </tr>
            </thead>
            <tbody>
              {state.movements.map((m) => (
                <tr key={m.id}>
                  <td>{date(m.created_at)}</td>
                  <td>{m.product}</td>
                  <td>
                    <Badge type={m.quantity > 0 ? "success" : "normal"}>
                      {m.quantity > 0 ? "+" : ""}
                      {m.quantity}
                    </Badge>
                  </td>
                  <td>{m.reason}</td>
                  <td>{m.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!state.movements.length && <Empty title="No stock movements yet" />}
        </div>
      </section>
    </>
  );
}
