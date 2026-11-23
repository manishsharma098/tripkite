import { reviews } from "@/lib/data";
import SplitText from "./SplitText";

const tilts = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2];

export default function Reviews() {
  // Duplicated once so the marquee can loop seamlessly
  const loop = [...reviews, ...reviews];
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="section-head">
        <h2 className="display" data-reveal id="reviews-title"><SplitText>Postcards from people who went</SplitText></h2>
        <p className="section-sub" data-reveal>4.8 out of 5 from 12,400 verified trips</p>
      </div>
      <div className="marquee">
        <ul className="marquee-track">
          {loop.map((r, i) => (
            <li
              key={i}
              className="review"
              style={{ "--tilt": `${tilts[i % tilts.length]}deg` }}
              aria-hidden={i >= reviews.length}
            >
              <div className="review-stamp">
                <span>{r.stamp}</span>
              </div>
              <blockquote>{r.text}</blockquote>
              <footer>
                <strong>{r.name}</strong>
                <span>back from {r.from}</span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
