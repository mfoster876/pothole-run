// Money you scoop off the road. Bills are STRICTLY $100 / $500 / $1000 / $2000 /
// $5000 — nothing in between. The deeper you survive, the bigger the notes that start
// dropping. `from` = distance a denomination begins appearing.
export const BILLS = [100, 500, 1000, 2000, 5000];
export const MONEY = [
  { value: 100,  weight: 6, from: 0,    until: null },
  { value: 500,  weight: 4, from: 400,  until: null },
  { value: 1000, weight: 3, from: 1000, until: null },
  { value: 2000, weight: 2, from: 1800, until: null },
  { value: 5000, weight: 1, from: 2800, until: null }
];

// The Politician deals in RIDICULOUS notes — $20k/$50k/$100k/$500k — fattening with
// distance. (His responsibilities cost just as ridiculously; see negatives.js.)
export const POLI_MONEY = [
  { value: 20000,  weight: 5, from: 0 },
  { value: 50000,  weight: 3, from: 600 },
  { value: 100000, weight: 2, from: 1400 },
  { value: 500000, weight: 1, from: 2400 },
];
export function pickPoliticianMoney(distance, rng) {
  const pool = POLI_MONEY.filter(m => distance >= m.from);
  const live = pool.length ? pool : [POLI_MONEY[0]];
  const total = live.reduce((s, m) => s + m.weight, 0);
  let r = rng() * total;
  for (const m of live) { r -= m.weight; if (r < 0) return m.value; }
  return live[live.length - 1].value;
}

// Pick a denomination appropriate to how far you've travelled.
export function pickMoney(distance, rng) {
  const pool = MONEY.filter(m => distance >= m.from && (m.until == null || distance < m.until));
  const live = pool.length ? pool : [MONEY[0]];
  const total = live.reduce((s, m) => s + m.weight, 0);
  let r = rng() * total;
  for (const m of live) { r -= m.weight; if (r < 0) return m.value; }
  return live[live.length - 1].value;
}

// The next bill up from `value` (for fattening notes during a supercharge), staying
// on the strict denomination ladder. Tops out at $5000.
export function nextBill(value) {
  const i = BILLS.indexOf(value);
  if (i === -1) return BILLS[0];
  return BILLS[Math.min(i + 1, BILLS.length - 1)];
}

// Shift a note up `steps` rungs of the strict bill ladder (reckless drivers see
// fatter — but rarer — notes). Stays on the ladder; never produces an off-ladder value.
export function biasBill(value, steps) {
  let v = value;
  for (let i = 0; i < (steps || 0); i++) v = nextBill(v);
  return v;
}

// $1,234,567 — thousands separators, for the now-large sums.
export function formatMoney(n) {
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
