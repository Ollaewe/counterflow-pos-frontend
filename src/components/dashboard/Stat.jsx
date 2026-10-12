import React from "react";

export default function Stat({ label, value, icon: Icon, highlight, foot }) {
  return (
    <div className={"stat " + (highlight ? "highlight" : "")}>
      <div>
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>
      <strong>{value}</strong>
      <small>{foot || "Completed transactions"}</small>
    </div>
  );
}
