"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deals, formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";

function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Countdown({ days, now }) {
  if (!now) return <span className="mini-timer">--:--:--</span>;
  const end = new Date();
  end.setDate(end.getDate() + days);
  end.setHours(23, 59, 59, 0);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
  return (
    <span className="mini-timer">
      {parts[0] > 0 && <b>{parts[0]}d</b>}
      {parts.slice(1).map((p, i) => (
        <b key={i}>{String(p).padStart(2, "0")}</b>
      ))}
    </span>
  );
}

const SORTS = {
  off: ["Biggest drop", (a, b) => b.off - a.off],
  soon: ["Ending soon", (a, b) => a.days - b.days],
  price: ["Lowest price", (a, b) => a.dest.price - b.dest.price],
};

export default function DealsList() {
  const { openBooking } = useBooking();
  const now = useNow();
  const [sort, setSort] = useState("off");
  const [top, ...rest] = [...deals].sort(SORTS.off[1]);
  const list = (sort === "off" ? rest : [...deals].sort(SORTS[sort][1]));

  return (
    <section className="deals-page">
      <article className="deal-hero" data-reveal data-cursor="Grab it">
        <div className="deal-hero-img">
          <Image src={photo(top.dest.img, 1400)} alt={`${top.dest.city}, ${top.dest.country}`} fill sizes="(max-width: 900px) 100vw, 60vw" />
          <span className="badge">−{top.off}%</span>
        </div>
        <div className="deal-hero-body">
          <p className="deal-kicker">Deal of the week</p>
          <h2>{top.dest.city}: {top.title.toLowerCase()}</h2>
          <p>{top.dest.note}. {top.dest.nights} nights with flights from New Delhi.</p>
          <p className="deal-price">
            <s>{formatINR(top.was)}</s>
            <b>{formatINR(top.dest.price)}</b>
          </p>
          <div className="deal-ends">
            Ends in <Countdown days={top.days} now={now} />
          </div>
          <div className="deal-actions">
            <button className="btn btn-glow" onClick={() => openBooking(top.dest)} data-magnetic>Grab this fare</button>
            <Link href={`/destinations/${top.id}`} className="link-arrow">See the trip</Link>
          </div>
        </div>
      </article>

      <div className="section-head deals-head">
        <h2 className="display small">{sort === "off" ? "More drops" : "All deals"}</h2>
        <div className="chips">
          {Object.entries(SORTS).map(([k, [label]]) => (
            <button key={k} className={sort === k ? "is-on" : ""} onClick={() => setSort(k)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="deal-grid" key={sort}>
        {list.map((x, i) => (
          <article key={x.id} className="deal-card" style={{ "--i": i, "--tint": x.dest.tint }} data-tilt>
            <Link href={`/destinations/${x.id}`} className="deal-card-img">
              <Image src={photo(x.dest.img, 800)} alt={`${x.dest.city}, ${x.dest.country}`} fill sizes="(max-width: 700px) 100vw, 33vw" />
              <span className="deal-off">−{x.off}%</span>
            </Link>
            <div className="deal-card-body">
              <h3>{x.dest.city}</h3>
              <p>{x.title}, {x.dest.nights} nights</p>
              <div className="deal-card-foot">
                <span className="deal-price">
                  <s>{formatINR(x.was)}</s>
                  <b>{formatINR(x.dest.price)}</b>
                </span>
                <button className="btn btn-primary btn-sm" onClick={() => openBooking(x.dest)}>Book</button>
              </div>
              <div className="deal-ends">
                Ends in <Countdown days={x.days} now={now} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
