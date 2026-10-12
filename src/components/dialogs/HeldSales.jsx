import React from "react";
import { Trash2, Pause } from "lucide-react";
import Button from "../ui/Button.jsx";
import Empty from "../ui/Empty.jsx";
import { api } from "../../services/api.js";
import { date } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function HeldSales() {
  const {
    state,
    busy,
    cart,
    setCart,
    setCustomer,
    setDiscount,
    setTender,
    setSaleKey,
    action,
    open,
  } = usePOS();
  return (
    <div className="form-body">
      {state.held.length ? (
        state.held.map((h) => (
          <div className="held-row" key={h.id}>
            <div>
              <b>{h.label}</b>
              <small>
                {h.items.reduce((a, i) => a + i.quantity, 0)} items ·{" "}
                {date(h.created_at)}
              </small>
            </div>
            <Button
              disabled={cart.length > 0 || busy}
              onClick={async () => {
                const r = await action(
                  () => api("/held/" + h.id, {}, "DELETE"),
                  "Sale resumed",
                );
                if (r) {
                  setCart(h.items);
                  setCustomer(h.customer_id || "");
                  setTender("");
                  setDiscount("0");
                  setSaleKey(crypto.randomUUID());
                }
              }}
            >
              Resume
            </Button>
            <button
              className="icon-btn"
              aria-label="Delete held cart"
              disabled={busy}
              onClick={async () => {
                await action(
                  () => api("/held/" + h.id, {}, "DELETE"),
                  "Held cart deleted",
                );
                open("held");
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))
      ) : (
        <Empty title="No held sales" icon={Pause} />
      )}{" "}
      {!!cart.length && (
        <p className="form-note">
          Hold or clear the current cart before resuming another.
        </p>
      )}
    </div>
  );
}
