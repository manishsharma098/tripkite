"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CABINS, ORIGIN, STAYS, byId, flightsFor, formatHours, formatINR, photo } from "@/lib/data";
import { addDays, iso, makeRef, prettyDate, saveTrip } from "@/lib/trips";
import BoardingPass from "./BoardingPass";

const STEPS = ["Trip", "Travellers", "Review and pay", "Confirmed"];
const PAYMENTS = [
  { id: "hold", label: "Hold for 48 hours", text: "Pay nothing now. We keep the price until the hold ends." },
  { id: "upi", label: "UPI", text: "Approve the payment in your UPI app after confirming." },
  { id: "card", label: "Card", text: "You'll enter card details on the secure payment page." },
];

export default function Checkout() {
  const params = useSearchParams();
  const d = byId[params.get("dest")];

  const [step, setStep] = useState(0);
  const [trip, setTrip] = useState(null);
  const [people, setPeople] = useState({ lead: "", email: "", phone: "", others: [] });
  const [payment, setPayment] = useState("hold");
  const [agree, setAgree] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const flights = useMemo(() => (d ? flightsFor(d) : []), [d]);

  useEffect(() => {
    if (!d) return;
    const depart = params.get("depart") || iso(addDays(21));
    setTrip({
      depart,
      ret: params.get("ret") || iso(addDays(d.nights, new Date(depart + "T00:00:00"))),
      travellers: Number(params.get("travellers")) || 2,
      cabin: params.get("cabin") || "economy",
      stay: params.get("stay") || "boutique",
      flight: params.get("flight") || flightsFor(d)[2].id,
    });
    setStep(0);
    setConfirmed(null);
  }, [d, params]);

  // Keep one name field per extra traveller
  useEffect(() => {
    if (!trip) return;
    setPeople((p) => ({
      ...p,
      others: Array.from({ length: trip.travellers - 1 }, (_, i) => p.others[i] || ""),
    }));
  }, [trip?.travellers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bring the new step into view, but not on first load
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = document.querySelector(".checkout");
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -110 });
    else el?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  if (!d) {
    return (
      <section className="checkout">
        <div className="empty">
          <h2>Pick a trip first</h2>
          <p>Choose a destination and press Book. Your trip details will carry over to this page.</p>
          <Link href="/destinations" className="btn btn-glow">Browse destinations</Link>
        </div>
      </section>
    );
  }
  if (!trip) return null;

  const cabin = CABINS.find((c) => c.id === trip.cabin) || CABINS[0];
  const stay = STAYS.find((s) => s.id === trip.stay) || STAYS[0];
  const flight = flights.find((f) => f.id === trip.flight) || flights[2];
  const perPerson = flight.price * cabin.factor + d.price * 0.55 * stay.factor;
  const subtotal = perPerson * trip.travellers;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;
  const set = (k, v) => setTrip((t) => ({ ...t, [k]: v }));

  const next = (e) => {
    e?.preventDefault();
    setStep((s) => Math.min(s + 1, 3));
  };

  const confirm = (e) => {
    e.preventDefault();
    const record = {
      ...makeRef(),
      dest: d.id,
      depart: trip.depart,
      ret: trip.ret,
      travellers: trip.travellers,
      cabinLabel: cabin.label,
      stayLabel: stay.label,
      flightNo: flight.number,
      airline: flight.airline,
      departTime: flight.depart,
      total: Math.round(total),
      name: people.lead,
      email: people.email,
      payment,
      createdAt: Date.now(),
    };
    saveTrip(record);
    setConfirmed(record);
    setStep(3);
  };

  return (
    <section className="checkout">
      <ol className="stepper-bar" style={{ "--step": step }}>
        <span className="stepper-track" aria-hidden="true"><i /></span>
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? "is-done" : i === step ? "is-current" : ""} aria-current={i === step ? "step" : undefined}>
            <span className="stepper-dot">{i < step ? "✓" : i + 1}</span>
            <span className="stepper-label">{s}</span>
          </li>
        ))}
      </ol>

      <div className="checkout-grid">
        <div className="checkout-main" key={step}>
          {step === 0 && (
            <form className="ck-card" onSubmit={next}>
              <h2>Your trip</h2>
              <div className="field-row">
                <label className="field">
                  <span>Depart</span>
                  <input type="date" value={trip.depart} min={iso(new Date())} onChange={(e) => set("depart", e.target.value)} required />
                </label>
                <label className="field">
                  <span>Return</span>
                  <input type="date" value={trip.ret} min={trip.depart} onChange={(e) => set("ret", e.target.value)} required />
                </label>
              </div>

              <div className="field">
                <span>Travellers</span>
                <div className="stepper">
                  <button type="button" onClick={() => set("travellers", Math.max(1, trip.travellers - 1))} aria-label="Remove a traveller">−</button>
                  <output aria-live="polite">{trip.travellers}</output>
                  <button type="button" onClick={() => set("travellers", Math.min(9, trip.travellers + 1))} aria-label="Add a traveller">+</button>
                </div>
              </div>

              <fieldset className="field cabins">
                <legend>Cabin</legend>
                {CABINS.map((c) => (
                  <label key={c.id} className={trip.cabin === c.id ? "is-on" : ""}>
                    <input type="radio" name="cabin" checked={trip.cabin === c.id} onChange={() => set("cabin", c.id)} />
                    {c.label}
                  </label>
                ))}
              </fieldset>

              <fieldset className="field">
                <legend>Flight</legend>
                <div className="pick-list">
                  {flights.map((f) => (
                    <label key={f.id} className={`pick ${trip.flight === f.id ? "is-on" : ""}`}>
                      <input type="radio" name="flight" checked={trip.flight === f.id} onChange={() => set("flight", f.id)} />
                      <span className="pick-main">
                        <b>{f.depart} → {f.arrive}</b>
                        <small>{f.airline} · {formatHours(f.hours)} · {f.stops ? `${f.stops} stop${f.stops > 1 ? "s" : ""}` : "Direct"}</small>
                      </span>
                      <b>{formatINR(f.price * cabin.factor)}</b>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="field">
                <legend>Stay</legend>
                <div className="pick-list">
                  {STAYS.map((s) => (
                    <label key={s.id} className={`pick ${trip.stay === s.id ? "is-on" : ""}`}>
                      <input type="radio" name="stay" checked={trip.stay === s.id} onChange={() => set("stay", s.id)} />
                      <span className="pick-main">
                        <b>{s.label}</b>
                        <small>{s.perks.join(", ")}</small>
                      </span>
                      <b>{formatINR(d.price * 0.55 * s.factor)}</b>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button className="btn btn-glow btn-block" type="submit">Continue to travellers</button>
            </form>
          )}

          {step === 1 && (
            <form className="ck-card" onSubmit={next}>
              <h2>Who&apos;s travelling</h2>
              <label className="field">
                <span>Lead traveller, name as on passport</span>
                <input value={people.lead} onChange={(e) => setPeople({ ...people, lead: e.target.value })} required autoComplete="name" />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Email for tickets</span>
                  <input type="email" value={people.email} onChange={(e) => setPeople({ ...people, email: e.target.value })} required autoComplete="email" />
                </label>
                <label className="field">
                  <span>Mobile number</span>
                  <input type="tel" value={people.phone} onChange={(e) => setPeople({ ...people, phone: e.target.value })} required autoComplete="tel" />
                </label>
              </div>
              {people.others.map((name, i) => (
                <label className="field" key={i}>
                  <span>Traveller {i + 2}</span>
                  <input
                    value={name}
                    onChange={(e) => {
                      const others = [...people.others];
                      others[i] = e.target.value;
                      setPeople({ ...people, others });
                    }}
                    required
                  />
                </label>
              ))}
              <div className="ck-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-glow" type="submit">Review trip</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="ck-card" onSubmit={confirm}>
              <h2>Review and pay</h2>
              <dl className="review-list">
                <div><dt>Dates</dt><dd>{prettyDate(trip.depart)} – {prettyDate(trip.ret)}</dd><button type="button" onClick={() => setStep(0)}>Edit</button></div>
                <div><dt>Flight</dt><dd>{flight.airline} {flight.number}, {flight.depart} → {flight.arrive}, {cabin.label}</dd><button type="button" onClick={() => setStep(0)}>Edit</button></div>
                <div><dt>Stay</dt><dd>{stay.label}, {d.nights} nights</dd><button type="button" onClick={() => setStep(0)}>Edit</button></div>
                <div><dt>Travellers</dt><dd>{[people.lead, ...people.others].join(", ")}</dd><button type="button" onClick={() => setStep(1)}>Edit</button></div>
                <div><dt>Tickets to</dt><dd>{people.email}</dd><button type="button" onClick={() => setStep(1)}>Edit</button></div>
              </dl>

              <fieldset className="field">
                <legend>How do you want to pay?</legend>
                <div className="pick-list">
                  {PAYMENTS.map((p) => (
                    <label key={p.id} className={`pick ${payment === p.id ? "is-on" : ""}`}>
                      <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                      <span className="pick-main">
                        <b>{p.label}</b>
                        <small>{p.text}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="check">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
                <span>I&apos;ve checked the names match each passport and accept the fare rules.</span>
              </label>

              <div className="ck-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-glow" type="submit">
                  {payment === "hold" ? "Hold my trip" : `Confirm and pay ${formatINR(total)}`}
                </button>
              </div>
              <p className="fine">This is a demo. No payment is taken.</p>
            </form>
          )}

          {step === 3 && confirmed && (
            <div className="ck-card ck-done">
              <div className="confetti" aria-hidden="true">
                {Array.from({ length: 24 }, (_, i) => (
                  <i key={i} style={{ "--i": i }} />
                ))}
              </div>
              <h2>{payment === "hold" ? "Held. Your price is locked for 48 hours." : "Booked. See you at the gate."}</h2>
              <p>We&apos;ve sent everything to {confirmed.email}.</p>
              <BoardingPass trip={confirmed} />
              <div className="ck-actions">
                <Link href="/trips" className="btn btn-glow">View my trips</Link>
                <Link href="/destinations" className="btn btn-ghost">Plan another trip</Link>
              </div>
            </div>
          )}
        </div>

        <aside className="ck-summary">
          <div className="ck-summary-img">
            <Image src={photo(d.img, 800)} alt={`${d.city}, ${d.country}`} fill sizes="380px" />
            <div>
              <small>{ORIGIN.code} → {d.code}</small>
              <b>{d.city}</b>
            </div>
          </div>
          <dl className="summary">
            <div><dt>Flight, {cabin.label.toLowerCase()}</dt><dd>{formatINR(flight.price * cabin.factor)}</dd></div>
            <div><dt>{stay.label}</dt><dd>{formatINR(d.price * 0.55 * stay.factor)}</dd></div>
            <div><dt>Per person × {trip.travellers}</dt><dd>{formatINR(subtotal)}</dd></div>
            <div><dt>Taxes and fees</dt><dd>{formatINR(taxes)}</dd></div>
            <div className="summary-total"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
          </dl>
          <p className="fine">Free cancellation until 48 hours after booking.</p>
        </aside>
      </div>
    </section>
  );
}
