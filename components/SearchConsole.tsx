"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { byId, byOrigin, destinations, flightShare, formatINR, origins, photo } from "@/lib/data";
import { addDays, iso } from "@/lib/trips";

const MODES = [
  { id: "flights", label: "Flights", cta: "Search flights" },
  { id: "stays", label: "Stays", cta: "Search stays" },
  { id: "packages", label: "Packages", cta: "Search packages" },
];
const CABINS = [
  ["economy", "Economy"],
  ["premium", "Premium"],
  ["business", "Business"],
];
const TYPED = ["Kyoto", "Bali", "Santorini", "Paris", "Dubai", "Ha Long Bay"];
const QUICK = [
  { id: "weekend", label: "This weekend" },
  { id: "budget", label: "Under ₹30k", filter: (d) => d.price < 30000 },
  { id: "beach", label: "Beach", filter: (d) => d.type === "Beach" },
  { id: "visa", label: "Easy visa", filter: (d) => /free|arrival|48 hours/i.test(d.visa) },
];
const PANEL_WIDTH = { from: 380, to: 440, dates: 740, people: 380 };
const RECENT_KEY = "tripkite:recent";
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/* ---------- helpers ---------- */
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 1000003, 7);
const cheapestBase = Math.min(...destinations.map(flightShare));
const dayFare = (dest, day) => {
  const base = dest ? flightShare(dest) : cheapestBase;
  return Math.round((base * (0.8 + (hash(day + (dest?.code || "")) % 40) / 100)) / 100) * 100;
};
const short = (s) => (s ? new Date(s + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "");
const nextWeekend = () => {
  const d = new Date();
  const toFri = (5 - d.getDay() + 7) % 7 || 7;
  const fri = addDays(toFri, d);
  return [iso(fri), iso(addDays(2, fri))];
};
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}
function saveRecent(entry) {
  try {
    const rest = loadRecent().filter((r) => !(r.to === entry.to && r.depart === entry.depart));
    localStorage.setItem(RECENT_KEY, JSON.stringify([entry, ...rest].slice(0, 3)));
  } catch {}
}

/* ---------- small pieces ---------- */

// Old value rolls up and out while the new one rolls in
function Roll({ text }) {
  const [state, setState] = useState({ cur: text, prev: null, n: 0 });
  useEffect(() => {
    setState((s) => (s.cur === text ? s : { cur: text, prev: s.cur, n: s.n + 1 }));
  }, [text]);
  return (
    <span className="rt">
      <span key={`c${state.n}`} className={state.n ? "rt-in" : ""}>{state.cur}</span>
      {state.prev !== null && (
        <span key={`p${state.n}`} className="rt-out" aria-hidden="true" onAnimationEnd={() => setState((s) => ({ ...s, prev: null }))}>
          {state.prev}
        </span>
      )}
    </span>
  );
}

const Icon = ({ name }) => {
  const paths = {
    from: <path d="M3 20h18M5.5 14.5 3 10l2-.5 2.5 2.5 4-1.2L8 4.5 10.2 4l6 5.6 3.6-1a1.6 1.6 0 0 1 .8 3.1L6.4 15.6z" />,
    to: <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    date: <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 4h16M8 3v4m8-4v4" />,
    people: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 10a6 6 0 0 1 12 0m1-10a3.5 3.5 0 0 0 0-7m2 17a5.5 5.5 0 0 0-3-5" />,
    clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v4l3 2" />,
    search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
  };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="ico">
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
};

function Counter({ label, hint, value, min, max, onChange }) {
  return (
    <div className="counter">
      <div>
        <b>{label}</b>
        <small>{hint}</small>
      </div>
      <div className="counter-ctl">
        <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Fewer ${label.toLowerCase()}`}>−</button>
        <output aria-live="polite"><Roll text={String(value)} /></output>
        <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`More ${label.toLowerCase()}`}>+</button>
      </div>
    </div>
  );
}

function Calendar({ dest, depart, ret, oneWay, onPick, labels }) {
  const today = iso(new Date());
  const start = new Date();
  start.setDate(1);
  const startFrom = depart ? new Date(depart + "T00:00:00") : new Date();
  const initial = (startFrom.getFullYear() - start.getFullYear()) * 12 + startFrom.getMonth() - start.getMonth();
  const [offset, setOffset] = useState(Math.max(0, initial));
  const [dir, setDir] = useState(0);
  const [hover, setHover] = useState(null);

  const months = [offset, offset + 1].map((o) => new Date(start.getFullYear(), start.getMonth() + o, 1));
  const fares = useMemo(() => {
    const out: Record<string, number> = {};
    months.forEach((m) => {
      const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const key = iso(new Date(Date.UTC(m.getFullYear(), m.getMonth(), d)));
        if (key >= today) out[key] = dayFare(dest, key);
      }
    });
    return out;
  }, [offset, dest?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const cheapLine = useMemo(() => {
    const v = Object.values(fares).sort((a, b) => a - b);
    return v[Math.floor(v.length * 0.25)] || 0;
  }, [fares]);

  const end = ret || (!oneWay && depart && hover > depart ? hover : null);
  const step = (n) => {
    setDir(n);
    setOffset((o) => Math.max(0, o + n));
  };

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={() => step(-1)} disabled={offset === 0} aria-label="Previous month">‹</button>
        <p>
          {oneWay ? `Pick your ${labels[0].toLowerCase()} date` : !depart || ret ? `Pick your ${labels[0].toLowerCase()} date` : `Now pick your ${labels[1].toLowerCase()} date`}
        </p>
        <button type="button" onClick={() => step(1)} aria-label="Next month">›</button>
      </div>
      <div className={`cal-months ${dir > 0 ? "from-right" : dir < 0 ? "from-left" : ""}`} key={offset}>
        {months.map((m) => {
          const lead = (m.getDay() + 6) % 7;
          const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
          return (
            <div className="cal-month" key={m.toISOString()}>
              <h4>{m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h4>
              <div className="cal-grid">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="cal-wd">{w}</span>
                ))}
                {Array.from({ length: lead }, (_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: days }, (_, i) => {
                  const key = iso(new Date(Date.UTC(m.getFullYear(), m.getMonth(), i + 1)));
                  const past = key < today;
                  const cls = [
                    "cal-day",
                    past && "is-past",
                    key === depart && "is-start",
                    key === end && "is-end",
                    depart && end && key > depart && key < end && "in-range",
                    !past && fares[key] <= cheapLine && "is-cheap",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button
                      type="button"
                      key={key}
                      className={cls}
                      disabled={past}
                      onClick={() => onPick(key)}
                      onMouseEnter={() => setHover(key)}
                      aria-label={`${short(key)}${fares[key] ? `, from ${formatINR(fares[key])}` : ""}`}
                      aria-pressed={key === depart || key === end}
                    >
                      <b>{i + 1}</b>
                      {!past && <small>{Math.round(fares[key] / 1000)}k</small>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="cal-legend">
        <span className="dot-cheap" /> Cheapest days · prices per person, in thousands of rupees
      </p>
    </div>
  );
}

/* ---------- the console ---------- */

export default function SearchConsole({ variant = "hero", initial = {} as any }) {
  const router = useRouter();
  const [mode, setMode] = useState(Math.max(0, MODES.findIndex((m) => m.id === initial.mode)));
  const [oneWay, setOneWay] = useState(initial.trip === "oneway");
  const [fromId, setFromId] = useState(initial.from && byOrigin[initial.from] ? initial.from : "");
  const [fromQuery, setFromQuery] = useState("");
  const [to, setTo] = useState(initial.to && byId[initial.to] ? initial.to : "");
  const [query, setQuery] = useState(byId[initial.to]?.city || "");
  const [depart, setDepart] = useState(initial.depart || "");
  const [ret, setRet] = useState(initial.ret || "");
  const [pax, setPax] = useState({
    adults: Number(initial.adults) || Number(initial.travellers) || 2,
    children: Number(initial.children) || 0,
    infants: Number(initial.infants) || 0,
  });
  const [cabin, setCabin] = useState(initial.cabin || "economy");
  const [open, setOpen] = useState(null);
  const [shown, setShown] = useState(null);
  const [filter, setFilter] = useState(null);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null);
  const [glow, setGlow] = useState(null);
  const [panel, setPanel] = useState({ left: 0, width: 440, height: 0 });
  const [mini, setMini] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef(null);
  const barRef = useRef(null);
  const innerRef = useRef(null);
  const inputRef = useRef(null);
  const fromInputRef = useRef(null);
  const segs = { from: useRef(null), to: useRef(null), dates: useRef(null), people: useRef(null) };

  const stays = MODES[mode].id === "stays";
  const roundTrip = stays || !oneWay;
  const dest = byId[to];
  const fromCity = byOrigin[fromId];
  const labels = stays ? ["Check-in", "Check-out"] : ["Depart", "Return"];
  const travellers = pax.adults + pax.children;

  // Default dates are set in the browser so server and client markup agree
  useEffect(() => {
    setMounted(true);
    setRecent(loadRecent());
    if (!initial.depart) {
      const d = iso(addDays(21));
      setDepart(d);
      setRet(iso(addDays(6, new Date(d + "T00:00:00"))));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* typewriter placeholder */
  useEffect(() => {
    if (query || open === "to" || reducedMotion()) {
      setTyped("");
      return;
    }
    let city = 0;
    let i = 0;
    let deleting = false;
    let t;
    const tick = () => {
      const word = TYPED[city];
      if (!deleting) {
        i++;
        setTyped(word.slice(0, i));
        if (i === word.length) {
          deleting = true;
          t = setTimeout(tick, 1500);
          return;
        }
        t = setTimeout(tick, 90);
      } else {
        i--;
        setTyped(word.slice(0, i));
        if (i === 0) {
          deleting = false;
          city = (city + 1) % TYPED.length;
          t = setTimeout(tick, 350);
          return;
        }
        t = setTimeout(tick, 40);
      }
    };
    t = setTimeout(tick, 1800);
    return () => clearTimeout(t);
  }, [query, open]);

  /* sliding highlight */
  const glowTo = (el) => {
    if (!el) return setGlow(null);
    setGlow({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  };
  const restGlow = () => glowTo(open ? segs[open].current : null);

  /* panel geometry: follows the open segment and animates its height */
  useLayoutEffect(() => {
    if (open) setShown(open);
    const place = () => {
      const bar = barRef.current;
      const key = open || shown || "to";
      if (!bar) return;
      const bw = bar.offsetWidth;
      const w = Math.min(PANEL_WIDTH[key], bw);
      const seg = segs[key].current;
      const left = key === "dates" ? (bw - w) / 2 : Math.max(0, Math.min(seg ? seg.offsetLeft : 0, bw - w));
      setPanel((p) => ({ ...p, left, width: w }));
    };
    place();
    if (open) glowTo(segs[open].current);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPanel((p) => ({ ...p, height: el.offsetHeight })));
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);

  /* close on outside click / Escape */
  useEffect(() => {
    if (!open) return;
    const down = (e) => !rootRef.current?.contains(e.target) && close();
    const key = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }); // re-bind each render so close() sees fresh state

  /* sticky mini bar once the real bar scrolls away (home hero only) */
  useEffect(() => {
    if (variant !== "hero" || !barRef.current) return;
    const io = new IntersectionObserver(([e]) => setMini(!e.isIntersecting && e.boundingClientRect.top < 0), {
      rootMargin: "-80px 0px 0px 0px",
    });
    io.observe(barRef.current);
    return () => io.disconnect();
  }, [variant]);

  function openPanel(name) {
    setOpen(name);
    if (name === "to") requestAnimationFrame(() => inputRef.current?.focus());
    if (name === "from") requestAnimationFrame(() => fromInputRef.current?.focus());
  }
  function close() {
    setOpen(null);
    setGlow(null);
  }
  const pulse = (name) => {
    setFlash(name);
    setTimeout(() => setFlash(null), 700);
  };

  /* destination suggestions */
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const exact = dest && dest.city.toLowerCase() === q;
    return destinations
      .filter((d) => !filter || filter.filter(d))
      .filter((d) => !q || exact || `${d.city} ${d.country} ${d.code}`.toLowerCase().includes(q));
  }, [query, filter, dest]);
  const showRecent = !query && !filter && recent.length > 0;

  const fromList = origins.filter((o) => {
    const q = fromQuery.trim().toLowerCase();
    return !q || `${o.city} ${o.code}`.toLowerCase().includes(q);
  });

  function pickFrom(o) {
    setFromId(o.id);
    setFromQuery("");
    pulse("from");
    setTimeout(() => openPanel("to"), 180);
  }

  function choose(d) {
    setTo(d.id);
    setQuery(d.city);
    setFilter(null);
    pulse("to");
    setTimeout(() => openPanel("dates"), 180);
  }

  function applyRecent(r) {
    setFromId(r.from && byOrigin[r.from] ? r.from : "");
    setTo(r.to);
    setQuery(byId[r.to].city);
    setDepart(r.depart);
    setRet(r.ret || "");
    setOneWay(r.trip === "oneway");
    setPax({ adults: r.adults, children: r.children, infants: r.infants });
    setCabin(r.cabin || "economy");
    setMode(Math.max(0, MODES.findIndex((m) => m.id === r.mode)));
    close();
    pulse("all");
  }

  function pickDate(day) {
    if (!roundTrip) {
      setDepart(day);
      setRet("");
      pulse("dates");
      setTimeout(() => openPanel("people"), 220);
    } else if (!depart || ret || day <= depart) {
      setDepart(day);
      setRet("");
    } else {
      setRet(day);
      pulse("dates");
      setTimeout(() => openPanel("people"), 260);
    }
  }

  function quick(q) {
    if (q.id === "weekend") {
      const [a, b] = nextWeekend();
      setDepart(a);
      setRet(b);
      setOneWay(false);
      pulse("dates");
      return;
    }
    setFilter(filter?.id === q.id ? null : q);
    setTo("");
    setQuery("");
    setActive(0);
    openPanel("to");
  }

  function onKey(e) {
    if (open !== "to") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(list.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && list[active]) {
      e.preventDefault();
      choose(list[active]);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!stays && !fromCity) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      openPanel("from");
      return;
    }
    if (!dest) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      openPanel("to");
      return;
    }
    const entry = { from: fromId, to, depart, ret: roundTrip ? ret : "", trip: roundTrip ? "return" : "oneway", ...pax, cabin, mode: MODES[mode].id };
    saveRecent(entry);
    setLoading(true);
    close();
    const qs = new URLSearchParams();
    Object.entries({ ...entry, travellers }).forEach(([k, v]) => qs.set(k, String(v ?? "")));
    setTimeout(() => router.push(`/search?${qs}`), reducedMotion() ? 0 : 950);
  }

  function jumpUp() {
    const go = () => openPanel("to");
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.1, onComplete: go });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(go, 700);
    }
  }

  /* text for the live hint */
  const pct = dest ? 6 + (hash(dest.code) % 14) : 0;
  const hintPrice = dest
    ? stays
      ? (dest.price * 0.55) / dest.nights
      : MODES[mode].id === "packages"
        ? dest.price
        : Math.min(...Array.from({ length: 30 }, (_, i) => dayFare(dest, iso(addDays(i + 1)))))
    : cheapestBase * 0.8;
  const dateText = depart ? (roundTrip && ret ? `${short(depart)} – ${short(ret)}` : roundTrip ? `${short(depart)} – ?` : short(depart)) : "Add dates";
  const paxText = `${travellers} ${travellers === 1 ? "traveller" : "travellers"}${pax.infants ? `, ${pax.infants} infant${pax.infants > 1 ? "s" : ""}` : ""}`;

  const panelKey = open || shown;

  return (
    <form
      ref={rootRef}
      className={`console sc console-${variant} ${shake ? "is-shake" : ""} ${flash === "all" ? "is-flash" : ""}`}
      onSubmit={submit}
      onKeyDown={onKey}
    >
      <div className="sc-top">
        <div className="mode-tabs" role="tablist" aria-label="What are you booking" style={{ "--tab": mode, "--count": MODES.length }}>
          <span className="mode-pill" aria-hidden="true" />
          {MODES.map((m, i) => (
            <button type="button" role="tab" key={m.id} aria-selected={mode === i} onClick={() => setMode(i)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className={`trip-toggle ${stays ? "is-hidden" : ""}`} role="radiogroup" aria-label="Trip type" style={{ "--pos": oneWay ? 1 : 0, "--n": 2 }}>
          <span className="trip-pill" aria-hidden="true" />
          <button type="button" role="radio" aria-checked={!oneWay} onClick={() => setOneWay(false)} tabIndex={stays ? -1 : 0}>Return</button>
          <button type="button" role="radio" aria-checked={oneWay} onClick={() => setOneWay(true)} tabIndex={stays ? -1 : 0}>One way</button>
        </div>
      </div>

      <div className="sc-wrap">
        <div
          ref={barRef}
          className={`search-bar ${open ? "has-open" : ""} ${glow ? "has-glow" : ""}`}
          onMouseLeave={restGlow}
        >
          <span
            className={`seg-glow ${glow ? "is-on" : ""} ${open ? "is-solid" : ""}`}
            style={glow ? { "--x": `${glow.x}px`, "--y": `${glow.y}px`, "--w": `${glow.w}px`, "--h": `${glow.h}px` } : undefined}
            aria-hidden="true"
          />

          <button
            type="button"
            ref={segs.from}
            className={`seg ${open === "from" ? "is-open" : ""} ${flash === "from" ? "is-flash" : ""} ${stays ? "is-collapsed" : ""}`}
            style={{ "--i": 0 }}
            onMouseEnter={(e) => glowTo(e.currentTarget)}
            onClick={() => openPanel(open === "from" ? null : "from")}
            aria-expanded={open === "from"}
            aria-haspopup="dialog"
          >
            <Icon name="from" />
            <span className="seg-text">
              <span className="seg-label">From</span>
              <span className="seg-value">{fromCity ? `${fromCity.city} (${fromCity.code})` : "Select city"}</span>
            </span>
          </button>

          <div
            ref={segs.to}
            className={`seg ${open === "to" ? "is-open" : ""} ${flash === "to" ? "is-flash" : ""}`}
            style={{ "--i": 1, "--grow": stays ? 1.6 : 1.15 }}
            onMouseEnter={(e) => glowTo(e.currentTarget)}
            onClick={() => openPanel("to")}
          >
            <Icon name="to" />
            <span className="seg-text">
              <span className="seg-label"><Roll text={stays ? "Where" : "To"} /></span>
              <span className="seg-input">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setTo("");
                    setActive(0);
                    if (open !== "to") setOpen("to");
                  }}
                  onFocus={() => setOpen("to")}
                  placeholder={open === "to" ? "City or country" : ""}
                  role="combobox"
                  aria-expanded={open === "to"}
                  aria-controls="sc-list"
                  aria-activedescendant={open === "to" && list[active] ? `sc-opt-${list[active].id}` : undefined}
                  aria-label="Destination"
                  autoComplete="off"
                />
                {!query && open !== "to" && (
                  <span className="typer" aria-hidden="true">
                    {typed ? `Try ${typed}` : "Where to?"}
                    <i />
                  </span>
                )}
              </span>
            </span>
          </div>

          <button
            type="button"
            ref={segs.dates}
            className={`seg ${open === "dates" ? "is-open" : ""} ${flash === "dates" ? "is-flash" : ""}`}
            style={{ "--i": 2, "--grow": 1.1 }}
            onMouseEnter={(e) => glowTo(e.currentTarget)}
            onClick={() => openPanel(open === "dates" ? null : "dates")}
            aria-expanded={open === "dates"}
            aria-haspopup="dialog"
          >
            <Icon name="date" />
            <span className="seg-text">
              <span className="seg-label"><Roll text={roundTrip ? `${labels[0]} – ${labels[1]}` : labels[0]} /></span>
              <span className="seg-value"><Roll text={dateText} /></span>
            </span>
          </button>

          <button
            type="button"
            ref={segs.people}
            className={`seg ${open === "people" ? "is-open" : ""}`}
            style={{ "--i": 3 }}
            onMouseEnter={(e) => glowTo(e.currentTarget)}
            onClick={() => openPanel(open === "people" ? null : "people")}
            aria-expanded={open === "people"}
            aria-haspopup="dialog"
          >
            <Icon name="people" />
            <span className="seg-text">
              <span className="seg-label"><Roll text={stays ? "Guests" : `Travellers · ${CABINS.find((c) => c[0] === cabin)[1]}`} /></span>
              <span className="seg-value"><Roll text={paxText} /></span>
            </span>
          </button>

          <button className={`search-go ${loading ? "is-loading" : ""}`} type="submit" data-magnetic disabled={loading} style={{ "--i": 4 }}>
            <Icon name="search" />
            <span className="go-text"><Roll text={MODES[mode].cta} /></span>
            <span className="go-orbit" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
            </span>
          </button>
        </div>

        <div
          className={`sc-panel ${open ? "is-open" : ""}`}
          style={{ left: panel.left, width: panel.width, height: panel.height }}
          role="dialog"
          aria-label={panelKey === "from" ? "Choose a departure city" : panelKey === "to" ? "Choose a destination" : panelKey === "dates" ? "Choose dates" : "Travellers"}
        >
          <div ref={innerRef} className="sc-panel-inner" key={panelKey}>
            {panelKey === "from" && (
              <div className="sugg">
                <input
                  ref={fromInputRef}
                  className="sugg-search"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  placeholder="City or airport code"
                  aria-label="Departure city"
                  autoComplete="off"
                />
                <p className="sugg-head">Flying from</p>
                <ul role="listbox" aria-label="Departure cities">
                  {fromList.length === 0 && <li className="sugg-none">No city matches “{fromQuery}”.</li>}
                  {fromList.map((o) => (
                    <li key={o.id}>
                      <button type="button" className={`sugg-row ${fromId === o.id ? "is-active" : ""}`} onClick={() => pickFrom(o)}>
                        <span className="sugg-icon"><Icon name="from" /></span>
                        <span className="sugg-main">
                          <b>{o.city}</b>
                          <small>India</small>
                        </span>
                        <span className="sugg-code">{o.code}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panelKey === "to" && (
              <div className="sugg">
                {filter && (
                  <div className="sugg-filter">
                    <span>{filter.label} · {list.length} {list.length === 1 ? "place" : "places"}</span>
                    <button type="button" onClick={() => setFilter(null)} aria-label="Clear filter"><Icon name="close" /></button>
                  </div>
                )}
                {showRecent && (
                  <>
                    <p className="sugg-head">Recent searches</p>
                    {recent.map((r) => (
                      <button type="button" key={r.to + r.depart} className="sugg-row sugg-recent" onClick={() => applyRecent(r)}>
                        <span className="sugg-icon"><Icon name="clock" /></span>
                        <span className="sugg-main">
                          <b>{byId[r.to].city}</b>
                          <small>{short(r.depart)}{r.ret ? ` – ${short(r.ret)}` : ""} · {r.adults + r.children} travellers</small>
                        </span>
                      </button>
                    ))}
                  </>
                )}
                <p className="sugg-head">{query || filter ? "Matches" : "Popular destinations"}</p>
                <ul id="sc-list" role="listbox" aria-label="Destinations">
                  {list.length === 0 && <li className="sugg-none">No destination matches “{query}”. Try a country instead.</li>}
                  {(query || filter ? list : list.slice(0, 5)).map((d, i) => (
                    <li
                      key={d.id}
                      id={`sc-opt-${d.id}`}
                      role="option"
                      aria-selected={i === active}
                      className={`sugg-row ${i === active ? "is-active" : ""}`}
                      style={{ "--i": i }}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(d)}
                    >
                      <span className="sugg-img">
                        <Image src={photo(d.img, 160)} alt="" fill sizes="48px" />
                      </span>
                      <span className="sugg-main">
                        <b>{d.city}</b>
                        <small>{d.country} · {d.type}</small>
                      </span>
                      <span className="sugg-side">
                        <span className="sugg-code">{d.code}</span>
                        <small>from {formatINR(d.price)}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panelKey === "dates" && (
              <Calendar dest={dest} depart={depart} ret={roundTrip ? ret : ""} oneWay={!roundTrip} onPick={pickDate} labels={labels} />
            )}

            {panelKey === "people" && (
              <div className="pax">
                <Counter label="Adults" hint="12 years and over" value={pax.adults} min={1} max={9 - pax.children} onChange={(v) => setPax({ ...pax, adults: v, infants: Math.min(pax.infants, v) })} />
                <Counter label="Children" hint="2 to 11 years" value={pax.children} min={0} max={9 - pax.adults} onChange={(v) => setPax({ ...pax, children: v })} />
                <Counter label="Infants" hint="Under 2, on a lap" value={pax.infants} min={0} max={pax.adults} onChange={(v) => setPax({ ...pax, infants: v })} />
                {!stays && (
                  <div className="pax-cabin">
                    <b>Cabin</b>
                    <div className="pax-cabins" style={{ "--pos": CABINS.findIndex((c) => c[0] === cabin), "--n": 3 }}>
                      <span className="trip-pill" aria-hidden="true" />
                      {CABINS.map(([id, label]) => (
                        <button type="button" key={id} aria-pressed={cabin === id} onClick={() => setCabin(id)}>{label}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button type="button" className="btn btn-dark btn-block" onClick={close}>Done</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sc-bottom">
        <p className="hint" aria-live="polite">
          <span className="hint-dot" />
          {dest ? (
            <>
              {stays ? "Stays" : MODES[mode].id === "packages" ? "Packages" : "Fares"} in {dest.city} from{" "}
              <b><Roll text={formatINR(hintPrice)} /></b>
              {stays ? " a night" : ""}
              <span className="hint-tag">{pct}% cheaper than last week</span>
            </>
          ) : (
            <>{fromCity ? `Flights from ${fromCity.city} start at ` : "Pick a departure city. Fares start at "}<b>{formatINR(hintPrice)}</b></>
          )}
        </p>
        <div className="quick">
          {recent.slice(0, 2).map((r) => (
            <button type="button" key={`r-${r.to}-${r.depart}`} className="quick-chip is-recent" onClick={() => applyRecent(r)}>
              <Icon name="clock" />
              {byId[r.to].city} · {short(r.depart)}
            </button>
          ))}
          {QUICK.map((q) => (
            <button type="button" key={q.id} className={`quick-chip ${filter?.id === q.id ? "is-on" : ""}`} onClick={() => quick(q)}>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {mounted &&
        variant === "hero" &&
        createPortal(
          <button type="button" className={`mini-search ${mini ? "is-shown" : ""}`} onClick={jumpUp} tabIndex={mini ? 0 : -1} aria-hidden={!mini}>
            <Icon name="search" />
            <span><b>{dest ? dest.city : "Where to?"}</b></span>
            <span className="mini-sep" />
            <span>{dateText}</span>
            <span className="mini-sep" />
            <span>{travellers} {travellers === 1 ? "traveller" : "travellers"}</span>
            <span className="mini-go"><Icon name="search" /></span>
          </button>,
          document.body
        )}
    </form>
  );
}
