import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SplitText from "@/components/SplitText";
import { photo, team } from "@/lib/data";

export const metadata = { title: "About" };

const values = [
  { title: "Prices that don't move on you", text: "The number on the search page is the number you pay. Taxes and fees are in it from the start.", color: "var(--pink)" },
  { title: "Time to decide", text: "Every fare can be held free for 48 hours, so you can check with the people you're travelling with.", color: "var(--blue)" },
  { title: "A person when you need one", text: "Our traveller care team answers on WhatsApp around the clock, including from the airport.", color: "var(--mint)" },
];

const milestones = [
  ["2019", "Started in a Delhi co-working space with three routes and a spreadsheet."],
  ["2021", "First 10,000 travellers, most of them coming back for a second trip."],
  ["2023", "Launched the free 48-hour fare hold. It's now used on half of all bookings."],
  ["2025", "Ten destinations, 40 partner hotels and a team of 60."],
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        img="1501785888041-af3ef285b470"
        title="We make the first step the easy one"
        sub="Tripkite is a small team in New Delhi building the booking site we always wanted to use."
        crumbs={[["About"]]}
      />

      <section className="about-intro">
        <p className="statement" data-reveal>
          <SplitText>Most people don't skip a trip because of the price. They skip it because planning it feels like a second job. We take that job off your hands.</SplitText>
        </p>
      </section>

      <section className="values">
        {values.map((v, i) => (
          <article key={v.title} className="value" style={{ "--c": v.color, "--i": i }} data-reveal data-tilt>
            <span className="value-shape" aria-hidden="true" />
            <h2>{v.title}</h2>
            <p>{v.text}</p>
          </article>
        ))}
      </section>

      <section className="milestones">
        <h2 className="display small" data-reveal><SplitText>How we got here</SplitText></h2>
        <ol className="milestone-list" data-reveal>
          {milestones.map(([year, text], i) => (
            <li key={year} style={{ "--i": i }}>
              <b>{year}</b>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="team" id="team">
        <h2 className="display small" data-reveal><SplitText>The people behind it</SplitText></h2>
        <div className="team-grid">
          {team.map((p, i) => (
            <article key={p.name} className="member" style={{ "--i": i }} data-reveal>
              <div className="member-img">
                <Image src={photo(p.img, 600)} alt={p.name} fill sizes="(max-width: 700px) 100vw, 33vw" />
              </div>
              <h3>{p.name}</h3>
              <p>{p.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <h2>Ready when you are</h2>
        <div>
          <Link href="/destinations" className="btn btn-white" data-magnetic>Browse destinations</Link>
          <Link href="/contact" className="btn btn-dark">Talk to us</Link>
        </div>
      </section>
    </main>
  );
}
