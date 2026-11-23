import Image from "next/image";
import Link from "next/link";
import { photo } from "@/lib/data";

// Rounded photo banner used at the top of every inner page
export default function PageHero({ img, title, sub, crumbs = [], children, size = "md" }) {
  return (
    <section className={`page-hero page-hero-${size}`}>
      <div className="page-hero-frame">
        {img && <Image src={photo(img, 2000)} alt="" fill sizes="100vw" priority />}
        <div className="page-hero-shade" />
        <div className="page-hero-body">
          {crumbs.length > 0 && (
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              {crumbs.map(([label, href]) =>
                href ? <Link key={label} href={href}>{label}</Link> : <span key={label} aria-current="page">{label}</span>
              )}
            </nav>
          )}
          <h1 className="page-title" aria-label={title}>
            {title.split(" ").map((word, i) => (
              <span className="w" key={i} aria-hidden="true">
                <span style={{ "--wi": i }}>{word}</span>{" "}
              </span>
            ))}
          </h1>
          {sub && <p className="page-sub">{sub}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
