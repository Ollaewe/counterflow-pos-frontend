import React from "react";
import { UserRoundCog, LogOut, Store } from "lucide-react";
import { api } from "../../services/api.js";
import { nav } from "../../config/navigation.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function Sidebar() {
  const {
    state,
    setState,
    page,
    sidebar,
    setCart,
    load,
    navigate,
    adminView,
    low,
  } = usePOS();
  return (
    <aside className={"sidebar " + (sidebar ? "visible" : "")}>
      <div className="brand">
        <div className="brand-mark">c</div> counterflow<span>POS</span>
      </div>
      <div className="store-chip">
        <Store size={19} />
        <div>
          <strong>{state.settings.store_name}</strong>
          <small>Store workspace</small>
        </div>
      </div>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        {nav
          .filter(
            ([p]) =>
              adminView || ["pos", "sales", "customers", "shifts"].includes(p),
          )
          .map(([p, label, Icon]) => (
            <button
              key={p}
              className={"nav-item " + (page === p ? "selected" : "")}
              onClick={() => navigate(p)}
            >
              <Icon size={19} />
              {label}
              {p === "inventory" && low.length > 0 && (
                <span className="nav-count">{low.length}</span>
              )}
            </button>
          ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="role-note">
          <span className="role-icon">
            <UserRoundCog size={20} />
          </span>
          <div>
            <b>{adminView ? "Administrator" : "Cashier workspace"}</b>
            <small>
              {adminView ? "Full store access" : "Focused on the checkout"}
            </small>
          </div>
        </div>
        <button
          className="nav-item"
          onClick={async () => {
            await api("/logout", {});
            setCart([]);
            setState(null);
            load();
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
