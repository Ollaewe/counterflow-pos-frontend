import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import { api } from "../../services/api.js";
import { cents } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function OpenShiftForm() {
  const { busy, action } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        action(
          () =>
            api("/shifts/open", {
              opening_cash: cents(new FormData(e.target).get("amount")),
            }),
          "Shift opened",
        );
      }}
    >
      <p>Count the cash currently in your till.</p>
      <Field
        label="Opening cash (₦)"
        name="amount"
        type="number"
        min="0"
        step="0.01"
        defaultValue="0"
        required
      />
      <Button className="primary full" disabled={busy}>
        Open shift
      </Button>
    </form>
  );
}
