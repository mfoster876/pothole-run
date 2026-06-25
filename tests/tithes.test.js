import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TITHE } from '../src/constants.js';
import {
  OFFERINGS,
  offeringAmount,
  giveTithe,
  blessingEffects,
  decayBlessing,
} from '../src/tithes.js';

// ── offeringAmount ──────────────────────────────────────────────────────────

test('offeringAmount: p10 of 1,000,000 wallet is 100,000', () => {
  const save = { wallet: 1_000_000, blessing: 0 };
  assert.equal(offeringAmount(save, 'p10'), 100_000);
});

test('offeringAmount: mite caps at TITHE.mite when wallet is rich', () => {
  const save = { wallet: 1_000_000, blessing: 0 };
  assert.equal(offeringAmount(save, 'mite'), TITHE.mite);
});

test('offeringAmount: mite caps at wallet when wallet < TITHE.mite', () => {
  const save = { wallet: 500, blessing: 0 };
  assert.equal(offeringAmount(save, 'mite'), 500);
});

test('offeringAmount: never exceeds wallet for any option', () => {
  const save = { wallet: 300, blessing: 0 };
  for (const { id } of OFFERINGS) {
    const amt = offeringAmount(save, id);
    assert.ok(amt <= save.wallet, `${id} amount ${amt} exceeds wallet ${save.wallet}`);
  }
});

test('offeringAmount: p1 and p5 scale correctly with wallet', () => {
  const save = { wallet: 200_000, blessing: 0 };
  assert.equal(offeringAmount(save, 'p1'), 2_000);
  assert.equal(offeringAmount(save, 'p5'), 10_000);
});

test('offeringAmount: returns 0 for empty wallet', () => {
  const save = { wallet: 0, blessing: 0 };
  for (const { id } of OFFERINGS) {
    assert.equal(offeringAmount(save, id), 0);
  }
});

// ── giveTithe ───────────────────────────────────────────────────────────────

test('giveTithe: deducts amount from wallet', () => {
  const save = { wallet: 100_000, blessing: 0 };
  giveTithe(save, 10_000);
  assert.equal(save.wallet, 90_000);
});

test('giveTithe: a full 10% tithe raises blessing by ~TITHE.perGift', () => {
  const save = { wallet: 100_000, blessing: 0 };
  giveTithe(save, 10_000); // exactly 10% of 100,000
  assert.ok(
    Math.abs(save.blessing - TITHE.perGift) < 1e-9,
    `blessing should be ${TITHE.perGift} but got ${save.blessing}`
  );
});

test('giveTithe: a 5% gift raises blessing by half perGift', () => {
  const save = { wallet: 100_000, blessing: 0 };
  giveTithe(save, 5_000); // 5% of 100,000
  assert.ok(
    Math.abs(save.blessing - TITHE.perGift * 0.5) < 1e-9,
    `5% gift should give ${TITHE.perGift * 0.5} blessing, got ${save.blessing}`
  );
});

test('giveTithe: giving more than wallet returns false, changes nothing', () => {
  const save = { wallet: 1_000, blessing: 0.2 };
  const result = giveTithe(save, 2_000);
  assert.equal(result, false);
  assert.equal(save.wallet, 1_000);
  assert.equal(save.blessing, 0.2);
});

test('giveTithe: giving 0 returns false, changes nothing', () => {
  const save = { wallet: 1_000, blessing: 0.1 };
  const result = giveTithe(save, 0);
  assert.equal(result, false);
  assert.equal(save.wallet, 1_000);
  assert.equal(save.blessing, 0.1);
});

test('giveTithe: blessing caps at 1 even with repeated large gifts', () => {
  const save = { wallet: 1_000_000, blessing: 0.9 };
  // Give 10% several times; blessing must never exceed 1.
  for (let i = 0; i < 5; i++) {
    if (save.wallet > 0) giveTithe(save, Math.round(save.wallet * 0.10));
  }
  assert.ok(save.blessing <= 1, `blessing ${save.blessing} exceeded 1`);
});

test('giveTithe: returns true on a valid gift', () => {
  const save = { wallet: 50_000, blessing: 0 };
  assert.equal(giveTithe(save, 5_000), true);
});

test('giveTithe: handles save without pre-existing blessing field', () => {
  const save = { wallet: 100_000 }; // no blessing key
  giveTithe(save, 10_000);
  assert.ok(Number.isFinite(save.blessing));
  assert.ok(save.blessing > 0);
});

// ── blessingEffects ─────────────────────────────────────────────────────────

test('blessingEffects(1) → full resist, invincExtend, startGrace', () => {
  const fx = blessingEffects(1);
  assert.equal(fx.resist,       TITHE.maxResist);   // 0.40
  assert.equal(fx.invincExtend, TITHE.maxExtend);   // 0.50
  assert.equal(fx.startGrace,   TITHE.maxGrace);    // 3
});

test('blessingEffects(0) → all zeros', () => {
  const fx = blessingEffects(0);
  assert.equal(fx.resist, 0);
  assert.equal(fx.invincExtend, 0);
  assert.equal(fx.startGrace, 0);
});

test('blessingEffects(0.5) → half of maxes', () => {
  const fx = blessingEffects(0.5);
  assert.ok(Math.abs(fx.resist - TITHE.maxResist * 0.5) < 1e-9);
  assert.ok(Math.abs(fx.invincExtend - TITHE.maxExtend * 0.5) < 1e-9);
  assert.ok(Math.abs(fx.startGrace - TITHE.maxGrace * 0.5) < 1e-9);
});

test('blessingEffects clamps above 1 down to maxes', () => {
  const fx = blessingEffects(2);
  assert.equal(fx.resist,       TITHE.maxResist);
  assert.equal(fx.invincExtend, TITHE.maxExtend);
  assert.equal(fx.startGrace,   TITHE.maxGrace);
});

test('blessingEffects clamps below 0 to zeros', () => {
  const fx = blessingEffects(-0.5);
  assert.equal(fx.resist, 0);
  assert.equal(fx.invincExtend, 0);
  assert.equal(fx.startGrace, 0);
});

test('blessingEffects returns object with the three expected keys', () => {
  const fx = blessingEffects(0.7);
  assert.ok('resist'       in fx);
  assert.ok('invincExtend' in fx);
  assert.ok('startGrace'   in fx);
});

// ── decayBlessing ───────────────────────────────────────────────────────────

test('decayBlessing lowers blessing by TITHE.decay', () => {
  const save = { wallet: 0, blessing: 0.6 };
  decayBlessing(save);
  assert.ok(Math.abs(save.blessing - (0.6 - TITHE.decay)) < 1e-9);
});

test('decayBlessing floors at 0, never goes negative', () => {
  const save = { wallet: 0, blessing: 0.05 };
  decayBlessing(save);
  assert.ok(save.blessing >= 0);
  assert.ok(save.blessing <= 0.05);
});

test('decayBlessing on 0 blessing stays 0', () => {
  const save = { wallet: 0, blessing: 0 };
  decayBlessing(save);
  assert.equal(save.blessing, 0);
});

test('decayBlessing handles save without blessing field', () => {
  const save = { wallet: 0 };
  decayBlessing(save);
  assert.ok(Number.isFinite(save.blessing));
  assert.ok(save.blessing >= 0);
});
