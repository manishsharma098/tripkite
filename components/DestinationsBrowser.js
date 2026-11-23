"use client";

import { useMemo, useState } from "react";
import { destinations, formatINR } from "@/lib/data";
import DestCard from "./DestCard";

const TYPES = ["All", "Beach", "City", "Nature"];
const SORTS = {
  popular: { label: "Most popular", fn: () => 0 },
  price: { label: "Lowest price", fn: (a, b) => a.price - b.price },
  flight: { label: "Shortest flight", fn: (a, b) => a.flight - b.flight },
  nights: { label: "Longest trip", fn: (a, b) => b.nights - a.nights },
};
const MAX = Math.ceil(Math.max(...destinations.map((d) => d.price)) / 5000) * 5000;

export default function DestinationsBrowser() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState(MAX);
  const [sort, setSort] = useState("popular");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return destinations
      .filter((d) => type === "All" || d.type === type)
      .filter((d) => d.price <= budget)
      .filter((d) => !term || `${d.city} ${d.country} ${d.note}`.toLowerCase().includes(term))
      .sort(SORTS[sort].fn);
  }, [q, type, budget, sort]);

  const reset = () => {
    setQ("");
    setType("All");
    setBudget(MAX);
    setSort("popular");
  };

  return (
    <section className="browser">
      <div className="toolbar">
        <label className="tool tool-search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Search destinations</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city, country or vibe" />
        </label>

        <div className="chips" role="tablist" aria-label="Trip type">
          {TYPES.map((t) => (
            <button key={t} role="tab" aria-selected={type === t} className={type === t ? "is-on" : ""} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>

        <label className="tool tool-range">
          <span>Budget up to <b>{formatINR(budget)}</b></span>
          <input
            type="range"
            min={15000}
            max={MAX}
            step={2500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ "--fill": `${((budget - 15000) / (MAX - 15000)) * 100}%` }}
          />
        </label>

        <label className="tool tool-select">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="result-count" aria-live="polite">
        <b key={list.length}>{list.length}</b> {list.length === 1 ? "destination" : "destinations"}
      </p>

      {list.length ? (
        <div className="grid" key={`${type}-${sort}-${budget}-${q}`}>
          {list.map((d, i) => (
            <DestCard key={d.id} d={d} i={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing matches those filters</h2>
          <p>Raise the budget or clear the search to see more places.</p>
          <button className="btn btn-glow" onClick={reset}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
