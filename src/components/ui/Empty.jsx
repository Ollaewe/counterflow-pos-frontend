import React from "react";
import { Package } from "lucide-react";

export default function Empty({
  title = "Nothing here yet",
  text = "Your records will appear here.",
  icon: Icon = Package,
}) {
  return (
    <div className="empty">
      <Icon size={38} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
