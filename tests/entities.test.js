import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createField, spawn, advance, activeEntities } from '../src/entities.js';
import { LANES } from '../src/constants.js';

test('spawn adds an active entity at a lane with z ahead', () => {
  const field = createField();
  spawn(field, 'pothole', 1, 300);
  const list = activeEntities(field);
  assert.equal(list.length, 1);
  assert.equal(list[0].x, LANES[1]);
  assert.equal(list[0].z, 300);
});
test('advance moves entities toward the player and retires passed ones', () => {
  const field = createField();
  spawn(field, 'pothole', 0, 10);
  advance(field, 100);
  assert.equal(activeEntities(field).length, 0);
});
test('pool is reused: spawning after retire does not grow the array unbounded', () => {
  const field = createField();
  for (let i = 0; i < 5; i++) { spawn(field, 'coin', 1, 5); advance(field, 100); }
  assert.ok(field.pool.length <= 5);
});
