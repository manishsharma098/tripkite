import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="lost">
      <div className="lost-frame">
        <div className="lost-sky" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p className="lost-code" aria-hidden="true">
          <span>4</span>
          <svg viewBox="0 0 40 40" className="lost-kite">
            <path d="M20 2 L36 18 L20 31 L4 18 Z" fill="var(--pink)" />
            <path d="M20 2 L36 18 L20 18 Z" fill="var(--sun)" />
            <path d="M4 18 L20 18 L20 31 Z" fill="var(--blue)" />
            <path d="M20 31 q-3 4 1 5.5 q4 2 1 3.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <span>4</span>
        </p>
        <h1>This route isn&apos;t on our map</h1>
        <p>The page may have moved, or the link has a typo. Try one of these instead.</p>
        <div className="lost-actions">
          <Link href="/" className="btn btn-white" data-magnetic>Back to home</Link>
          <Link href="/destinations" className="btn btn-glow">Browse destinations</Link>
        </div>
      </div>
    </main>
  );
}
