import React, { useState, useEffect } from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import { api } from "../../services/api.js";
import { money, cents } from "../../utils/format.js";

export default function CloseShift({ shift, onSubmit, busy }) {
  const [s, setS] = useState(null),
    [amount, setAmount] = useState("");
  useEffect(() => {
    api("/shifts/" + shift.id).then(setS);
  }, []);
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(amount);
      }}
    >
      {s && (
        <>
          <div className="bill-line">
            <span>Opening float</span>
            <b>{money(s.opening_cash)}</b>
          </div>
          <div className="bill-line">
            <span>Cash sales (after refunds)</span>
            <b>{money(s.expected_cash - s.opening_cash)}</b>
          </div>
          <div className="bill-total">
            <span>Expected till cash</span>
            <b>{money(s.expected_cash)}</b>
          </div>
        </>
      )}
      <Field
        label="Counted cash in till (₦)"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      {s && amount !== "" && (
        <div className="bill-line">
          <span>Variance</span>
          <b>{money(cents(amount) - s.expected_cash)}</b>
        </div>
      )}
      <p className="form-note">
        Finish or hold your current sale before closing. Card and transfer
        payments are excluded from till cash.
      </p>
      <Button className="primary full" disabled={busy || !s}>
        Close shift
      </Button>
    </form>
  );
}
