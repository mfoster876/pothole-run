// tests/bounties.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollBounties, progressBounties, refresh, BOUNTY_DEFS } from '../src/bounties.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

test('rollBounties yields 3 distinct active missions', () => {
  const b = rollBounties(mulberry32(1), 3);
  assert.equal(b.length, 3);
  assert.equal(new Set(b.map(x => x.defId)).size, 3);
  assert.ok(b.every(x => x.progress === 0 && !x.done));
});
test('progress accrues and completes; refresh swaps the finished one out', () => {
  const rng = mulberry32(2);
  const b = rollBounties(rng, 3);
  const target = b[0];
  const def = BOUNTY_DEFS.find(d => d.id === target.defId);
  const completed = progressBounties(b, { kind: def.kind, amount: def.goal });
  assert.deepEqual(completed, [target.defId]);
  assert.equal(b[0].done, true);
  refresh(b, rng);
  assert.equal(b.filter(x => x.done).length, 0);
  assert.equal(b.length, 3);
});
