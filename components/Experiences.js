"use client";

import Image from "next/image";
import { useState } from "react";
import { byId, experiences, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SplitText from "./SplitText";

export default function Experiences() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState(0);

  return (
    <section className="experiences" id="experiences">
      <div className="section-head">
        <h2 className="display" data-reveal><SplitText>Trips built around how you like to travel</SplitText></h2>
        <p className="section-sub" data-reveal>Hover a style to open it. Every one comes with flights, a hand-picked stay and airport pickup.</p>
      </div>

      <div className="accordion" data-reveal>
        {experiences.map((x, i) => (
          <article
            key={x.id}
            className={`panel ${active === i ? "is-open" : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <Image src={photo(x.img, 1200)} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />
            <div className="panel-shade" />
            <h3 className="panel-label">{x.title}</h3>
            <div className="panel-body">
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <button
                className="btn btn-white btn-sm"
                tabIndex={active === i ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  openBooking(byId[x.dest]);
                }}
              >
                Try {byId[x.dest].city}
              </button>
            </div>
            <button className="panel-hit" aria-label={`Open ${x.title}`} aria-expanded={active === i} />
          </article>
        ))}
      </div>
    </section>
  );
}
