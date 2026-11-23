"use client";

import { useEffect, useState } from "react";

const DURATION = 1700;

// Intro curtain: counts to 100, then lifts away and lets the hero animations start
export default function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new Event("tk:loaded"));
      setDone(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(100);
      finish();
      return;
    }

    let raf;
    let timer;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else timer = setTimeout(finish, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden="true">
      <svg className="preloader-kite" viewBox="0 0 40 40" width="64" height="64">
        <path d="M20 2 L36 18 L20 31 L4 18 Z" fill="var(--pink)" />
        <path d="M20 2 L36 18 L20 18 Z" fill="var(--sun)" />
        <path d="M4 18 L20 18 L20 31 Z" fill="var(--blue)" />
        <path d="M20 31 q-3 4 1 5.5 q4 2 1 3.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <div className="preloader-count">
        {n}
        <small>%</small>
      </div>
      <p>Packing your bags</p>
      <div className="preloader-bar">
        <span style={{ transform: `scaleX(${n / 100})` }} />
      </div>
    </div>
  );
}
