"use client";

import Link from "next/link";
import { STAYS, byId, formatINR } from "@/lib/data";
import { useBooking } from "./BookingProvider";

export function BookPanel({ id }) {
  const { openBooking } = useBooking();
  const d = byId[id];
  return (
    <aside className="book-panel" data-reveal>
      <p className="book-panel-from">{d.nights} nights, flights and stay from</p>
      <p className="book-panel-price">{formatINR(d.price)}</p>
      <p className="book-panel-note">per person, return from the city you choose</p>
      <button className="btn btn-glow btn-block" onClick={() => openBooking(d)} data-magnetic>
        Book this trip
      </button>
      <Link href={`/search?to=${d.id}`} className="btn btn-ghost btn-block">
        Compare flights
      </Link>
      <ul className="book-panel-perks">
        <li>Hold the fare free for 48 hours</li>
        <li>Change dates once at no cost</li>
        <li>24/7 help on WhatsApp</li>
      </ul>
    </aside>
  );
}

export function StayCards({ id }) {
  const { openBooking } = useBooking();
  const d = byId[id];
  return (
    <div className="stays" data-reveal>
      {STAYS.map((s, i) => (
        <article key={s.id} className={`stay ${i === 1 ? "is-pick" : ""}`} data-tilt>
          {i === 1 && <span className="stay-flag">Most booked</span>}
          <h3>{s.label}</h3>
          <p className="stay-price">
            {formatINR(d.price * s.factor)}
            <small> per person</small>
          </p>
          <ul>
            {s.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <button
            className={`btn btn-block ${i === 1 ? "btn-glow" : "btn-ghost"}`}
            onClick={() => openBooking(d, { stay: s.id })}
          >
            Choose {s.label.toLowerCase()}
          </button>
        </article>
      ))}
    </div>
  );
}
