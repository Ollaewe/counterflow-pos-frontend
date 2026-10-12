import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";

import { api } from "../../services/api.js";
import { cents } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function ProductForm() {
  const { modal, busy, action, categories } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        const b = Object.fromEntries(new FormData(e.target));
        action(
          () =>
            api("/products", {
              ...b,
              id: modal.data.id,
              price: cents(b.price),
              cost: cents(b.cost),
              stock: Number(b.stock || 0),
              reorder_level: Number(b.reorder_level),
            }),
          "Product saved",
        );
      }}
    >
      <Field
        label="Product name"
        name="name"
        defaultValue={modal.data.name}
        required
      />
      <div className="form-grid">
        <Field label="SKU" name="sku" defaultValue={modal.data.sku} required />
        <Field
          label="Barcode (optional)"
          name="barcode"
          defaultValue={modal.data.barcode}
        />
      </div>
      <Field
        label="Category"
        name="category"
        list="categories"
        defaultValue={modal.data.category || "Groceries"}
        required
      />
      <datalist id="categories">
        {categories.slice(1).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </datalist>
      <div className="form-grid">
        <Field
          label="Selling price (₦)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={modal.data.price / 100 || 0}
          required
        />
        <Field
          label="Cost price (₦)"
          name="cost"
          type="number"
          min="0"
          step="0.01"
          defaultValue={modal.data.cost / 100 || 0}
          required
        />
        {!modal.data.id && (
          <Field
            label="Opening stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue="0"
            required
          />
        )}
        <Field
          label="Reorder level"
          name="reorder_level"
          type="number"
          min="0"
          step="1"
          defaultValue={modal.data.reorder_level ?? 5}
          required
        />
      </div>
      {modal.data.id && (
        <p className="form-note">
          Use Inventory → Adjust stock to change quantities.
        </p>
      )}
      <Button className="primary full" disabled={busy}>
        Save product
      </Button>
    </form>
  );
}
