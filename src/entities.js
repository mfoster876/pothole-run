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
  return e;
}
export function advance(field, dz) {
  for (const e of field.pool) {
    if (!e.active) continue;
    e.z -= dz;
    if (e.z < -e.depth - 2) e.active = false;
  }
}
export function activeEntities(field) {
  return field.pool.filter(e => e.active);
}
