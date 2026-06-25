// tests/legend.test.js — every driver's legend lists their unfair edge AND unique cons.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legendFor } from '../src/legend.js';
import { CHARACTERS, getCharacter } from '../src/characters.js';
import { render } from '../src/screens/legend.js';

test('every driver in the roster has both perks and cons listed', () => {
  for (const c of CHARACTERS) {
    const { perks, cons } = legendFor(c);
    assert.ok(perks.length >= 1, `${c.id} has at least one unfair advantage`);
    assert.ok(cons.length >= 1, `${c.id} has at least one drawback`);
    assert.ok(perks.every(p => typeof p === 'string' && p.length), `${c.id} perks are strings`);
    assert.ok(cons.every(p => typeof p === 'string' && p.length), `${c.id} cons are strings`);
  }
});

test('the Taxi Man (added late) is fully covered — note, perks, cons, people', () => {
  const { note, perks, cons, people } = legendFor(getCharacter('taximan'));
  assert.ok(note.length, 'has a flavour note');
  assert.ok(perks.some(p => /dexter|handling/i.test(p)), 'his edge is dexterity');
  assert.ok(cons.some(c => /fragile/i.test(c)), 'his con is fragility');
  assert.ok(people.length, 'people-to-watch listed');
});

test("perks/cons reflect each driver's real identity", () => {
  const pol = legendFor(getCharacter('politician'));
  assert.ok(pol.perks.some(p => /never debt|reserves/i.test(p)), 'politician never goes into debt');
  assert.ok(pol.cons.some(c => /pothole|manhole/i.test(c)), 'but potholes/manholes wreck him');
  assert.ok(!/\$5000\b/.test(pol.note), 'note is not the stale "$5000" line');

  const rasta = legendFor(getCharacter('rasta'));
  assert.ok(rasta.cons.some(c => /police|babylon/i.test(c)), 'Babylon troubles the Rasta most');
});

test('legend screen renders for all drivers without throwing (stub canvas)', () => {
  // recursive no-op proxy stands in for a 2D context
  const ctx = new Proxy({}, { get: () => () => ctx });
  for (const c of CHARACTERS) {
    assert.doesNotThrow(() => render(ctx, { characterId: c.id, W: 960, H: 540 }),
      `legend renders for ${c.id}`);
  }
});
