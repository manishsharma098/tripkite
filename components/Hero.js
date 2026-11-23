"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ORIGIN, byId, destinations, formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";
import SearchConsole from "./SearchConsole";

const SLIDES = ["santorini", "kyoto", "bali", "dolomites", "paris", "dubai"].map((id) => byId[id]);
const DURATION = 6500;

export default function Hero() {
  const { openBooking } = useBooking();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  const current = SLIDES[index];

  const go = (next) => {
    if (next === index) return;
    setPrev(index);
    setIndex(next);
  };

  // Hold the slideshow until the intro curtain has lifted
  useEffect(() => {
    if (!document.documentElement.classList.contains("is-loading")) return setReady(true);
    const onLoaded = () => setReady(true);
    window.addEventListener("tk:loaded", onLoaded);
    return () => window.removeEventListener("tk:loaded", onLoaded);
  }, []);

  useEffect(() => {
    if (paused || !ready) return;
    const t = setTimeout(() => go((index + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const upcoming = [1, 2, 3].map((n) => (index + n) % SLIDES.length);

  return (
    <section className="hero" id="top">
      <div
        className="hero-frame"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {SLIDES.map((d, i) => (
          <div
            key={d.id}
            className={`slide ${i === index ? "is-active" : ""} ${i === prev ? "is-prev" : ""}`}
            aria-hidden={i !== index}
          >
            <Image
              src={photo(d.img, 2000)}
              alt={`${d.city}, ${d.country}`}
              fill
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="hero-shade" />

        <div className="hero-content">
          <p className="hero-chip">
            <span className="pulse" /> Departures from {ORIGIN.city} · {destinations.length} destinations
          </p>

          <h1 className="hero-title">
            <span className="hero-pre">Your next stop is</span>
            <span className="hero-city" key={current.id} aria-label={current.city} style={{ "--len": current.city.length }}>
              {current.city.split("").map((ch, i) => (
                <span key={i} style={{ "--i": i }} aria-hidden="true">
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
          </h1>

          <div className="hero-meta" key={`meta-${current.id}`}>
            <p>{current.note}.</p>
            <button className="btn btn-white" onClick={() => openBooking(current)} data-cursor="Book" data-magnetic>
              <span>{current.nights} nights from {formatINR(current.price)}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-count" aria-hidden="true">
            <b key={index}>{String(index + 1).padStart(2, "0")}</b>
            <span>/ {String(SLIDES.length).padStart(2, "0")}</span>
          </div>
          <div className="hero-thumbs">
            {upcoming.map((i, n) => {
              const d = SLIDES[i];
              return (
                <button
                  key={d.id}
                  className="thumb"
                  style={{ "--n": n }}
                  onClick={() => go(i)}
                  aria-label={`Show ${d.city}`}
                >
                  <span className="thumb-img">
                    <Image src={photo(d.img, 300)} alt="" fill sizes="80px" />
                  </span>
                  <span className="thumb-text">
                    <b>{d.city}</b>
                    <small>{d.country}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="hero-progress" aria-hidden="true">
            {SLIDES.map((d, i) => (
              <span key={d.id} className={i < index ? "is-done" : ""}>
                {i === index && <i key={index} className={paused || !ready ? "is-paused" : ""} />}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span />
          Scroll
        </div>
      </div>

      <SearchConsole variant="hero" />
    </section>
  );
}
