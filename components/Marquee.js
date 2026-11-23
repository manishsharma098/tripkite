import { destinations } from "@/lib/data";

export default function Marquee() {
  const words = destinations.map((d) => d.city);
  const row = [...words, ...words];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row.map((w, i) => (
          <span key={i} className={i % 2 ? "is-outline" : ""}>
            {w}
            <svg viewBox="0 0 40 40" width="34" height="34">
              <path d="M20 2 L36 18 L20 31 L4 18 Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
