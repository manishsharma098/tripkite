"use client";

import { useEffect, useRef } from "react";

// Pointer and scroll driven effects, wired up through data attributes:
//   [data-magnetic]  element drifts toward the pointer
//   [data-tilt]      3D tilt with a moving glare
// plus a scroll progress bar, hero zoom-out and velocity skew on the ticker.
export default function Effects() {
  const bar = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups = [];

    if (finePointer && !reduced) {
      // Delegated so elements React re-creates (hero slides, filtered cards) keep working
      let magnet = null;
      const magnetMove = (e) => {
        const el = e.target.closest?.("[data-magnetic]");
        if (magnet && magnet !== el) magnet.style.translate = "";
        magnet = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.35;
        const y = (e.clientY - r.top - r.height / 2) * 0.45;
        el.style.translate = `${x}px ${y}px`;
      };
      document.addEventListener("pointermove", magnetMove);
      cleanups.push(() => document.removeEventListener("pointermove", magnetMove));

      const tiltMove = (e) => {
        const el = e.target.closest?.("[data-tilt]");
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
      };
      const tiltOut = (e) => {
        const el = e.target.closest?.("[data-tilt]");
        if (!el || el.contains(e.relatedTarget)) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      document.addEventListener("pointermove", tiltMove);
      document.addEventListener("pointerout", tiltOut);
      cleanups.push(() => {
        document.removeEventListener("pointermove", tiltMove);
        document.removeEventListener("pointerout", tiltOut);
      });
    }

    let lastY = window.scrollY;
    let skew = 0;
    let raf;

    const loop = () => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      if (!reduced) {
        // Queried each frame so it follows client-side page changes
        const hero = document.querySelector<HTMLElement>(".hero, .page-hero");
        const ticker = document.querySelector<HTMLElement>(".ticker");
        if (hero) hero.style.setProperty("--hp", Math.min(1, y / window.innerHeight).toFixed(3));
        const velocity = y - lastY;
        skew += (Math.max(-14, Math.min(14, velocity * 0.35)) - skew) * 0.12;
        if (ticker) ticker.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      }
      lastY = y;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
