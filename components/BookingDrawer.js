"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CABINS, ORIGIN, formatINR, photo } from "@/lib/data";
import { addDays, iso } from "@/lib/trips";

// Quick trip configurator; the full booking happens on /booking
export default function BookingDrawer({ booking, onClose }) {
  const [last, setLast] = useState(null);
  const [form, setForm] = useState(null);
  const panelRef = useRef(null);
  const open = Boolean(booking);

  useEffect(() => {
    if (!booking) return;
    const { destination: d } = booking;
    const depart = booking.depart || iso(addDays(21));
    setLast(booking);
    setForm({
      depart,
      ret: booking.ret || iso(addDays(d.nights, new Date(depart + "T00:00:00"))),
      travellers: booking.travellers || 2,
      cabin: booking.cabin || "economy",
    });
  }, [booking]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open, onClose]);

  if (!last || !form) return null;

  const d = last.destination;
  const cabin = CABINS.find((c) => c.id === form.cabin);
  const fare = d.price * cabin.factor * form.travellers;
  const taxes = fare * 0.12;
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const checkout = `/booking?${new URLSearchParams({
    dest: d.id,
    depart: form.depart,
    ret: form.ret,
    travellers: form.travellers,
    cabin: form.cabin,
    ...(last.flight ? { flight: last.flight } : {}),
    ...(last.stay ? { stay: last.stay } : {}),
  })}`;

  return (
    <div className={`drawer-root ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${d.city}`}
        tabIndex={-1}
        ref={panelRef}
        data-lenis-prevent
      >
        <div className="drawer-media">
          <Image src={photo(d.img, 900)} alt={`${d.city}, ${d.country}`} fill sizes="480px" />
          <button className="drawer-close" onClick={onClose} aria-label="Close booking">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="drawer-title">
            <span>{d.country}</span>
            <h2>{d.city}</h2>
          </div>
        </div>

        <div className="drawer-body">
          <div className="route">
            <div>
              <strong>{ORIGIN.code}</strong>
              <span>{ORIGIN.city}</span>
            </div>
            <svg className="route-line" viewBox="0 0 120 24" aria-hidden="true">
              <path d="M2 18 Q60 -8 118 18" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" />
            </svg>
            <div className="route-to">
              <strong>{d.code}</strong>
              <span>{d.city}</span>
            </div>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Depart</span>
              <input type="date" value={form.depart} min={iso(new Date())} onChange={(e) => set("depart", e.target.value)} />
            </label>
            <label className="field">
              <span>Return</span>
              <input type="date" value={form.ret} min={form.depart} onChange={(e) => set("ret", e.target.value)} />
            </label>
          </div>

          <div className="field">
            <span>Travellers</span>
            <div className="stepper">
              <button type="button" onClick={() => set("travellers", Math.max(1, form.travellers - 1))} aria-label="Remove a traveller">−</button>
              <output aria-live="polite">{form.travellers}</output>
              <button type="button" onClick={() => set("travellers", Math.min(9, form.travellers + 1))} aria-label="Add a traveller">+</button>
            </div>
          </div>

          <fieldset className="field cabins">
            <legend>Cabin</legend>
            {CABINS.map((c) => (
              <label key={c.id} className={form.cabin === c.id ? "is-on" : ""}>
                <input type="radio" name="cabin" value={c.id} checked={form.cabin === c.id} onChange={() => set("cabin", c.id)} />
                {c.label}
              </label>
            ))}
          </fieldset>

          <dl className="summary">
            <div>
              <dt>{formatINR(d.price * cabin.factor)} × {form.travellers}</dt>
              <dd>{formatINR(fare)}</dd>
            </div>
            <div>
              <dt>Taxes and fees</dt>
              <dd>{formatINR(taxes)}</dd>
            </div>
            <div className="summary-total">
              <dt>Estimated total</dt>
              <dd>{formatINR(fare + taxes)}</dd>
            </div>
          </dl>

          <Link href={checkout} className="btn btn-primary btn-block" onClick={onClose}>
            Continue to checkout
          </Link>
          <Link href={`/destinations/${d.id}`} className="btn btn-ghost btn-block" onClick={onClose}>
            See the full {d.city} trip
          </Link>
          <p className="fine">Free cancellation for 48 hours. You won&apos;t be charged in this demo.</p>
        </div>
      </aside>
    </div>
  );
}
