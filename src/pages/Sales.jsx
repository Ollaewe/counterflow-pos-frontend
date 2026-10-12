import React from "react";
import { ArrowDownToLine } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Toolbar from "../components/ui/Toolbar.jsx";
import SalesTable from "../components/sales/SalesTable.jsx";
import { api } from "../services/api.js";
import { download } from "../utils/exportCsv.js";
import { usePOS } from "../context/POSContext.jsx";

export default function Sales() {
  const { state, setError, query, setQuery, open } = usePOS();
  return (
    <section className="card">
      <Toolbar
        query={query}
        setQuery={setQuery}
        placeholder="Search receipt, customer, or cashier"
        right={
          <Button
            icon={ArrowDownToLine}
            onClick={() =>
              download("sales.csv", [
                [
                  "Receipt",
                  "Date (UTC)",
                  "Cashier",
                  "Customer",
                  "Payment",
                  "Total NGN",
                  "Status",
                ],
                ...state.sales.map((s) => [
                  "CF-" + s.id,
                  s.created_at,
                  s.cashier,
                  s.customer || "Walk-in",
                  s.payment,
                  s.total / 100,
                  s.status,
                ]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />
      <SalesTable
        sales={state.sales.filter((s) =>
          (
            s.id +
            " " +
            s.cashier +
            " " +
            (s.customer || "") +
            " " +
            s.payment +
            " " +
            s.status
          )
            .toLowerCase()
            .includes(query.toLowerCase()),
        )}
        onView={async (s) => {
          try {
            open("receipt", await api("/sales/" + s.id));
          } catch (e) {
            setError(e.message);
          }
        }}
      />
      <div className="table-foot">
        Latest 500 transactions · Cashiers see their own sales
      </div>
    </section>
  );
}
