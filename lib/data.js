export const photo = (id, w = 1200, focus) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80` +
  (focus ? `&h=${Math.round(w * focus.ratio)}&crop=focalpoint&fp-x=${focus.x}&fp-y=${focus.y}&fp-z=${focus.z}` : "");

export const ORIGIN = { city: "New Delhi", code: "DEL" };

export const destinations = [
  {
    id: "kyoto",
    city: "Kyoto",
    country: "Japan",
    code: "KIX",
    img: "1493976040374-85c8e12f0c0e",
    price: 58900,
    nights: 6,
    type: "City",
    note: "Lantern-lit lanes and quiet temple mornings",
    tint: "#ff2e93",
  },
  {
    id: "santorini",
    city: "Santorini",
    country: "Greece",
    code: "JTR",
    img: "1570077188670-e3a8d69ac5ff",
    price: 64200,
    nights: 5,
    type: "Beach",
    note: "Whitewashed cliffs above a caldera sunset",
    tint: "#8b5cf6",
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    code: "DPS",
    img: "1537996194471-e657df975ab4",
    price: 38400,
    nights: 7,
    type: "Beach",
    note: "Rice terraces, surf breaks and slow villa days",
    tint: "#0891b2",
  },
  {
    id: "manarola",
    city: "Cinque Terre",
    country: "Italy",
    code: "GOA",
    img: "1516483638261-f4dbaf036963",
    price: 61500,
    nights: 5,
    type: "Beach",
    note: "Five painted villages stitched by a cliff path",
    tint: "#141414",
  },
  {
    id: "dolomites",
    city: "Dolomites",
    country: "Italy",
    code: "VCE",
    img: "1501785888041-af3ef285b470",
    price: 57800,
    nights: 6,
    type: "Nature",
    note: "Emerald lakes under jagged limestone peaks",
    tint: "#0891b2",
  },
  {
    id: "halong",
    city: "Ha Long Bay",
    country: "Vietnam",
    code: "HAN",
    img: "1528127269322-539801943592",
    price: 29900,
    nights: 4,
    type: "Nature",
    note: "Overnight junk cruise through 1,600 islets",
    tint: "#8b5cf6",
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    code: "CDG",
    img: "1499856871958-5b9627545d1a",
    price: 54300,
    nights: 5,
    type: "City",
    note: "Gilded bridges, late dinners, river walks",
    tint: "#ff2e93",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    img: "1512453979798-5ea266f8880c",
    price: 18900,
    nights: 4,
    type: "City",
    note: "Skyline dinners and a dune drive at dusk",
    tint: "#141414",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    img: "1540959733332-eab4deabeeaf",
    price: 62700,
    nights: 6,
    type: "City",
    note: "Neon crossings and twelve-seat ramen bars",
    tint: "#ff2e93",
  },
  {
    id: "langkawi",
    city: "Langkawi",
    country: "Malaysia",
    code: "LGK",
    img: "1506929562872-bb421503ef21",
    price: 24600,
    nights: 5,
    type: "Beach",
    note: "Turquoise coves you reach by longtail boat",
    tint: "#0891b2",
  },
];

export const byId = Object.fromEntries(destinations.map((d) => [d.id, d]));

export const reviews = [
  { name: "Ananya R.", from: "Kyoto", text: "Booked at midnight, boarding pass in my inbox before I brushed my teeth. The price hold saved me ₹9,000.", stamp: "KIX" },
  { name: "Marcus T.", from: "Santorini", text: "The fare-drop alert pinged on a Tuesday. We were watching the caldera sunset by Friday.", stamp: "JTR" },
  { name: "Priya & Dev", from: "Bali", text: "Honeymoon sorted in one sitting: flights, villa, the airport pickup. Zero tabs open.", stamp: "DPS" },
  { name: "Lena K.", from: "Dolomites", text: "Changed our dates twice and nobody charged us for it. That alone earned a review.", stamp: "VCE" },
  { name: "Rohit S.", from: "Dubai", text: "Weekend escape for under twenty grand, and the hotel was better than the photos.", stamp: "DXB" },
  { name: "Sofia M.", from: "Ha Long Bay", text: "The overnight cruise was the highlight of our whole year. Packing list was spot on.", stamp: "HAN" },
];

export const formatINR = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const experiences = [
  { id: "beach", title: "Beach escapes", text: "Overwater villas, reef snorkelling and sunsets on repeat.", img: "1506929562872-bb421503ef21", dest: "langkawi", count: 4 },
  { id: "city", title: "City breaks", text: "Rooftop bars, night markets and a new neighbourhood every day.", img: "1540959733332-eab4deabeeaf", dest: "tokyo", count: 4 },
  { id: "mountain", title: "Mountain air", text: "Glass-clear lakes and huts at the end of a long ridge walk.", img: "1501785888041-af3ef285b470", dest: "dolomites", count: 1 },
  { id: "islands", title: "Island hopping", text: "Limestone bays, longtail boats and nights on the water.", img: "1528127269322-539801943592", dest: "halong", count: 2 },
  { id: "coast", title: "Coast towns", text: "Painted villages, cliff paths and long lunches by the sea.", img: "1516483638261-f4dbaf036963", dest: "manarola", count: 2 },
];

/* ---------- Destination details ---------- */
const details = {
  kyoto: { flight: 9.5, best: "Mar–May, Oct–Nov", currency: "Japanese yen", visa: "e-Visa, 5 working days", highlights: ["Sunrise at Fushimi Inari before the crowds", "Tea ceremony in a Gion machiya", "Arashiyama bamboo grove by bike", "Kaiseki dinner along the Kamo river"] },
  santorini: { flight: 8, best: "May–Oct", currency: "Euro", visa: "Schengen visa", highlights: ["Catamaran cruise round the caldera", "Sunset from the Oia castle ruins", "Wine tasting at a cliffside winery", "Black-sand afternoon at Perissa"] },
  bali: { flight: 7, best: "Apr–Oct", currency: "Indonesian rupiah", visa: "Visa on arrival", highlights: ["Tegallalang rice terraces at first light", "Surf lesson on the Canggu breaks", "Uluwatu temple and kecak fire dance", "Private villa with a jungle pool"] },
  manarola: { flight: 10, best: "May–Sep", currency: "Euro", visa: "Schengen visa", highlights: ["Hike the Sentiero Azzurro between villages", "Pesto-making class in Vernazza", "Boat hop to Portovenere", "Aperitivo on the Manarola rocks"] },
  dolomites: { flight: 10.5, best: "Jun–Sep, Dec–Mar", currency: "Euro", visa: "Schengen visa", highlights: ["Rowboat on Lago di Braies", "Tre Cime di Lavaredo loop walk", "Cable car up to Seceda ridge", "Mountain-hut lunch with strudel"] },
  halong: { flight: 5.5, best: "Oct–Apr", currency: "Vietnamese dong", visa: "e-Visa, 3 working days", highlights: ["Overnight junk cruise in Lan Ha Bay", "Kayak through hidden lagoons", "Sung Sot cave at dawn", "Street-food walk in Hanoi's Old Quarter"] },
  paris: { flight: 9, best: "Apr–Jun, Sep–Oct", currency: "Euro", visa: "Schengen visa", highlights: ["Seine evening cruise past Pont Alexandre III", "Early entry at the Musée d'Orsay", "Bakery crawl in Le Marais", "Day trip to Versailles gardens"] },
  dubai: { flight: 3.5, best: "Nov–Mar", currency: "UAE dirham", visa: "e-Visa, 48 hours", highlights: ["Dune drive and dinner under the stars", "Sky deck at the Burj Khalifa", "Abra ride across Dubai Creek", "Beach club day at JBR"] },
  tokyo: { flight: 8, best: "Mar–May, Oct–Nov", currency: "Japanese yen", visa: "e-Visa, 5 working days", highlights: ["Tsukiji outer market breakfast", "Shibuya crossing from a rooftop", "Day out to Mt Fuji and Hakone", "Late-night izakaya alleys in Shinjuku"] },
  langkawi: { flight: 6, best: "Nov–Apr", currency: "Malaysian ringgit", visa: "Visa-free, 30 days", highlights: ["Island hopping by longtail boat", "SkyBridge walk above the rainforest", "Mangrove kayak with eagle spotting", "Sunset dinner on Cenang beach"] },
};

destinations.forEach((d) => Object.assign(d, details[d.id]));

export const formatHours = (h) => `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`;

// Three zoomed crops of the hero photo used as a mosaic on destination pages
export const crops = [
  { ratio: 0.75, x: 0.3, y: 0.55, z: 1.6 },
  { ratio: 1, x: 0.7, y: 0.4, z: 2 },
  { ratio: 1, x: 0.5, y: 0.75, z: 1.8 },
];

export const itinerary = (d) => [
  { title: `Land in ${d.city}`, text: "Airport pickup, check in, and an easy first evening nearby." },
  ...d.highlights.map((h) => ({ title: h, text: "Booked and timed for you, with free time either side." })),
  { title: "Fly home", text: "Late checkout where possible and a transfer back to the airport." },
].slice(0, d.nights + 1);

export const STAYS = [
  { id: "boutique", label: "Boutique stay", factor: 1, perks: ["Breakfast included", "Central location"] },
  { id: "design", label: "Design hotel", factor: 1.25, perks: ["Breakfast and one dinner", "Room with a view", "Late checkout"] },
  { id: "luxury", label: "Luxury resort", factor: 1.6, perks: ["Half board", "Spa credit", "Private transfers", "Suite upgrade on arrival"] },
];

export const CABINS = [
  { id: "economy", label: "Economy", factor: 1 },
  { id: "premium", label: "Premium", factor: 1.6 },
  { id: "business", label: "Business", factor: 2.8 },
];

/* ---------- Flights (deterministic so server and browser agree) ---------- */
const AIRLINES = ["Kite Air", "Monsoon Airways", "Saffron Jet", "Bluebird", "Orbit Air"];
const DEPARTURES = ["06:10", "09:45", "13:20", "18:05", "23:40"];
const STOPS = [0, 1, 0, 1, 2];
const FARE = [1.12, 0.94, 1, 0.88, 0.8];

export const flightShare = (d) => d.price * 0.45;

export function flightsFor(d) {
  return DEPARTURES.map((dep, i) => {
    const hours = d.flight + STOPS[i] * 1.6 + i * 0.15;
    const [h, m] = dep.split(":").map(Number);
    const arrMins = (h * 60 + m + Math.round(hours * 60) + 150) % 1440;
    return {
      id: `${d.code}${i + 1}`,
      airline: AIRLINES[(i + d.code.charCodeAt(0)) % AIRLINES.length],
      number: `TK ${100 + ((d.code.charCodeAt(1) * 7 + i * 13) % 800)}`,
      depart: dep,
      arrive: `${String(Math.floor(arrMins / 60)).padStart(2, "0")}:${String(arrMins % 60).padStart(2, "0")}`,
      hours,
      stops: STOPS[i],
      price: Math.round(flightShare(d) * FARE[i]),
    };
  });
}

/* ---------- Deals ---------- */
export const deals = [
  { id: "santorini", off: 22, days: 2, title: "Sea-view suite week" },
  { id: "langkawi", off: 20, days: 3, title: "Island hopper" },
  { id: "bali", off: 18, days: 1, title: "Villa and surf" },
  { id: "dubai", off: 15, days: 4, title: "Long weekend" },
  { id: "halong", off: 12, days: 2, title: "Bay cruise escape" },
  { id: "paris", off: 10, days: 5, title: "Spring in the city" },
].map((x) => ({ ...x, dest: byId[x.id], was: Math.round(byId[x.id].price / (1 - x.off / 100)) }));

export const team = [
  { name: "Meera Kapoor", role: "Co-founder, routes", img: "1494790108377-be9c29b29330" },
  { name: "Arjun Malhotra", role: "Co-founder, product", img: "1500648767791-00dcc994a43e" },
  { name: "Sara Iqbal", role: "Head of traveller care", img: "1438761681033-6461ffad8d80" },
];
