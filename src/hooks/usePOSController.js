import React, { useState, useEffect } from "react";

import { api } from "../services/api.js";
import { cents, today } from "../utils/format.js";

export default function usePOSController() {
  const [state, setState] = useState(null),
    [status, setStatus] = useState(null),
    [page, setPage] = useState("overview"),
    [workspace, setWorkspace] = useState("admin"),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false),
    [sidebar, setSidebar] = useState(false),
    [query, setQuery] = useState(""),
    [cart, setCart] = useState([]),
    [customer, setCustomer] = useState(""),
    [category, setCategory] = useState("All products"),
    [payment, setPayment] = useState("cash"),
    [discount, setDiscount] = useState("0"),
    [tender, setTender] = useState(""),
    [saleKey, setSaleKey] = useState(crypto.randomUUID());
  async function load() {
    try {
      const s = await api("/state");
      setState(s);
      if (s.user.role === "cashier") {
        setWorkspace("cashier");
        setPage((p) =>
          ["pos", "sales", "customers", "shifts"].includes(p) ? p : "pos",
        );
      }
      setStatus({ needsSetup: false });
    } catch (e) {
      setState(null);
      try {
        setStatus(await api("/status"));
      } catch {
        setError(
          "The server is unavailable. Check that the backend is running.",
        );
      }
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  async function action(fn, msg = "Saved successfully") {
    setBusy(true);
    setError("");
    try {
      const r = await fn();
      await load();
      setModal(null);
      setToast(msg);
      return r;
    } catch (e) {
      await load();
      setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  function open(type, data = {}) {
    setError("");
    setModal({ type, data });
  }
  function navigate(p) {
    setPage(p);
    setQuery("");
    setSidebar(false);
  }
  function add(p) {
    if (!p.active || p.stock === 0) return;
    setCart((c) => {
      const existing = c.find((i) => i.id === p.id);
      if (existing && existing.quantity >= p.stock) {
        setToast("Available stock limit reached");
        return c;
      }
      return existing
        ? c.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c, { id: p.id, quantity: 1 }];
    });
  }
  const u = state?.user,
    isAdmin = u?.role === "admin",
    adminView = isAdmin && workspace === "admin";
  const active = state?.products.filter((p) => p.active) || [],
    cartItems = cart.map((i) => ({
      ...state?.products.find((p) => p.id === i.id),
      quantity: i.quantity,
    })),
    subtotal = cartItems.reduce((a, p) => a + (p.price || 0) * p.quantity, 0),
    disc = isAdmin ? cents(discount) : 0,
    tax = Math.round(
      ((subtotal - disc) * (state?.settings.tax_bps || 0)) / 10000,
    ),
    total = subtotal - disc + tax;
  const completed = state?.sales.filter((s) => s.status === "completed") || [],
    daySales = completed.filter((s) => s.created_at.slice(0, 10) === today()),
    low = active.filter((p) => p.stock <= p.reorder_level);

  const categories = [
    "All products",
    ...new Set(active.map((p) => p.category)),
  ];
  const matches = (products) =>
    products.filter((p) =>
      (p.name + " " + p.sku + " " + (p.barcode || ""))
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const receipt = modal?.type === "receipt" ? modal.data : null;

  return {
    state,
    setState,
    status,
    setStatus,
    page,
    setPage,
    workspace,
    setWorkspace,
    error,
    setError,
    toast,
    setToast,
    modal,
    setModal,
    busy,
    setBusy,
    sidebar,
    setSidebar,
    query,
    setQuery,
    cart,
    setCart,
    customer,
    setCustomer,
    category,
    setCategory,
    payment,
    setPayment,
    discount,
    setDiscount,
    tender,
    setTender,
    saleKey,
    setSaleKey,
    load,
    action,
    open,
    navigate,
    add,
    u,
    isAdmin,
    adminView,
    active,
    cartItems,
    subtotal,
    disc,
    tax,
    total,
    completed,
    daySales,
    low,
    categories,
    matches,
    receipt,
  };
}
