import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import DestCard from "@/components/DestCard";
import SplitText from "@/components/SplitText";
import { BookPanel, StayCards } from "@/components/DestinationActions";
import { byId, crops, destinations, flightsFor, formatHours, formatINR, itinerary, photo } from "@/lib/data";

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = byId[id];
  return d ? { title: `${d.city}, ${d.country}`, description: d.note } : {};
}

export default async function DestinationPage({ params }) {
  const { id } = await params;
  const d = byId[id];
  if (!d) notFound();

  const flights = flightsFor(d).sort((a, b) => a.price - b.price).slice(0, 3);
  const similar = [
    ...destinations.filter((x) => x.type === d.type && x.id !== d.id),
    ...destinations.filter((x) => x.type !== d.type),
  ].slice(0, 3);

  const facts = [
    ["Flight time", formatHours(d.flight)],
    ["Best time", d.best],
    ["Currency", d.currency],
    ["Visa", d.visa],
  ];

  return (
    <main>
      <PageHero
        img={d.img}
        title={d.city}
        sub={`${d.note}. ${d.country}.`}
        size="lg"
        crumbs={[["Destinations", "/destinations"], [d.city]]}
      >
        <dl className="facts">
          {facts.map(([k, v], i) => (
            <div key={k} style={{ "--i": i }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <div className="detail">
        <div className="detail-main">
          <section className="detail-block">
            <h2 className="display small" data-reveal>
              <SplitText>{`Why ${d.city} is worth the flight`}</SplitText>
            </h2>
            <ul className="highlights" data-reveal>
              {d.highlights.map((h, i) => (
                <li key={h} style={{ "--i": i }}>
                  <span className="highlight-dot" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <div className="mosaic" data-reveal>
            {crops.map((c, i) => (
              <div key={i} className={`mosaic-${i}`}>
                <Image src={photo(d.img, 900, c)} alt={`${d.city} detail ${i + 1}`} fill sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
            ))}
          </div>

          <section className="detail-block">
            <h2 className="display small" data-reveal>
              <SplitText>{`${d.nights + 1} days, planned`}</SplitText>
            </h2>
            <ol className="timeline" data-reveal>
              {itinerary(d).map((day, i) => (
                <li key={i} style={{ "--i": i }}>
                  <span className="timeline-day">Day {i + 1}</span>
                  <div>
                    <h3>{day.title}</h3>
                    <p>{day.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="detail-block">
            <h2 className="display small" data-reveal>
              <SplitText>Pick where you stay</SplitText>
            </h2>
            <StayCards id={d.id} />
          </section>

          <section className="detail-block">
            <div className="section-head">
              <h2 className="display small" data-reveal>
                <SplitText>Cheapest flights right now</SplitText>
              </h2>
              <Link href={`/search?to=${d.id}`} className="link-arrow">All flights</Link>
            </div>
            <div className="flight-list" data-reveal>
              {flights.map((f) => (
                <div key={f.id} className="flight-row compact">
                  <div className="flight-airline">
                    <b>{f.airline}</b>
                    <small>{f.number}</small>
                  </div>
                  <div className="flight-times">
                    <b>{f.depart}</b>
                    <span className="flight-line">
                      <small>{formatHours(f.hours)} · {f.stops ? `${f.stops} stop${f.stops > 1 ? "s" : ""}` : "Direct"}</small>
                    </span>
                    <b>{f.arrive}</b>
                  </div>
                  <b className="flight-price">{formatINR(f.price)}</b>
                </div>
              ))}
            </div>
          </section>
        </div>

        <BookPanel id={d.id} />
      </div>

      <section className="similar">
        <h2 className="display small" data-reveal>
          <SplitText>You might also like</SplitText>
        </h2>
        <div className="grid">
          {similar.map((x, i) => (
            <DestCard key={x.id} d={x} i={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
