import React from "react";

import Button from "../components/ui/Button.jsx";
import Field from "../components/ui/Field.jsx";

import { api } from "../services/api.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Settings() {
  const { state, busy, action } = usePOS();
  return (
    <section className="card settings-card">
      <div className="card-head">
        <h2>Store & receipt details</h2>
      </div>
      <form
        className="form-body"
        onSubmit={(e) => {
          e.preventDefault();
          const b = Object.fromEntries(new FormData(e.target));
          action(
            () =>
              api("/settings", {
                ...b,
                tax_bps: Math.round(Number(b.tax) * 100),
              }),
            "Store settings updated",
          );
        }}
      >
        <Field
          label="Store name"
          name="store_name"
          defaultValue={state.settings.store_name}
          required
        />
        <Field
          label="Address"
          name="address"
          defaultValue={state.settings.address}
        />
        <div className="form-grid">
          <Field
            label="Phone"
            name="phone"
            defaultValue={state.settings.phone}
          />
          <Field
            label="Sales tax (%)"
            name="tax"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={state.settings.tax_bps / 100}
          />
        </div>
        <Field
          label="Receipt footer"
          name="receipt_note"
          defaultValue={state.settings.receipt_note}
        />
        <div className="settings-note">
          Currency: Nigerian naira (NGN). Tax is added after any discount. Your
          configured rate applies to new sales.
        </div>
        <Button className="primary" disabled={busy}>
          Save settings
        </Button>
      </form>
    </section>
  );
}
