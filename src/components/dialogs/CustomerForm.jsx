import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import { api } from "../../services/api.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function CustomerForm() {
  const { busy, action } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        action(
          () => api("/customers", Object.fromEntries(new FormData(e.target))),
          "Customer added",
        );
      }}
    >
      <Field label="Customer name" name="name" required />
      <Field label="Phone" name="phone" type="tel" />
      <Field label="Email" name="email" type="email" />
      <Button className="primary full" disabled={busy}>
        Add customer
      </Button>
    </form>
  );
}
