import React from "react";
import { Plus, Clock } from "lucide-react";
import Button from "../ui/Button.jsx";

import { nav } from "../../config/navigation.js";
import { usePOS } from "../../context/POSContext.jsx";

export default function PageHeader() {
  const { page, open, navigate, u } = usePOS();
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">
          {page === "overview" ? "YOUR STORE AT A GLANCE" : "STORE MANAGEMENT"}
        </div>
        <h1>
          {page === "overview"
            ? "Good to see you, " + u.name.split(" ")[0] + "."
            : nav.find((n) => n[0] === page)?.[1]}
        </h1>
        <p>
          {
            {
              overview: "Here’s what’s happening in your store today.",
              products: "Your catalogue, ready for the next sale.",
              inventory: "Keep your shelves stocked and your records accurate.",
              sales: "Every transaction, all in one place.",
              customers: "The people who keep your business moving.",
              staff: "Give your team the right tools and access.",
              reports: "Turn your sales into a clearer picture.",
              shifts: "Reconcile your till with confidence.",
              settings: "The details that make this store yours.",
            }[page]
          }
        </p>
      </div>
      <div className="head-actions">
        {page === "overview" ? (
          <>
            <span className="date-chip">
              <Clock size={16} />
              {new Date().toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <Button
              className="primary"
              icon={Plus}
              onClick={() => navigate("pos")}
            >
              New sale
            </Button>
          </>
        ) : page === "products" ? (
          <Button
            className="primary"
            icon={Plus}
            onClick={() => open("product")}
          >
            Add product
          </Button>
        ) : page === "customers" ? (
          <Button
            className="primary"
            icon={Plus}
            onClick={() => open("customer")}
          >
            Add customer
          </Button>
        ) : page === "staff" ? (
          <Button className="primary" icon={Plus} onClick={() => open("staff")}>
            Add team member
          </Button>
        ) : page === "inventory" ? (
          <Button className="primary" icon={Plus} onClick={() => open("stock")}>
            Adjust stock
          </Button>
        ) : null}
      </div>
    </div>
  );
}
