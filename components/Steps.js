import SplitText from "./SplitText";

const steps = [
  {
    title: "Pick a place",
    text: "Search by city or by mood. Every price you see already includes taxes.",
    color: "var(--sky)",
  },
  {
    title: "Hold the fare",
    text: "Lock today's price free for 48 hours while you check with the group chat.",
    color: "var(--coral)",
  },
  {
    title: "Pack your bag",
    text: "Pay when you're ready. Your boarding pass and hotel voucher land in your inbox.",
    color: "var(--lagoon)",
  },
];

export default function Steps() {
  return (
    <section className="steps" id="how">
      <h2 className="display" data-reveal><SplitText>Booked in three stops</SplitText></h2>
      <ol className="steps-track" data-reveal>
        <svg className="steps-line" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M40 80 C 220 -10, 380 140, 500 60 S 800 -10, 960 70" fill="none" stroke="var(--ink)" strokeOpacity=".25" strokeWidth="2.5" strokeDasharray="3 10" strokeLinecap="round" />
        </svg>
        {steps.map((s, i) => (
          <li key={s.title} style={{ "--c": s.color }}>
            <span className="steps-num">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
