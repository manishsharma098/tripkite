"use client";

import { useState } from "react";
import SplitText from "./SplitText";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="signup">
      <div className="signup-inner">
        <h2 className="split-host" data-reveal><SplitText>Get fare drops before everyone else</SplitText></h2>
        <p>One email when a route you care about gets cheaper. Nothing else.</p>
        {done ? (
          <p className="signup-done" role="status">
            You&apos;re on the list. Watch for a message from fares@tripkite.travel.
          </p>
        ) : (
          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <label className="sr-only" htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-dark" type="submit" data-magnetic>Send me fare drops</button>
          </form>
        )}
      </div>
      <div className="signup-kites" aria-hidden="true">
        <span /><span /><span />
      </div>
    </section>
  );
}
