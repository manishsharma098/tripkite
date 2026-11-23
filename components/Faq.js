"use client";

import { useState } from "react";

const QUESTIONS = [
  ["How does the 48-hour fare hold work?", "Choose “Hold for 48 hours” at checkout. We lock the price and seats without charging you. If you don't pay before the hold ends, it simply expires."],
  ["Can I change my dates after booking?", "Yes. Every trip includes one free date change up to 7 days before departure. After that, the airline's change fee applies."],
  ["What does the price include?", "Return flights from New Delhi, your stay, taxes and fees. Optional extras like activities are shown separately before you pay."],
  ["How do refunds work?", "Cancel within 48 hours of booking for a full refund. After that, refunds follow the fare rules shown at checkout and reach you in 5–7 working days."],
  ["Do you help with visas?", "We send a visa checklist with every booking and can connect you to a visa partner for Schengen and Japan applications."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list" data-reveal>
      {QUESTIONS.map(([q, a], i) => (
        <div key={q} className={`faq-item ${open === i ? "is-open" : ""}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {q}
            <span className="faq-icon" aria-hidden="true" />
          </button>
          <div className="faq-answer">
            <p>{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
