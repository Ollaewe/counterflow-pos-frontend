import React from "react";
import {
  ShoppingBasket,
  Package,
  Users,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Wallet,
  Pause,
  Check,
  Banknote,
  CreditCard,
  ArrowLeftRight,
  ScanLine,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Field from "../components/ui/Field.jsx";
import { money, cents } from "../utils/format.js";
import { usePOS } from "../context/POSContext.jsx";

export default function PointOfSale() {
  const {
    state,
    busy,
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
    open,
    add,
    isAdmin,
    active,
    cartItems,
    subtotal,
    disc,
    tax,
    total,
    categories,
    matches,
  } = usePOS();
  return (
    <div className="pos-layout">
      <section className="catalog">
        <div className="pos-head">
          <div>
            <div className="eyebrow">COUNTERFLOW CHECKOUT</div>
            <h1>Let’s make a sale.</h1>
          </div>
          <Badge type={state.shift ? "success" : "warning"}>
            {state.shift
              ? "Shift #" + state.shift.id + " open"
              : "No open shift"}
          </Badge>
        </div>
        <div className="pos-search">
          <Search size={20} />
          <input
            aria-label="Search products or scan barcode"
            placeholder="Search product, SKU, or scan barcode…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const p = active.find(
                  (p) => p.barcode === query || p.sku === query,
                );
                if (p) {
                  add(p);
                  setQuery("");
                }
              }
            }}
          />
          <ScanLine size={22} />
        </div>
        <div className="category-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={c === category ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="catalog-label">
          <span>{category}</span>
          <small>
            {
              matches(active).filter(
                (p) => category === "All products" || p.category === category,
              ).length
            }{" "}
            products
          </small>
        </div>
        <div className="product-grid">
          {matches(active)
            .filter(
              (p) => category === "All products" || p.category === category,
            )
            .map((p, i) => (
              <button
                className={"product-tile " + (p.stock === 0 ? "out" : "")}
                key={p.id}
                disabled={!p.stock}
                onClick={() => add(p)}
              >
                <div
                  className={
                    "product-art tone-" +
                    ([
                      "Groceries",
                      "Beverages",
                      "Personal care",
                      "Household",
                      "Snacks",
                    ].indexOf(p.category) +
                      1)
                  }
                >
                  <Package size={42} strokeWidth={1.4} />
                  <span className="art-category">{p.category}</span>
                  <span className="tile-add">
                    <Plus size={17} />
                  </span>
                </div>
                <div className="tile-info">
                  <small>{p.sku}</small>
                  <h3>{p.name}</h3>
                  <div>
                    <b>{money(p.price)}</b>
                    <span
                      className={p.stock <= p.reorder_level ? "stock-low" : ""}
                    >
                      {p.stock ? p.stock + " in stock" : "Sold out"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
        </div>
        {!matches(active).filter(
          (p) => category === "All products" || p.category === category,
        ).length && (
          <Empty
            title="No matching products"
            text="Try another name, category, or barcode."
          />
        )}
        <div className="checkout-foot">
          <span>
            <ScanLine size={16} />
            Barcode scanners supported
          </span>
          <button className="text-btn" onClick={() => open("held")}>
            Held carts ({state.held.length})
          </button>
        </div>
      </section>
      <aside className="cart-panel">
        <div className="cart-head">
          <div>
            <h2>Current sale</h2>
            <small>
              {cart.reduce((a, i) => a + i.quantity, 0)} items in your basket
            </small>
          </div>
          <button
            className="icon-btn"
            aria-label="Clear cart"
            disabled={!cart.length}
            onClick={() => open("clear")}
          >
            <Trash2 size={19} />
          </button>
        </div>
        <div className="customer-select">
          <Users size={18} />
          <select
            aria-label="Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="">Walk-in customer</option>
            {state.customers.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="icon-btn"
            aria-label="Add customer"
            onClick={() => open("customer")}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="cart-items">
          {cartItems.length ? (
            cartItems.map((p) => (
              <div className="cart-item" key={p.id}>
                <div className="cart-item-top">
                  <b>{p.name || "Unavailable product"}</b>
                  <button
                    className="icon-btn"
                    aria-label={"Remove " + p.name}
                    onClick={() =>
                      setCart((c) => c.filter((i) => i.id !== p.id))
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="cart-item-bottom">
                  <span>{money(p.price)}</span>
                  <div className="quantity">
                    <button
                      aria-label={"Decrease " + p.name}
                      onClick={() =>
                        setCart((c) =>
                          c.flatMap((i) =>
                            i.id === p.id
                              ? i.quantity > 1
                                ? [{ ...i, quantity: i.quantity - 1 }]
                                : []
                              : [i],
                          ),
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <b>{p.quantity}</b>
                    <button
                      aria-label={"Increase " + p.name}
                      onClick={() => add(p)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <strong>{money(p.price * p.quantity)}</strong>
                </div>
              </div>
            ))
          ) : (
            <Empty
              title="Your basket is empty"
              text="Tap a product to begin the sale."
              icon={ShoppingBasket}
            />
          )}
        </div>
        <div className="cart-bottom">
          <div className="bill-line">
            <span>Subtotal</span>
            <b>{money(subtotal)}</b>
          </div>
          {isAdmin && (
            <div className="bill-line">
              <label htmlFor="discount">Discount (₦)</label>
              <input
                id="discount"
                type="number"
                min="0"
                max={subtotal / 100}
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          )}
          <div className="bill-line">
            <span>Tax ({state.settings.tax_bps / 100}%)</span>
            <b>{money(tax)}</b>
          </div>
          <div className="bill-total">
            <span>Total payable</span>
            <b>{money(total)}</b>
          </div>
          <div className="payment-options">
            {[
              ["cash", "Cash", Banknote],
              ["card", "Card", CreditCard],
              ["transfer", "Transfer", ArrowLeftRight],
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                className={payment === key ? "active" : ""}
                onClick={() => setPayment(key)}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>
          {payment === "cash" && (
            <>
              <Field
                label="Cash received (₦)"
                type="number"
                min="0"
                step="0.01"
                placeholder={(total / 100).toFixed(2)}
                value={tender}
                onChange={(e) => setTender(e.target.value)}
              />
              <div className="bill-line">
                <span>Change</span>
                <b>{money(Math.max(0, cents(tender) - total))}</b>
              </div>
            </>
          )}
          {!state.shift ? (
            <Button
              className="primary full"
              icon={Wallet}
              onClick={() => open("openShift")}
            >
              Open cash shift
            </Button>
          ) : (
            <Button
              className="primary full pay-btn"
              icon={Check}
              disabled={
                !cart.length ||
                busy ||
                disc > subtotal ||
                total < 0 ||
                (payment === "cash" && cents(tender) < total)
              }
              onClick={() => open("payment")}
            >
              Complete sale · {money(total)}
            </Button>
          )}
          <Button
            className="full hold-btn"
            icon={Pause}
            disabled={!cart.length}
            onClick={() => open("hold")}
          >
            Hold sale
          </Button>
          <p className="payment-hint">
            {payment === "cash"
              ? "Check cash received before completing."
              : "Confirm payment on your terminal or bank first."}
          </p>
        </div>
      </aside>
    </div>
  );
}
