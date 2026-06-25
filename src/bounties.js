// src/bounties.js
// Three active missions at a time. Each tracks progress toward a goal; completing one
// banks a reward and gets replaced by a fresh draw. Events: {kind, amount}.
export const BOUNTY_DEFS = [
  { id: 'bank',   kind: 'bank',  goal: 3000, reward: 1500, label: 'Bank $3,000 this run' },
  { id: 'dodge',  kind: 'dodge', goal: 12,   reward: 1200, label: 'Dodge 12 hazards' },
  { id: 'far',    kind: 'dist',  goal: 1500, reward: 1800, label: 'Reach 1,500m' },
  { id: 'taxis',  kind: 'taxi',  goal: 8,    reward: 1400, label: 'Slip past 8 taxis' },
  { id: 'combo',  kind: 'combo', goal: 5,    reward: 2000, label: 'Hit a x5 near-miss combo' },
  { id: 'coffee', kind: 'coffee',goal: 1,    reward: 5000, label: 'Catch a bag of Blue Mountain' }
];
function makeActive(def) { return { defId: def.id, kind: def.kind, goal: def.goal, progress: 0, done: false }; }
export function rollBounties(rng, n = 3, exclude = []) {
  const pool = BOUNTY_DEFS.filter(d => !exclude.includes(d.id));
  const picks = [];
  const avail = pool.slice();
  while (picks.length < n && avail.length) {
    const i = Math.floor(rng() * avail.length);
    picks.push(makeActive(avail.splice(i, 1)[0]));
  }
  return picks;
}
export function progressBounties(active, event) {
  const completed = [];
  for (const a of active) {
    if (a.done || a.kind !== event.kind) continue;
    a.progress += event.amount;
    if (a.progress >= a.goal) { a.done = true; completed.push(a.defId); }
  }
  return completed;
}
export function refresh(active, rng) {
  const keep = active.filter(a => !a.done).map(a => a.defId);
  for (let i = 0; i < active.length; i++) {
    if (active[i].done) {
      const repl = rollBounties(rng, 1, [...keep, ...active.map(a => a.defId)]);
      if (repl.length) active[i] = repl[0];
    }
  }
  return active;
}
