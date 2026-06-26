// tests/control-speed.test.js — the joyride lesson: the faster the ride goes, the harder
// it is to control, and NO amount of grip upgrade fully buys that back. Plus the
// speedometer's speed→km/h mapping for the HUD.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, updateCart, speedControlFactor } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { speedToKmh, KMH_PER_UNIT } from '../src/hud.js';

test('speedControlFactor is ~1 at a crawl and falls monotonically as speed climbs', () => {
  const f0 = speedControlFactor(0), fMid = speedControlFactor(120), fFast = speedControlFactor(300);
  assert.ok(Math.abs(f0 - 1) < 1e-9, `crawl ≈ 1: ${f0}`);
  assert.ok(fMid < f0 && fFast < fMid, `monotone down: ${f0} > ${fMid} > ${fFast}`);
  assert.ok(fFast > 0 && fFast < 0.6, `still positive but clearly bitten at speed: ${fFast}`);
});

// One lane-lerp step covers LESS of the gap at high speed than at low speed — even on a
// maximally grip-kitted ride. This is the "harder to control the faster it gets, no matter
// how many tools" rule, proven on behaviour rather than on the constant.
test('a fast cart steers less per step than a slow one — even fully grip-kitted', () => {
  const mk = (speed) => {
    const c = createCart(getCharacter('yute'), getVehicle('porsche'), 8 /* huge stability bonus */);
    c.laneIndex = 0;       // ask to slide from centre out to the far slot
    c.speed = speed;
    c.throttle = 0;
    return c;
  };
  const slow = mk(30), fast = mk(300);
  updateCart(slow, 1 / 60, 0);
  updateCart(fast, 1 / 60, 0);
  const slowMove = Math.abs(slow.x), fastMove = Math.abs(fast.x);
  assert.ok(slowMove > 0 && fastMove > 0, 'both actually moved');
  assert.ok(fastMove < slowMove * 0.9, `fast ${fastMove} clearly steers less than slow ${slowMove}`);
});

test('speedToKmh applies the gauge factor, never goes negative, and rises with speed', () => {
  assert.equal(speedToKmh(0), 0);
  assert.equal(speedToKmh(100), Math.round(100 * KMH_PER_UNIT));
  assert.ok(speedToKmh(250) > speedToKmh(79), 'faster reads higher');
  assert.equal(speedToKmh(-50), 0, 'clamped at zero');
});
