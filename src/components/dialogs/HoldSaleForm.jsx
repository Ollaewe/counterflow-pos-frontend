import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import { api } from "../../services/api.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function HoldSaleForm() {
  const {
    busy,
    cart,
    setCart,
    customer,
    setCustomer,
    setDiscount,
    setTender,
    setSaleKey,
    action,
  } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={async (e) => {
        e.preventDefault();
        const label = new FormData(e.target).get("label");
        const r = await action(
          () =>
            api("/held", {
              label,
              items: cart,
              customer_id: customer ? Number(customer) : null,
            }),
          "Sale held",
        );
        if (r) {
          setCart([]);
          setCustomer("");
          setTender("");
          setDiscount("0");
          setSaleKey(crypto.randomUUID());
        }
      }}
    >
      <Field
        label="Name this cart"
        name="label"
        placeholder="Customer name or a quick note"
        required
      />
      <p>Current prices and stock will be checked when you resume.</p>
      <Button className="primary full" disabled={busy}>
        Hold sale
      </Button>
    </form>
  );
}
