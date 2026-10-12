import React from "react";
import { ShoppingBasket, Printer, RotateCcw } from "lucide-react";
import Button from "../ui/Button.jsx";
import { money, date } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function ReceiptDialog() {
  const { state, open, isAdmin, receipt } = usePOS();
  return (
    <>
      <div className="receipt" id="receipt">
        <div className="receipt-logo">
          <ShoppingBasket size={28} />
        </div>
        <h2>{state.settings.store_name}</h2>
        <p>{state.settings.address}</p>
        <p>{state.settings.phone}</p>
        <div className="receipt-divider" />
        <div className="receipt-meta">
          <span>Receipt</span>
          <b>CF-{String(receipt.id).padStart(6, "0")}</b>
          <span>Date</span>
          <b>{date(receipt.created_at)}</b>
          <span>Cashier</span>
          <b>{receipt.cashier}</b>
          <span>Customer</span>
          <b>{receipt.customer || "Walk-in customer"}</b>
        </div>
        <div className="receipt-divider" />
        {receipt.items.map((i) => (
          <div className="receipt-item" key={i.id}>
            <b>{i.name}</b>
            <div>
              <span>
                {i.quantity} × {money(i.price)}
              </span>
              <b>{money(i.quantity * i.price)}</b>
            </div>
          </div>
        ))}
        <div className="receipt-divider" />
        <div className="bill-line">
          <span>Subtotal</span>
          <b>{money(receipt.subtotal)}</b>
        </div>
        <div className="bill-line">
          <span>Discount</span>
          <b>−{money(receipt.discount)}</b>
        </div>
        <div className="bill-line">
          <span>Tax</span>
          <b>{money(receipt.tax)}</b>
        </div>
        <div className="bill-total">
          <span>Total</span>
          <b>{money(receipt.total)}</b>
        </div>
        <div className="bill-line">
          <span>Payment</span>
          <b>{receipt.payment}</b>
        </div>
        <div className="bill-line">
          <span>Received</span>
          <b>{money(receipt.tendered)}</b>
        </div>
        <div className="bill-line">
          <span>Change</span>
          <b>{money(receipt.change)}</b>
        </div>
        {receipt.status === "refunded" && (
          <div className="refund-stamp">
            REFUNDED<p>{receipt.refund_reason}</p>
          </div>
        )}
        <div className="receipt-divider" />
        <p className="receipt-thanks">{state.settings.receipt_note}</p>
      </div>
      <div className="modal-actions no-print">
        <Button
          icon={Printer}
          className="primary"
          onClick={() => window.print()}
        >
          Print receipt
        </Button>
        {isAdmin && receipt.status === "completed" && (
          <Button icon={RotateCcw} onClick={() => open("refund", receipt)}>
            Refund sale
          </Button>
        )}
      </div>
    </>
  );
}
