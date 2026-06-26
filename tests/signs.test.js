// tests/signs.test.js — roadside signage cadence + billboard variety. Guards the bug where
// a residue-keyed message index froze every billboard on one message (the fatality figure
// never showed), and that signs stay sparse, not crowding the drive.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roadsideFeature, SAFETY_MESSAGES } from '../src/signs.js';

test('billboards cycle through ALL safety messages (incl. the fatality figure)', () => {
  const seen = new Set();
  for (let r = 0; r < 4000; r++) {
    const f = roadsideFeature(r, 50);
    if (f && f.kind === 'billboard') seen.add(f.idx);
  }
  assert.equal(seen.size, SAFETY_MESSAGES.length, `all ${SAFETY_MESSAGES.length} messages appear, got ${[...seen].sort()}`);
  assert.ok(seen.has(0), 'the 373-killed fatality figure (index 0) actually shows');
});

test('signage is sparse — most rows are the stage prop, not a sign', () => {
  let features = 0;
  const rows = 3600;
  for (let r = 0; r < rows; r++) if (roadsideFeature(r, 50)) features++;
  // ~2 features per 18 rows ⇒ ~11%; assert comfortably under a quarter of rows.
  assert.ok(features / rows < 0.2, `signs on ${(100 * features / rows).toFixed(1)}% of rows — should be sparse`);
});

test('both a speed sign and a billboard occur within a single cadence period', () => {
  const kinds = new Set();
  for (let r = 0; r < 18; r++) { const f = roadsideFeature(r, 50); if (f) kinds.add(f.kind); }
  assert.ok(kinds.has('speed') && kinds.has('billboard'), 'both sign kinds appear');
});
