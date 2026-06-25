import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS, getCharacter } from '../src/characters.js';
import { STAGES, getStage } from '../src/stages.js';

test('every character has the required stat fields', () => {
  for (const c of CHARACTERS) {
    for (const k of ['id', 'name', 'topSpeed', 'handling', 'toughness', 'coinDraw', 'scoreMult', 'locked']) {
      assert.ok(k in c, `character ${c.id} missing ${k}`);
    }
  }
});
test('MVP ships exactly 3 characters incl. yute, rasta, conductor', () => {
  const ids = CHARACTERS.map(c => c.id);
  assert.deepEqual(ids, ['yute', 'rasta', 'conductor']);
});
test('conductor is the reckless archetype: fastest, loosest, most fragile', () => {
  const c = getCharacter('conductor');
  assert.ok(c.topSpeed >= Math.max(...CHARACTERS.map(x => x.topSpeed)));
  assert.ok(c.handling <= Math.min(...CHARACTERS.map(x => x.handling)));
  assert.ok(c.toughness <= Math.min(...CHARACTERS.map(x => x.toughness)));
  assert.ok(c.scoreMult > 1);
});
test('every stage has required fields and a 3-lane hazard weight table', () => {
  for (const s of STAGES) {
    for (const k of ['id', 'name', 'palette', 'hazardWeights', 'musicId', 'locked']) {
      assert.ok(k in s, `stage ${s.id} missing ${k}`);
    }
    assert.ok(s.hazardWeights.length > 0);
    for (const w of s.hazardWeights) assert.ok('type' in w && 'weight' in w);
  }
});
test('stage list incl. New Kingston; fern-gully unlocked by default', () => {
  assert.deepEqual(STAGES.map(s => s.id), ['fern-gully', 'holland-bamboo', 'negril', 'new-kingston']);
  assert.equal(getStage('fern-gully').locked, false);
});
test('JUTC buses run only in Kingston', () => {
  for (const s of STAGES) {
    const hasBus = s.hazardWeights.some(w => w.type === 'bus');
    if (s.id === 'new-kingston') assert.ok(hasBus, 'Kingston should have buses');
    else assert.ok(!hasBus, `${s.id} should not have JUTC buses`);
  }
});
