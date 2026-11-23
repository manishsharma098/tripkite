"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { byId, formatINR, photo } from "@/lib/data";
import { iso, loadTrips, prettyDate, removeTrip } from "@/lib/trips";
import BoardingPass from "./BoardingPass";

export default function TripsList() {
  const [trips, setTrips] = useState(null);
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(null);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => setTrips(loadTrips()), []);

  if (trips === null) return <section className="trips" />;

  const today = iso(new Date());
  const upcoming = trips.filter((t) => t.ret >= today);
  const past = trips.filter((t) => t.ret < today);
  const list = tab === "upcoming" ? upcoming : past;

  const cancel = (ref) => {
    removeTrip(ref);
    setTrips(loadTrips());
    setConfirming(null);
  };

  return (
    <section className="trips">
      <div className="chips trips-tabs" role="tablist" aria-label="Trips">
        {[["upcoming", "Upcoming", upcoming.length], ["past", "Past", past.length]].map(([k, label, n]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>
            {label}
            <small>{n}</small>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 40 40" width="72" height="72" aria-hidden="true" className="empty-kite">
            <path d="M20 2 L36 18 L20 31 L4 18 Z" fill="var(--pink)" />
            <path d="M20 2 L36 18 L20 18 Z" fill="var(--sun)" />
            <path d="M4 18 L20 18 L20 31 Z" fill="var(--blue)" />
          </svg>
          <h2>{tab === "upcoming" ? "No trips booked yet" : "No past trips"}</h2>
          <p>{tab === "upcoming" ? "When you book or hold a trip it shows up here, with your boarding pass." : "Trips move here once you're back home."}</p>
          <Link href="/destinations" className="btn btn-glow">Find a destination</Link>
        </div>
      ) : (
        <div className="trip-list" key={tab}>
          {list.map((t, i) => {
            const d = byId[t.dest];
            const isOpen = open === t.ref;
            return (
              <article key={t.ref} className={`trip ${isOpen ? "is-open" : ""}`} style={{ "--i": i }}>
                <div className="trip-row">
                  <div className="trip-img">
                    <Image src={photo(d.img, 400)} alt="" fill sizes="120px" />
                  </div>
                  <div className="trip-info">
                    <h3>{d.city}</h3>
                    <p>{prettyDate(t.depart)} – {prettyDate(t.ret)} · {t.travellers} {t.travellers === 1 ? "traveller" : "travellers"}</p>
                    <span className={`status status-${t.payment === "hold" ? "hold" : "paid"}`}>
                      {t.payment === "hold" ? "Held for 48 hours" : "Paid"}
                    </span>
                  </div>
                  <div className="trip-side">
                    <b>{formatINR(t.total)}</b>
                    <small>Ref {t.ref}</small>
                    <button className="btn btn-ghost btn-sm" onClick={() => setOpen(isOpen ? null : t.ref)} aria-expanded={isOpen}>
                      {isOpen ? "Hide pass" : "Boarding pass"}
                    </button>
                  </div>
                </div>
                <div className="trip-detail">
                  <div>
                    <BoardingPass trip={t} />
                    <div className="trip-actions">
                      <Link href={`/destinations/${d.id}`} className="link-arrow">Trip plan for {d.city}</Link>
                      {confirming === t.ref ? (
                        <span className="cancel-confirm">
                          Cancel this trip? This can&apos;t be undone.
                          <button className="btn btn-sm btn-dark" onClick={() => cancel(t.ref)}>Yes, cancel trip</button>
                          <button className="btn btn-sm btn-ghost" onClick={() => setConfirming(null)}>Keep it</button>
                        </span>
                      ) : (
                        <button className="text-btn" onClick={() => setConfirming(t.ref)}>Cancel trip</button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="fine trips-note">Trips are saved in this browser only. Clearing site data removes them.</p>
    </section>
  );
}
