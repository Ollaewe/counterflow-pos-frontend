import React from "react";
import { ChevronRight, Menu } from "lucide-react";
import { nav } from "../../config/navigation.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function Topbar() {
  const {
    page,
    workspace,
    setWorkspace,
    sidebar,
    setSidebar,
    navigate,
    u,
    isAdmin,
  } = usePOS();
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <button
          className="icon-btn mobile-only"
          aria-label="Open menu"
          onClick={() => setSidebar(!sidebar)}
        >
          <Menu />
        </button>
        <span>Workspace</span>
        <ChevronRight size={14} />
        <b>{nav.find((n) => n[0] === page)?.[1]}</b>
      </div>
      <div className="top-actions">
        {isAdmin && (
          <div className="workspace-switch">
            <button
              className={workspace === "admin" ? "active" : ""}
              onClick={() => {
                setWorkspace("admin");
                navigate("overview");
              }}
            >
              Admin
            </button>
            <button
              className={workspace === "cashier" ? "active" : ""}
              onClick={() => {
                setWorkspace("cashier");
                navigate("pos");
              }}
            >
              Cashier
            </button>
          </div>
        )}
        <div className="user-avatar">
          {u.name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="user-info">
          <b>{u.name}</b>
          <small>{u.role === "admin" ? "Administrator" : "Cashier"}</small>
        </div>
      </div>
    </header>
  );
}
