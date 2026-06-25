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
test('roster: yute, rasta, conductor, taxi man, and the unlock-only politician', () => {
  const ids = CHARACTERS.map(c => c.id);
  assert.deepEqual(ids, ['yute', 'rasta', 'conductor', 'politician', 'taximan']);
  // the elite drivers are locked behind progression
  for (const id of ['conductor', 'politician', 'taximan']) {
    assert.equal(getCharacter(id).locked, true, `${id} is locked`);
  }
});
test('conductor is the reckless archetype: fastest, sluggish-handling, fragile', () => {
  const c = getCharacter('conductor');
  assert.ok(c.topSpeed >= Math.max(...CHARACTERS.map(x => x.topSpeed)), 'fastest');
  assert.ok(c.handling <= Math.min(...CHARACTERS.map(x => x.handling)), 'loosest steering');
  assert.ok(c.toughness < 1, 'fragile');
  assert.ok(c.scoreMult > 1);
});
test('the Taxi Man is the most dexterous swerver, but reckless & fragile', () => {
  const t = getCharacter('taximan');
  assert.ok(t.handling >= Math.max(...CHARACTERS.map(x => x.handling)), 'highest handling — most dexterous');
  assert.ok(t.toughness <= Math.min(...CHARACTERS.map(x => x.toughness)), 'most fragile');
  assert.ok(t.sway >= Math.max(...CHARACTERS.map(x => x.sway)), 'loosest/most reckless ride');
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
