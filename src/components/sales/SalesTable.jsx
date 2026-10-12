import React from "react";
import { ReceiptText } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import Empty from "../ui/Empty.jsx";
import { money, date } from "../../utils/format.js";

export default function SalesTable({ sales, onView }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Receipt</th>
            <th>Customer</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>
                <b>CF-{String(s.id).padStart(6, "0")}</b>
                <small>{date(s.created_at)}</small>
              </td>
              <td>
                {s.customer || "Walk-in customer"}
                <small>{s.cashier}</small>
              </td>
              <td className="capitalize">{s.payment}</td>
              <td className="number">{money(s.total)}</td>
              <td>
                <Badge type={s.status === "completed" ? "success" : "warning"}>
                  {s.status}
                </Badge>
              </td>
              <td>
                <button className="text-btn" onClick={() => onView(s)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!sales.length && (
        <Empty
          title="No sales yet"
          text="Completed transactions will appear here."
          icon={ReceiptText}
        />
      )}
    </div>
  );
}
