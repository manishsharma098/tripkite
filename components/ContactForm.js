"use client";

import { useState } from "react";

const TOPICS = ["Planning a new trip", "Change an existing booking", "Cancellations and refunds", "Something else"];

export default function ContactForm() {
  const [sent, setSent] = useState(null);

  if (sent) {
    return (
      <div className="ck-card ck-sent" role="status">
        <svg viewBox="0 0 52 52" width="64" height="64" aria-hidden="true" className="tick">
          <circle cx="26" cy="26" r="24" fill="none" stroke="var(--mint)" strokeWidth="3" />
          <path d="M15 27l7 7 15-15" fill="none" stroke="var(--mint)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Message sent</h3>
        <p>Thanks, {sent}. We&apos;ll reply by email within four hours.</p>
        <button className="btn btn-ghost" onClick={() => setSent(null)}>Send another message</button>
      </div>
    );
  }

  return (
    <form
      className="ck-card"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(new FormData(e.currentTarget).get("name").split(" ")[0]);
      }}
    >
      <div className="field-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Topic</span>
          <select name="topic" className="select">
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Booking reference (optional)</span>
          <input name="ref" placeholder="TKAB1234" />
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn btn-glow btn-block" type="submit">Send message</button>
    </form>
  );
}
