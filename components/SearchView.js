"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ORIGIN, byId, destinations, flightsFor, formatHours, formatINR } from "@/lib/data";
import { addDays, iso, prettyDate } from "@/lib/trips";
import { useBooking } from "./BookingProvider";
import { StayCards } from "./DestinationActions";
import DestCard from "./DestCard";
import SearchConsole from "./SearchConsole";

const SORTS = {
  cheap: ["Cheapest", (a, b) => a.price - b.price],
  fast: ["Fastest", (a, b) => a.hours - b.hours],
  early: ["Earliest", (a, b) => a.depart.localeCompare(b.depart)],
};
const STOP_FILTERS = [
  ["any", "Any stops"],
  ["0", "Direct only"],
  ["1", "Up to 1 stop"],
];

export default function SearchView() {
  const params = useSearchParams();
  const { openBooking } = useBooking();

  const [sort, setSort] = useState("cheap");
  const [stops, setStops] = useState("any");

  const active = byId[params.get("to")];
  const activeMode = params.get("mode") || "flights";
  const n = Number(params.get("travellers")) || 2;

  const flights = useMemo(() => {
    if (!active) return [];
    return flightsFor(active)
      .filter((f) => stops === "any" || f.stops <= Number(stops))
      .sort(SORTS[sort][1]);
  }, [active, sort, stops]);

  const depart = params.get("depart") || iso(addDays(21));

  return (
    <section className="search">
      <SearchConsole variant="inline" key={params.toString()} initial={Object.fromEntries(params.entries())} />

      {!active ? (
        <div className="search-empty">
          <h2 className="display small" data-reveal>Not sure yet? Start with these</h2>
          <div className="grid">
            {destinations.slice(0, 6).map((d, i) => (
              <DestCard key={d.id} d={d} i={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="results" key={`${active.id}-${activeMode}`}>
          <div className="results-head">
            <div>
              <p className="results-route">
                {ORIGIN.code}
                <svg viewBox="0 0 60 16" width="60" height="16" aria-hidden="true">
                  <path d="M2 12 Q30 -6 58 12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
                </svg>
                {active.code}
              </p>
              <h2>
                {activeMode === "stays" ? `Stays in ${active.city}` : activeMode === "packages" ? `${active.city} package` : `Flights to ${active.city}`}
              </h2>
              <p className="results-meta">
                {prettyDate(depart)}{params.get("ret") ? ` – ${prettyDate(params.get("ret"))}` : ""} · {n} {n === 1 ? "traveller" : "travellers"}
              </p>
            </div>
            <Link href={`/destinations/${active.id}`} className="link-arrow">About {active.city}</Link>
          </div>

          {activeMode === "flights" && (
            <>
              <div className="results-tools">
                <div className="chips">
                  {Object.entries(SORTS).map(([k, [label]]) => (
                    <button key={k} className={sort === k ? "is-on" : ""} onClick={() => setSort(k)}>{label}</button>
                  ))}
                </div>
                <div className="chips">
                  {STOP_FILTERS.map(([k, label]) => (
                    <button key={k} className={stops === k ? "is-on" : ""} onClick={() => setStops(k)}>{label}</button>
                  ))}
                </div>
              </div>

              <div className="flight-list" key={`${sort}-${stops}`}>
                {flights.length === 0 && (
                  <p className="empty-line">No flights match. Try allowing a stop.</p>
                )}
                {flights.map((f, i) => (
                  <article key={f.id} className="flight-row" style={{ "--i": i }}>
                    {i === 0 && sort === "cheap" && <span className="flight-flag">Best price</span>}
                    <div className="flight-airline">
                      <span className="airline-mark" style={{ "--h": (f.airline.length * 47) % 360 }}>
                        {f.airline.split(" ").map((w) => w[0]).join("")}
                      </span>
                      <div>
                        <b>{f.airline}</b>
                        <small>{f.number}</small>
                      </div>
                    </div>
                    <div className="flight-times">
                      <div>
                        <b>{f.depart}</b>
                        <small>{ORIGIN.code}</small>
                      </div>
                      <span className="flight-line">
                        <small>{formatHours(f.hours)}</small>
                        <i />
                        <small>{f.stops ? `${f.stops} stop${f.stops > 1 ? "s" : ""}` : "Direct"}</small>
                      </span>
                      <div>
                        <b>{f.arrive}</b>
                        <small>{active.code}</small>
                      </div>
                    </div>
                    <div className="flight-buy">
                      <b className="flight-price">{formatINR(f.price)}</b>
                      <small>{formatINR(f.price * n)} for {n}</small>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openBooking(active, { flight: f.id, depart, ret: params.get("ret") || undefined, cabin: params.get("cabin") || undefined, travellers: n })}
                      >
                        Select
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeMode === "stays" && <StayCards id={active.id} />}

          {activeMode === "packages" && (
            <div className="package">
              <DestCard d={active} badge="Package" />
              <div className="package-info">
                <h3>Everything in one booking</h3>
                <ul className="highlights">
                  <li><span className="highlight-dot" />Return flights from {ORIGIN.city}</li>
                  <li><span className="highlight-dot" />{active.nights} nights in a hand-picked stay</li>
                  {active.highlights.slice(0, 3).map((h) => (
                    <li key={h}><span className="highlight-dot" />{h}</li>
                  ))}
                </ul>
                <button className="btn btn-glow" onClick={() => openBooking(active, { depart, ret: params.get("ret") || undefined, travellers: n })}>
                  Book the package for {formatINR(active.price * n)}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
