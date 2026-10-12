import React from "react";

import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Toolbar from "../components/ui/Toolbar.jsx";
import { money } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Products() {
  const { state, query, setQuery, open, matches } = usePOS();
  return (
    <section className="card">
      <Toolbar
        query={query}
        setQuery={setQuery}
        placeholder="Search products or SKU"
        right={<Badge>{state.products.length} products</Badge>}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches(state.products).map((p) => (
              <tr key={p.id}>
                <td>
                  <b>{p.name}</b>
                  <small>
                    {p.sku}
                    {p.barcode ? " · " + p.barcode : ""}
                  </small>
                </td>
                <td>{p.category}</td>
                <td className="number">{money(p.price)}</td>
                <td className="number">{money(p.cost)}</td>
                <td>{p.stock}</td>
                <td>
                  <Badge
                    type={
                      !p.active
                        ? "normal"
                        : p.stock <= p.reorder_level
                          ? "warning"
                          : "success"
                    }
                  >
                    {!p.active
                      ? "Archived"
                      : p.stock <= p.reorder_level
                        ? "Low stock"
                        : "Active"}
                  </Badge>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="text-btn"
                      onClick={() => open("product", p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-btn muted"
                      onClick={() => open("archive", p)}
                    >
                      {p.active ? "Archive" : "Restore"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!matches(state.products).length && <Empty />}
      </div>
    </section>
  );
}
