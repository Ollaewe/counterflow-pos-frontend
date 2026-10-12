import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "esbuild";
const require = createRequire(import.meta.url);
const bundle = await build({
  entryPoints: ["src/App.jsx"],
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  packages: "external",
  plugins: [
    {
      name: "fixture-context",
      setup(b) {
        b.onResolve({ filter: /POSContext\.jsx$/ }, () => ({
          path: "fixture-context",
          namespace: "fixture",
        }));
        b.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
          contents: "export const usePOS=()=>globalThis.__POS_FIXTURE;",
          loader: "js",
        }));
      },
    },
  ],
});
const m = { exports: {} };
new Function("require", "module", "exports", bundle.outputFiles[0].text)(
  require,
  m,
  m.exports,
);
const App = m.exports.default;
const noop = () => {};
const product = {
  id: 1,
  name: "Test Product",
  sku: "TEST-1",
  barcode: "123",
  category: "Groceries",
  price: 100000,
  cost: 75000,
  stock: 10,
  reorder_level: 5,
  active: 1,
};
const user = {
  id: 1,
  name: "Test Owner",
  role: "admin",
  username: "owner",
  active: 1,
};
const shift = {
  id: 1,
  user_id: 1,
  opened_at: new Date().toISOString(),
  opening_cash: 50000,
  staff: "Test Owner",
  expected_cash: 150000,
  payments: [],
  closed_at: null,
};
const receipt = {
  id: 1,
  created_at: new Date().toISOString(),
  cashier: "Test Owner",
  customer: "Walk-in",
  items: [{ id: 1, ...product, quantity: 1 }],
  subtotal: 100000,
  discount: 0,
  tax: 0,
  total: 100000,
  payment: "cash",
  tendered: 100000,
  change: 0,
  status: "completed",
  payments: [],
  ...shift,
};
function fixture() {
  return {
    state: {
      user,
      settings: {
        store_name: "Test Store",
        address: "",
        phone: "",
        tax_bps: 0,
        receipt_note: "Thank you",
      },
      products: [product],
      customers: [],
      sales: [],
      users: [user],
      movements: [],
      audit: [],
      shifts: [shift],
      held: [],
      shift,
    },
    status: { needsSetup: false },
    page: "overview",
    workspace: "admin",
    error: "",
    toast: "",
    modal: null,
    busy: false,
    sidebar: false,
    query: "",
    cart: [{ id: 1, quantity: 1 }],
    customer: "",
    category: "All products",
    payment: "cash",
    discount: "0",
    tender: "1000",
    saleKey: "fixture-key",
    u: user,
    isAdmin: true,
    adminView: true,
    active: [product],
    cartItems: [{ ...product, quantity: 1 }],
    subtotal: 100000,
    disc: 0,
    tax: 0,
    total: 100000,
    completed: [],
    daySales: [],
    low: [],
    categories: ["All products", "Groceries"],
    matches: (p) => p,
    receipt: null,
    ...Object.fromEntries(
      [
        "setState",
        "setStatus",
        "setPage",
        "setWorkspace",
        "setError",
        "setToast",
        "setModal",
        "setBusy",
        "setSidebar",
        "setQuery",
        "setCart",
        "setCustomer",
        "setCategory",
        "setPayment",
        "setDiscount",
        "setTender",
        "setSaleKey",
        "load",
        "action",
        "open",
        "navigate",
        "add",
      ].map((n) => [n, noop]),
    ),
  };
}
after(() => delete globalThis.__POS_FIXTURE);
test("all extracted screens render without missing references", () => {
  for (const page of [
    "overview",
    "pos",
    "products",
    "inventory",
    "sales",
    "customers",
    "staff",
    "reports",
    "shifts",
    "settings",
  ]) {
    globalThis.__POS_FIXTURE = { ...fixture(), page };
    assert.ok(
      renderToStaticMarkup(React.createElement(App)).includes(
        "Counterflow POS",
      ),
      page,
    );
  }
});
test("all extracted dialog forms and receipts render", () => {
  for (const type of [
    "product",
    "stock",
    "customer",
    "staff",
    "openShift",
    "closeShift",
    "shiftDetail",
    "payment",
    "receipt",
    "hold",
    "held",
    "clear",
    "archive",
    "refund",
  ]) {
    const f = fixture();
    f.modal = {
      type,
      data:
        type === "shiftDetail"
          ? shift
          : type === "receipt" || type === "refund"
            ? receipt
            : {},
    };
    f.receipt = type === "receipt" ? receipt : null;
    globalThis.__POS_FIXTURE = f;
    assert.ok(
      renderToStaticMarkup(React.createElement(App)).includes('role="dialog"'),
      type,
    );
  }
});
test("setup and sign-in preserve password visibility control", () => {
  for (const needsSetup of [true, false]) {
    globalThis.__POS_FIXTURE = {
      ...fixture(),
      state: null,
      status: { needsSetup },
    };
    const html = renderToStaticMarkup(React.createElement(App));
    assert.ok(html.includes("Show password"));
    assert.ok(html.includes('type="password"'));
    assert.ok(html.includes(needsSetup ? "Create store" : "Sign in"));
  }
});
