import Link from "next/link";
import SplitText from "./SplitText";

const cols = [
  ["Book", [["Destinations", "/destinations"], ["Search flights", "/search"], ["Deals", "/deals"], ["My trips", "/trips"]]],
  ["Help", [["Contact us", "/contact"], ["Manage booking", "/trips"], ["FAQs", "/contact#faq"], ["Refunds", "/contact#faq"]]],
  ["Company", [["About", "/about"], ["Our team", "/about#team"], ["How it works", "/#how"], ["Experiences", "/#experiences"]]],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-lead split-host" data-reveal><SplitText>Somewhere new is closer than it looks.</SplitText></p>
          <Link href="/search" className="btn btn-glow" data-magnetic>Start planning</Link>
        </div>
        {cols.map(([title, items]) => (
          <div key={title} className="footer-col">
            <h3>{title}</h3>
            <ul>
              {items.map(([label, href]) => (
                <li key={label}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="footer-word" aria-hidden="true" data-reveal>
        {"tripkite".split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>{ch}</span>
        ))}
      </p>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Tripkite Travel Pvt. Ltd. Based in New Delhi.</span>
        <span>
          <Link href="/about">Privacy</Link>
          <Link href="/about">Terms</Link>
          <Link href="/contact">Support</Link>
        </span>
      </div>
    </footer>
  );
}
