import React from "react";
import { Activity } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import { date } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Staff() {
  const { state, open, u } = usePOS();
  return (
    <>
      <section className="card">
        <div className="card-head">
          <h2>Your team</h2>
          <Badge>
            {state.users.filter((u) => u.active).length} active members
          </Badge>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Team member</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((s) => (
                <tr key={s.id}>
                  <td>
                    <b>{s.name}</b>
                    {s.id === u.id && <small>You</small>}
                  </td>
                  <td>{s.username}</td>
                  <td>
                    <Badge type={s.role === "admin" ? "success" : "normal"}>
                      {s.role}
                    </Badge>
                  </td>
                  <td>{s.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => open("staff", s)}
                    >
                      Manage access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card spaced">
        <div className="card-head">
          <h2>Activity log</h2>
          <Activity size={20} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Team member</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {state.audit.map((a) => (
                <tr key={a.id}>
                  <td>{date(a.created_at)}</td>
                  <td>{a.staff}</td>
                  <td>{a.action}</td>
                  <td>{a.detail || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
