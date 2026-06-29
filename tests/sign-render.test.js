// tests/sign-render.test.js — locks the roadside-sign fade that fixed the "billboards
// glitching" report: signs must fade OUT before the close pass (where the projection
// balloons a flat panel to thousands of px and the curve-offset swings it across the road),
// so they only ever render as stable, distant billboards.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signFade, SIGN_NEAR, SIGN_FADE } from '../src/scenery.js';
import { drawSafetyBillboard, drawSpeedLimit, SAFETY_MESSAGES } from '../src/signs.js';

test('signs are fully culled in the glitchy close range', () => {
  assert.equal(signFade(0), 0);
  assert.equal(signFade(SIGN_NEAR - 1), 0, 'gone just inside the near plane');
  assert.equal(signFade(SIGN_NEAR), 0, 'zero exactly at the near plane');
});

test('signs fade in smoothly and reach full alpha at distance', () => {
  const mid = (SIGN_NEAR + SIGN_FADE) / 2;
  assert.ok(signFade(mid) > 0 && signFade(mid) < 1, 'partial alpha across the fade band');
  assert.equal(signFade(SIGN_FADE), 1, 'full alpha by the fade plane');
  assert.equal(signFade(5000), 1, 'stays full far away');
});

test('safety billboards stay FULLY readable through their best size (no early fade-out)', () => {
  // The sim's whole point is the message — billboards must be solid at the distance they
  // read biggest, not faded. A readable mid/near approach (camZ 800, ~270px tall) must be
  // full alpha; only the genuine extreme close-pass (well below SIGN_NEAR) may be culled.
  assert.equal(signFade(800), 1, 'still solid where the message reads best');
  assert.equal(signFade(SIGN_FADE + 1), 1, 'solid the instant it clears the fade band');
  assert.ok(SIGN_FADE <= 400, 'fade band confined to the extreme close-pass, not mid-distance');
});

test('fade is monotonic — no flicker between adjacent camZ steps', () => {
  let prev = -1;
  for (let z = SIGN_NEAR; z <= SIGN_FADE; z += 20) {
    const f = signFade(z);
    assert.ok(f >= prev, `fade should never decrease (${z})`);
    prev = f;
  }
});

test('billboards + speed signs render at every size (deterministic font, no measureText)', () => {
  const ctx = new Proxy(function () {}, { get: () => ctx, apply: () => ctx });
  for (let i = 0; i < SAFETY_MESSAGES.length; i++) {
    for (const size of [8, 20, 64, 200]) {  // tiny → ballooned-but-now-faded range
      assert.doesNotThrow(() => drawSafetyBillboard(ctx, 480, 300, size, i), `billboard ${i} @ ${size}`);
    }
  }
  for (const size of [8, 24, 80]) {
    assert.doesNotThrow(() => drawSpeedLimit(ctx, 480, 300, size, 50), `speed sign @ ${size}`);
  }
});
