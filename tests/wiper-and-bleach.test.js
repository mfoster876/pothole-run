// tests/wiper-and-bleach.test.js — greedier windscreen youths + the Conductor's
// progressive bleach disfigurement.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wiperCharge } from '../src/run.js';
import { getVehicle } from '../src/vehicles.js';
import { WIPER, BLEACH } from '../src/constants.js';
import { applyNegative } from '../src/negatives.js';
import { applyItem } from '../src/charitems.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

// ---- wiper extortion ----

test('a wash starts around $50 early in a modest ride', () => {
  const c = wiperCharge(0, getVehicle('probox'));
  assert.ok(c >= 50 && c < 80, `early Probox wash ~$50, got ${c}`);
});

test('the ask grows the deeper you drive', () => {
  const v = getVehicle('swift');
  assert.ok(wiperCharge(3000, v) > wiperCharge(0, v) * 2, 'much greedier deep in');
});

test('flashier rides get shaken down harder at the same distance', () => {
  assert.ok(wiperCharge(500, getVehicle('porsche')) > wiperCharge(500, getVehicle('probox')),
    'a Porsche driver is a juicier target than a Probox driver');
});

test('the wash is capped and never negative', () => {
  const huge = wiperCharge(999999, getVehicle('cybertruck'));
  assert.equal(huge, WIPER.maxCharge, 'capped');
  assert.ok(wiperCharge(0, getVehicle('handcart')) >= WIPER.baseCharge - 1);
});

// ---- conductor progressive bleach ----

test('a fresh Conductor starts black (bleachLevel 0)', () => {
  const cart = createCart(getCharacter('conductor'));
  assert.equal(cart.bleachLevel, 0);
});

test('each bleach hazard hit disfigures one stage worse, capped at the skull, and burns cash', () => {
  const cart = createCart(getCharacter('conductor'));
  const run = { coins: 100000 };
  for (let i = 1; i <= 3; i++) {
    applyNegative({}, cart, run, 'cakesoap');
    assert.equal(cart.bleachLevel, Math.min(BLEACH.maxLevel, i));
  }
  assert.ok(run.coins < 100000, 'bleaching products burn through his cash');
  // keep hitting them — never exceeds the max (skull) stage
  for (let i = 0; i < 5; i++) applyNegative({}, cart, run, 'sunlight');
  assert.equal(cart.bleachLevel, BLEACH.maxLevel);
});

test('wholesome (yute) items never bleach anyone', () => {
  const cart = createCart(getCharacter('yute'));
  applyItem({}, cart, 'lasco');
  assert.equal(cart.bleachLevel || 0, 0);
});
