import { byId, byOrigin } from "@/lib/data";
import { prettyDate } from "@/lib/trips";

export default function BoardingPass({ trip }) {
  const d = byId[trip.dest];
  const from = byOrigin[trip.from];
  return (
    <div className="pass">
      <div className="pass-main">
        <div className="pass-route">
          <div>
            <strong>{from?.code || "—"}</strong>
            <span>{from?.city || "Departure"}</span>
          </div>
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" className="pass-plane">
            <path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
          <div className="route-to">
            <strong>{d.code}</strong>
            <span>{d.city}</span>
          </div>
        </div>
        <dl className="pass-grid">
          <div><dt>Passenger</dt><dd>{trip.name}</dd></div>
          <div><dt>Date</dt><dd>{prettyDate(trip.depart)}</dd></div>
          <div><dt>Flight</dt><dd>{trip.flightNo}</dd></div>
          <div><dt>Seat</dt><dd>{trip.seat}</dd></div>
          <div><dt>Gate</dt><dd>{trip.gate}</dd></div>
          <div><dt>Cabin</dt><dd>{trip.cabinLabel}</dd></div>
        </dl>
      </div>
      <div className="pass-stub">
        <span>Booking ref</span>
        <strong>{trip.ref}</strong>
        <div className="barcode" aria-hidden="true" />
      </div>
    </div>
  );
}
