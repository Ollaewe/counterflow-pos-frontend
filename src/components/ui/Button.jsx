import React from "react";

export default function Button({
  children,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button className={"btn " + className} {...props}>
      {Icon && <Icon size={17} />} {children}
    </button>
  );
}
