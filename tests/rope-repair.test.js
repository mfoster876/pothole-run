// tests/rope-repair.test.js — the river's repair pickup is ROPE LASHING, not a spanner:
// a bamboo raft is re-lashed, not wrenched. The rope reuses the tools power-up (same
// heal + steady window), lives only in the river spawn pool, and the road keeps its
// hardware tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hazardInfo } from '../src/hazardTypes.js';
import { STAGES } from '../src/stages.js';
import { legendFor } from '../src/legend.js';
import { CHARACTERS } from '../src/characters.js';

test('rope lashing is a collectible that heals exactly like hardware tools', () => {
  const rope = hazardInfo('rope');
  assert.equal(rope.collectible, true);
  assert.equal(rope.damage, 0);
  assert.equal(rope.powerup, 'tools', 'same repair power-up under the hood');
  assert.equal(rope.label, 'rope lashing');
});

test('river stages carry rope (never tools); road stages carry tools (never rope)', () => {
  for (const stage of STAGES) {
    const types = stage.hazardWeights.map(w => w.type);
    if (stage.river) {
      assert.ok(types.includes('rope'), `${stage.id} should offer rope lashing`);
      assert.ok(!types.includes('tools'), `${stage.id} should not float a spanner`);
    } else {
      assert.ok(types.includes('tools'), `${stage.id} should offer hardware tools`);
      assert.ok(!types.includes('rope'), `${stage.id} has no raft to lash`);
    }
  }
});

test('the legend tells every driver about the river rope', () => {
  const legend = legendFor(CHARACTERS[0]);
  const good = JSON.stringify(legend);
  assert.ok(good.includes('"rope"'), 'rope entry present in the legend');
});
