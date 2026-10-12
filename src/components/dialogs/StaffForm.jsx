import React from "react";
import Button from "../ui/Button.jsx";
import Field from "../ui/Field.jsx";
import Select from "../ui/Select.jsx";
import { api } from "../../services/api.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function StaffForm() {
  const { modal, busy, action } = usePOS();
  return (
    <form
      className="form-body"
      onSubmit={(e) => {
        e.preventDefault();
        const b = Object.fromEntries(new FormData(e.target));
        action(
          () =>
            api("/users", {
              ...b,
              id: modal.data.id,
              active: b.active === "yes",
            }),
          "Team member saved",
        );
      }}
    >
      <Field
        label="Full name"
        name="name"
        defaultValue={modal.data.name}
        required
      />
      <Field
        label="Username"
        name="username"
        defaultValue={modal.data.username}
        required
      />
      <Select
        label="Role"
        name="role"
        defaultValue={modal.data.role || "cashier"}
      >
        <option value="cashier">Cashier · checkout, own sales & shifts</option>
        <option value="admin">Administrator · full management access</option>
      </Select>
      <Field
        label={
          modal.data.id
            ? "New password (leave blank to keep)"
            : "Password (minimum 12 characters)"
        }
        name="password"
        type="password"
        minLength="12"
        required={!modal.data.id}
        autoComplete="new-password"
      />
      {modal.data.id ? (
        <Select
          label="Account status"
          name="active"
          defaultValue={modal.data.active ? "yes" : "no"}
        >
          <option value="yes">Active</option>
          <option value="no">Inactive</option>
        </Select>
      ) : (
        <input type="hidden" name="active" value="yes" />
      )}
      <Button className="primary full" disabled={busy}>
        Save team member
      </Button>
    </form>
  );
}
