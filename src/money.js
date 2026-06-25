// Money you scoop off the road. Early on it's loose coin ($1–$20); the deeper you
// survive, the bigger the denominations get — paper money ($100/$500/$1000) and the
// rare, coveted $5000 note — while the small coins stop appearing. `from` = distance
// a denomination starts dropping; `until` = distance the small ones dry up.
export const MONEY = [
  { value: 1,    weight: 5, from: 0,    until: 1200 },
  { value: 5,    weight: 5, from: 0,    until: 1800 },
  { value: 10,   weight: 5, from: 0,    until: 2400 },
  { value: 20,   weight: 5, from: 150,  until: 3200 },
  { value: 100,  weight: 4, from: 550,  until: null },
  { value: 500,  weight: 3, from: 1000, until: null },
  { value: 1000, weight: 2, from: 1600, until: null },
  { value: 5000, weight: 1, from: 2400, until: null }
];

// Pick a denomination appropriate to how far you've travelled.
export function pickMoney(distance, rng) {
  const pool = MONEY.filter(m => distance >= m.from && (m.until == null || distance < m.until));
  const live = pool.length ? pool : [MONEY[0]];
  const total = live.reduce((s, m) => s + m.weight, 0);
  let r = rng() * total;
  for (const m of live) { r -= m.weight; if (r < 0) return m.value; }
  return live[live.length - 1].value;
}

// $1,234,567 — thousands separators, for the now-large sums.
export function formatMoney(n) {
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
