import React from "react";

export default function Badge({ children, type = "normal" }) {
  return <span className={"badge " + type}>{children}</span>;
}
