import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import Select from "../ui/Select.jsx";
import { api } from "../../services/api.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function StockAdjustmentForm() {
  const { modal, busy, action, active } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        const b = Object.fromEntries(new FormData(e.target));
        action(
          () =>
            api("/stock", {
              ...b,
              product_id: Number(b.product_id),
              quantity: Number(b.quantity),
            }),
          "Stock updated",
        );
      }}
    >
      <Select
        label="Product"
        name="product_id"
        defaultValue={modal.data.product_id}
        required
      >
        {active.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} · {p.stock} available
          </option>
        ))}
      </Select>
      <Field
        label="Quantity adjustment (+ add, − remove)"
        name="quantity"
        type="number"
        step="1"
        required
      />
      <Field
        label="Reason"
        name="reason"
        placeholder="e.g. Delivery, damage, stock count"
        required
      />
      <Button className="primary full" disabled={busy}>
        Save adjustment
      </Button>
    </form>
  );
}
