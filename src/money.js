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

// $1,234,567 — thousands separators, for the now-large sums.
export function formatMoney(n) {
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
