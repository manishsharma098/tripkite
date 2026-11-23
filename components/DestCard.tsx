"use client";

import Image from "next/image";
import Link from "next/link";
import { formatINR, photo } from "@/lib/data";
import { useBooking } from "./BookingProvider";

export default function DestCard({ d, i = 0, badge = null }) {
  const { openBooking } = useBooking();
  return (
    <article className="dcard" data-cursor="View" data-tilt style={{ "--i": i, "--tint": d.tint }}>
      <Link href={`/destinations/${d.id}`} className="dcard-img">
        <Image src={photo(d.img, 700)} alt={`${d.city}, ${d.country}`} fill sizes="(max-width: 700px) 100vw, 33vw" />
        <span className="dcard-type">{badge || d.type}</span>
      </Link>
      <div className="dcard-body">
        <div>
          <h3><Link href={`/destinations/${d.id}`}>{d.city}</Link></h3>
          <p>{d.note}</p>
        </div>
        <div className="dcard-foot">
          <span>
            <small>{d.nights} nights from</small>
            <b>{formatINR(d.price)}</b>
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => openBooking(d)}>
            Book
          </button>
        </div>
      </div>
    </article>
  );
}
