// Booked trips live in this browser only; there is no backend yet.
const KEY = "tripkite:trips";

export function loadTrips() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveTrip(trip) {
  try {
    localStorage.setItem(KEY, JSON.stringify([trip, ...loadTrips()]));
  } catch {
    // Storage blocked (private mode); the confirmation still shows on screen
  }
}

export function removeTrip(ref) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loadTrips().filter((t) => t.ref !== ref)));
  } catch {}
}

export function makeRef() {
  const letters = "ABCDEFHJKLMNPRSTUVWXYZ";
  const pick = () => letters[Math.floor(Math.random() * letters.length)];
  return {
    ref: `TK${pick()}${pick()}${Math.floor(1000 + Math.random() * 9000)}`,
    seat: `${Math.floor(4 + Math.random() * 28)}${"ACDF"[Math.floor(Math.random() * 4)]}`,
    gate: `${pick()}${Math.floor(1 + Math.random() * 30)}`,
  };
}

export const iso = (d) => d.toISOString().slice(0, 10);

export const addDays = (days, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
};

export const prettyDate = (s) =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
