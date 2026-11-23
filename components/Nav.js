"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["Destinations", "/destinations"],
  ["Deals", "/deals"],
  ["My trips", "/trips"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

// Text that rolls up to a copy of itself on hover
const Roll = ({ children }) => (
  <span className="roll" data-text={children}>
    <span>{children}</span>
  </span>
);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${menu ? "is-menu" : ""}`}>
      <Link href="/" className="logo" aria-label="Tripkite home">
        <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
          <path d="M20 2 L36 18 L20 31 L4 18 Z" fill="var(--pink)" />
          <path d="M20 2 L36 18 L20 18 Z" fill="var(--sun)" />
          <path d="M4 18 L20 18 L20 31 Z" fill="var(--blue)" />
          <path d="M20 31 q-3 4 1 5.5 q4 2 1 3.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <span>tripkite</span>
      </Link>

      <nav className="nav-links" aria-label="Main">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={pathname.startsWith(href) ? "is-current" : ""}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
          >
            <Roll>{label}</Roll>
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
                <Link href="/search" className="btn btn-glow btn-sm" data-magnetic><Roll>Plan a trip</Roll></Link>
        <button
          className="nav-burger"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
