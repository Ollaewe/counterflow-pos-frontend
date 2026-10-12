import React from "react";
import { Users } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Empty from "../components/ui/Empty.jsx";
import Toolbar from "../components/ui/Toolbar.jsx";
import { usePOS } from "../context/POSContext.jsx";

export default function Customers() {
  const { state, query, setQuery } = usePOS();
  return (
    <section className="card">
      <Toolbar
        query={query}
        setQuery={setQuery}
        placeholder="Find a customer"
        right={<Badge>{state.customers.length} customers</Badge>}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {state.customers
              .filter((c) =>
                (c.name + " " + c.phone + " " + c.email)
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((c) => (
                <tr key={c.id}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.email || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {!state.customers.length && (
          <Empty
            title="Start building customer relationships"
            text="Add a customer and attach them to their next sale."
            icon={Users}
          />
        )}
      </div>
    </section>
  );
}
