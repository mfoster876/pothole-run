// tests/winding-road.test.js — per-stage windiness: the road's turn rate scales with the
// stage, Fern Gully is the twistiest, and the curvature reading that drives the
// corner-pull tracks that scale.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curvatureAt, curveOffsetAt, setCurveScale } from '../src/road.js';
import { getStage } from '../src/stages.js';

test('setCurveScale scales the curvature linearly (winds/straightens the whole road)', () => {
  setCurveScale(1);
  const a = curvatureAt(1000);
  setCurveScale(2);
  const b = curvatureAt(1000);
  assert.ok(Math.abs(a) > 1e-6, 'the road actually bends somewhere');
  assert.ok(Math.abs(b - 2 * a) < 1e-9, `2x scale → 2x curvature: ${b} vs ${2 * a}`);
  setCurveScale(1); // restore module state for any later road math
});

test('a windier scale bends the road centreline more (visible curve grows)', () => {
  setCurveScale(0.5);
  const gentle = Math.abs(curveOffsetAt(2000, 3000));
  setCurveScale(2.0);
  const sharp = Math.abs(curveOffsetAt(2000, 3000));
  assert.ok(sharp > gentle, `sharper scale bends more: ${sharp} > ${gentle}`);
  setCurveScale(1);
});

test('Fern Gully is the twistiest stage; Holland Bamboo the straightest', () => {
  const fern = getStage('fern-gully').curveMult;
  const holland = getStage('holland-bamboo').curveMult;
  const negril = getStage('negril').curveMult;
  assert.ok(fern > negril && fern > holland, `Fern (${fern}) is twistiest`);
  assert.ok(holland < negril && holland <= 0.7, `Holland Bamboo (${holland}) runs straight`);
});
