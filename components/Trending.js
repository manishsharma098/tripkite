"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { destinations, formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SplitText from "./SplitText";

// On desktop the section pins and the card track slides sideways as you scroll down
export default function Trending() {
  const { openBooking } = useBooking();
  const router = useRouter();
  const section = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let distance = 0;
    let raf;

    const measure = () => {
      if (!mq.matches) {
        setHeight(null);
        track.current.style.transform = "";
        return;
      }
      distance = track.current.scrollWidth - window.innerWidth;
      setHeight(distance + window.innerHeight);
    };

    const update = () => {
      raf = null;
      if (!mq.matches) return;
      const top = section.current.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / distance));
      track.current.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
      bar.current.style.transform = `scaleX(${p})`;
      track.current.style.setProperty("--p", p);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="trending"
      id="trending"
      ref={section}
      style={height ? { height } : undefined}
    >
      <div className="trending-sticky">
        <div className="trending-track" ref={track}>
          <div className="trending-intro">
            <h2 className="display" data-reveal>
              <SplitText>Where everyone’s flying this week</SplitText>
            </h2>
            <p>Ten routes, ranked by bookings from {`New Delhi`} over the last seven days. Prices are per person, return.</p>
            <div className="trending-bar"><span ref={bar} /></div>
          </div>

          {destinations.map((d, i) => (
            <article
              className="tcard"
              key={d.id}
              style={{ "--tint": d.tint, "--k": i }}
              data-cursor="View"
              onClick={() => router.push(`/destinations/${d.id}`)}
            >
              <div className="tcard-img">
                <Image src={photo(d.img, 900)} alt={`${d.city}, ${d.country}`} fill sizes="(max-width: 900px) 80vw, 420px" />
              </div>
              <span className="tcard-rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="tcard-code">{d.code}</span>
              <div className="tcard-info">
                <h3><Link href={`/destinations/${d.id}`} onClick={(e) => e.stopPropagation()}>{d.city}</Link></h3>
                <p>{d.note}</p>
                <div className="tcard-foot">
                  <span>{d.country} · {d.nights} nights</span>
                  <button
                    className="tcard-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBooking(d);
                    }}
                  >
                    {formatINR(d.price)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
