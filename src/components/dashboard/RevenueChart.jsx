import React from "react";
import { money } from "../../utils/format.js";

export default function RevenueChart({ sales }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 6 + i);
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString("en-NG", { weekday: "short" }),
      value: sales
        .filter((s) => s.created_at.slice(0, 10) === key)
        .reduce((a, s) => a + s.total, 0),
    };
  });
  const max = Math.max(10000, ...days.map((d) => d.value));
  return (
    <div className="bar-chart">
      <div className="chart-axis">
        {[1, 0.75, 0.5, 0.25, 0].map((v) => (
          <span key={v}>{money(max * v)}</span>
        ))}
      </div>
      <div className="chart-bars">
        {days.map((d, i) => (
          <div className="bar-col" key={i}>
            <div className="bar-track">
              <div
                className={"bar " + (i === 6 ? "current" : "")}
                style={{ height: Math.max(0, (d.value / max) * 100) + "%" }}
                title={money(d.value)}
              >
                <span>{money(d.value)}</span>
              </div>
            </div>
            <small>{d.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
