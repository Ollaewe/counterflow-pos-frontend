import React from "react";
import { Wallet } from "lucide-react";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";
import { api } from "../../services/api.js";
import { money, cents } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function PaymentConfirmation() {
  const {
    busy,
    cart,
    setCart,
    customer,
    setCustomer,
    payment,
    setDiscount,
    tender,
    setTender,
    saleKey,
    setSaleKey,
    action,
    open,
    disc,
    total,
  } = usePOS();
  return (
    <div className="form-body">
      <div className="payment-confirm">
        <div className="shift-icon">
          <Wallet size={28} />
        </div>
        <span>Total to collect</span>
        <h1>{money(total)}</h1>
        <Badge type="success">
          {payment === "cash"
            ? "Cash payment"
            : payment === "card"
              ? "Card payment"
              : "Bank transfer"}
        </Badge>
      </div>
      <p>
        {payment === "cash"
          ? "Confirm that you have received " +
            money(cents(tender)) +
            " and return " +
            money(cents(tender) - total) +
            " change."
          : "Confirm that the " +
            payment +
            " payment has been received. This system records payments; it does not charge a card or verify bank transfers."}
      </p>
      <Button
        className="primary full"
        disabled={busy}
        onClick={async () => {
          const result = await action(
            () =>
              api("/sales", {
                request_key: saleKey,
                items: cart,
                customer_id: customer ? Number(customer) : null,
                discount: disc,
                payment,
                expected_total: total,
                tendered: cents(tender),
              }),
            "Sale completed",
          );
          if (result) {
            setCart([]);
            setTender("");
            setDiscount("0");
            setCustomer("");
            setSaleKey(crypto.randomUUID());
            open("receipt", result);
          }
        }}
      >
        {busy ? "Processing…" : "Payment received · complete sale"}
      </Button>
    </div>
  );
}
