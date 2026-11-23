"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { byId, destinations, formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SplitText from "./SplitText";

function useCountdown() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 2);
    end.setHours(23, 59, 59, 0);
    const tick = () => setLeft(Math.max(0, end.getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return ["--", "--", "--"];
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) =>
    String(n).padStart(2, "0")
  );
}

export default function Deals() {
  const { openBooking } = useBooking();
  const [h, m, s] = useCountdown();
  const santorini = byId.santorini;
  const dubai = byId.dubai;
  const bali = byId.bali;
  const cheap = destinations.filter((d) => d.price < 30000).sort((a, b) => a.price - b.price);

  return (
    <section className="deals" id="deals">
      <div className="section-head">
        <h2 className="display" data-reveal><SplitText>Fares that dropped overnight</SplitText></h2>
        <div className="head-side" data-reveal>
          <p className="section-sub">Prices checked against the last 30 days. Book before the timer runs out.</p>
          <Link href="/deals" className="link-arrow">See all deals</Link>
        </div>
      </div>

      <div className="bento" data-reveal>
        <article className="bento-feature" data-cursor="Grab it" data-tilt>
          <Image src={photo(santorini.img, 1200)} alt="Santorini, Greece" fill sizes="(max-width: 900px) 100vw, 50vw" />
          <span className="badge">−22%</span>
          <div className="bento-feature-body">
            <h3>Santorini, five nights with sea-view suite</h3>
            <p>
              <s>{formatINR(santorini.price / 0.78)}</s> <strong>{formatINR(santorini.price)}</strong> per person
            </p>
            <div className="timer" aria-label={`Offer ends in ${h} hours ${m} minutes`}>
              {[h, m, s].map((v, i) => (
                <span key={i}>
                  <b>{v}</b>
                  <small>{["hrs", "min", "sec"][i]}</small>
                </span>
              ))}
            </div>
            <button className="btn btn-light" onClick={() => openBooking(santorini)}>
              Grab this fare
            </button>
          </div>
        </article>

        <article className="bento-wide" data-tilt>
          <Image src={photo(dubai.img, 1000)} alt="Dubai skyline" fill sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="bento-wide-body">
            <h3>Weekend in Dubai</h3>
            <p>Fri–Mon, flights and a 4-star hotel</p>
            <button className="price-pill" onClick={() => openBooking(dubai)}>
              {formatINR(dubai.price)}
            </button>
          </div>
        </article>

        <article className="bento-list" data-tilt>
          <h3>Under ₹30k</h3>
          <ul>
            {cheap.map((d) => (
              <li key={d.id}>
                <button onClick={() => openBooking(d)}>
                  <span>{d.city}</span>
                  <b>{formatINR(d.price)}</b>
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="bento-small" data-tilt>
          <Image src={photo(bali.img, 700)} alt="Bali rice terraces" fill sizes="(max-width: 900px) 50vw, 25vw" />
          <button className="bento-small-body" onClick={() => openBooking(bali)}>
            <span>Bali villa week</span>
            <b>{formatINR(bali.price)}</b>
          </button>
        </article>
      </div>
    </section>
  );
}
