import React from "react";
import Button from "../ui/Button.jsx";
import { api } from "../../services/api.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function ArchiveProductConfirmation() {
  const { modal, busy, action } = usePOS();
  return (
    <div className="form-body">
      <p>
        {modal.data.active ? "Hide" : "Restore"} <b>{modal.data.name}</b>{" "}
        {modal.data.active ? "from" : "in"} checkout? Existing sales and stock
        records are retained.
      </p>
      <Button
        className="primary full"
        disabled={busy}
        onClick={() =>
          action(
            () => api("/products/" + modal.data.id + "/archive", {}),
            "Product updated",
          )
        }
      >
        {modal.data.active ? "Archive" : "Restore"} product
      </Button>
    </div>
  );
}
