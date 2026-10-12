import React from "react";
import { Wallet } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import { api } from "../services/api.js";
import { money, date } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Shifts() {
  const { state, open, adminView } = usePOS();
  return (
    <>
      <section className="shift-banner">
        <div className="shift-icon">
          <Wallet size={28} />
        </div>
        <div>
          <h2>
            {state.shift ? "Your shift is open" : "Ready to open your till?"}
          </h2>
          <p>
            {state.shift
              ? "Opened " +
                date(state.shift.opened_at) +
                " · Opening float " +
                money(state.shift.opening_cash)
              : "Set the opening cash balance before processing sales."}
          </p>
        </div>
        <Button
          className={state.shift ? "" : "primary"}
          icon={Wallet}
          onClick={() => open(state.shift ? "closeShift" : "openShift")}
        >
          {state.shift ? "Close & reconcile" : "Open shift"}
        </Button>
      </section>
      {adminView && (
        <section className="card spaced">
          <div className="card-head">
            <h2>Shift history</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Cashier</th>
                  <th>Opened</th>
                  <th>Opening cash</th>
                  <th>Closing cash</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {state.shifts.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td>{s.staff}</td>
                    <td>{date(s.opened_at)}</td>
                    <td>{money(s.opening_cash)}</td>
                    <td>
                      {s.closing_cash == null ? "—" : money(s.closing_cash)}
                    </td>
                    <td>
                      <Badge type={s.closed_at ? "normal" : "success"}>
                        {s.closed_at ? "Closed" : "Open"}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="text-btn"
                        onClick={async () =>
                          open("shiftDetail", await api("/shifts/" + s.id))
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!state.shifts.length && (
              <Empty title="No shifts yet" icon={Wallet} />
            )}
          </div>
        </section>
      )}
    </>
  );
}
