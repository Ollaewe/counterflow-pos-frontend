import React from "react";
import CloseShift from "../shifts/CloseShift.jsx";
import { api } from "../../services/api.js";
import { cents } from "../../utils/format.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function CloseShiftDialog() {
  const { state, busy, action, open } = usePOS();
  return (
    <CloseShift
      shift={state.shift}
      onSubmit={async (amount) => {
        const r = await action(
          () => api("/shifts/close", { closing_cash: cents(amount) }),
          "Shift closed",
        );
        if (r) open("shiftDetail", r);
      }}
      busy={busy}
    />
  );
}
