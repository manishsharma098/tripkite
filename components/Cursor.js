"use client";

import { useEffect, useRef, useState } from "react";

// A soft follower dot that grows into a labelled bubble over [data-cursor] elements
export default function Cursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let raf;

    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hit = e.target.closest?.("[data-cursor]");
      setLabel(hit ? hit.dataset.cursor : "");
      el.classList.add("is-live");
    };
    const leave = () => el.classList.remove("is-live");

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className={`cursor ${label ? "has-label" : ""}`} ref={ref} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
