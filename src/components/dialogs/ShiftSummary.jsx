import React from "react";
import { money, date } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function ShiftSummary() {
  const { modal } = usePOS();
  return (
    <div className="form-body">
      <h3>
        {modal.data.staff} · Shift #{modal.data.id}
      </h3>
      <p>{date(modal.data.opened_at)}</p>
      <div className="bill-line">
        <span>Opening cash</span>
        <b>{money(modal.data.opening_cash)}</b>
      </div>
      {modal.data.payments.map((p) => (
        <div className="bill-line" key={p.payment}>
          <span>{p.payment} sales</span>
          <b>{money(p.total)}</b>
        </div>
      ))}
      <div className="bill-total">
        <span>Expected cash</span>
        <b>{money(modal.data.expected_cash)}</b>
      </div>
      {modal.data.closed_at && (
        <>
          <div className="bill-line">
            <span>Counted cash</span>
            <b>{money(modal.data.closing_cash)}</b>
          </div>
          <div className="bill-line">
            <span>Variance</span>
            <b>{money(modal.data.closing_cash - modal.data.expected_cash)}</b>
          </div>
        </>
      )}
    </div>
  );
}
