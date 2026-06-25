import { LANES, ENTITY_HALF_WIDTH } from './constants.js';
import { hazardInfo } from './hazardTypes.js';

export function createField() {
  return { pool: [] };
}
export function spawn(field, type, laneIndex, z) {
  const info = hazardInfo(type);
  let e = field.pool.find(p => !p.active);
  if (!e) { e = {}; field.pool.push(e); }
  e.active = true;
  e.type = type;
  e.x = LANES[laneIndex];
  e.z = z;
  e.depth = info.depth;
  e.halfWidth = ENTITY_HALF_WIDTH;
  e.collected = false;
  e.seed = Math.random();        // stable per-spawn shape seed (craters, slicks)
  e.vz = info.vz || 0;           // extra closing speed (overtaking traffic)
  e.gust = info.gust || null;    // wake-gust key, or null
  e.value = 0;                   // money denomination, set by the caller for pickups
  return e;
}
export function advance(field, dz, dt = 0) {
  for (const e of field.pool) {
    if (!e.active) continue;
    e.z -= dz + (e.vz || 0) * dt; // traffic closes faster than the world scrolls
    // Retire once well past the cart. The margin must exceed one frame's travel so
    // an entity is never retired in the same frame it crosses the cart plane (which
    // would let it slip past resolveHits unseen).
    if (e.z < -40) e.active = false;
  }
}
export function activeEntities(field) {
  return field.pool.filter(e => e.active);
}
