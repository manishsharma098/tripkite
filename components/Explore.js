"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { destinations, formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SplitText from "./SplitText";

const FILTERS = ["All", "Beach", "City", "Nature"];
const MOODS = {
  All: "Every place we fly to, sorted by price.",
  Beach: "Warm water, long lunches, nothing on the calendar.",
  City: "Late nights, good food, a new neighbourhood every day.",
  Nature: "Lakes, peaks and bays that make the long flight worth it.",
};

export default function Explore() {
  const { openBooking } = useBooking();
  const [filter, setFilter] = useState("All");
  const list = destinations
    .filter((d) => filter === "All" || d.type === filter)
    .sort((a, b) => a.price - b.price);

  return (
    <section className="explore" id="explore">
      <div className="explore-head">
        <h2 className="display" data-reveal><SplitText>Pick a mood, we’ll find the place</SplitText></h2>
        <div className="chips" role="tablist" aria-label="Filter destinations">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={filter === f ? "is-on" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
              <small>{f === "All" ? destinations.length : destinations.filter((d) => d.type === f).length}</small>
            </button>
          ))}
        </div>
        <p className="section-sub" aria-live="polite">{MOODS[filter]}</p>
      </div>

      <div className="grid" key={filter}>
        {list.map((d, i) => (
          <article className="dcard" data-cursor="View" data-tilt key={d.id} style={{ "--i": i, "--tint": d.tint }}>
            <Link href={`/destinations/${d.id}`} className="dcard-img">
              <Image src={photo(d.img, 700)} alt={`${d.city}, ${d.country}`} fill sizes="(max-width: 700px) 100vw, 33vw" />
              <span className="dcard-type">{d.type}</span>
            </Link>
            <div className="dcard-body">
              <div>
                <h3><Link href={`/destinations/${d.id}`}>{d.city}</Link></h3>
                <p>{d.note}</p>
              </div>
              <div className="dcard-foot">
                <span>
                  <small>{d.nights} nights from</small>
                  <b>{formatINR(d.price)}</b>
                </span>
                <button className="btn btn-primary btn-sm" onClick={() => openBooking(d)}>
                  Book
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
