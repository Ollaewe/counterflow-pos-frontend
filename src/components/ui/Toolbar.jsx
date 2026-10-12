import React from "react";
import { Search } from "lucide-react";

export default function Toolbar({ query, setQuery, placeholder, right }) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={18} />
        <input
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {right}
    </div>
  );
}
