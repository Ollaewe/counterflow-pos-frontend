import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import { api } from "../../services/api.js";
import { money } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function RefundForm() {
  const { modal, busy, action } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        action(
          () =>
            api("/sales/" + modal.data.id + "/refund", {
              reason: new FormData(e.target).get("reason"),
            }),
          "Sale refunded and stock restored",
        );
      }}
    >
      <p>
        Refund the full sale of <b>{money(modal.data.total)}</b> and return all
        items to stock. Arrange the payment reversal separately. Cash refunds
        require the original shift to be open.
      </p>
      <Field label="Refund reason" name="reason" required />
      <Button className="danger full" disabled={busy}>
        Confirm full refund
      </Button>
    </form>
  );
}
