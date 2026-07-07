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

// ── Bog Walk hunting crocs + swimmers ──

test('a homing croc swims laterally toward the target line as it closes', () => {
  const field = createField();
  const croc = spawn(field, 'croc', 0, 400);           // spawns off in lane 0
  const startX = croc.x;
  for (let i = 0; i < 60; i++) advance(field, 1, 1 / 60, 0);   // target: centre (x = 0)
  assert.ok(Math.abs(croc.x - 0) < Math.abs(startX - 0), 'croc closed on the raft line');
});

test('a croc never homes once past the player, and non-homers never home at all', () => {
  const field = createField();
  const croc = spawn(field, 'croc', 0, 5);
  croc.z = -5;                                          // already passed
  const wasX = croc.x;
  advance(field, 0, 1 / 60, 0.9);
  assert.equal(croc.x, wasX, 'no homing from behind');
  const hole = spawn(field, 'pothole', 0, 300);
  const holeX = hole.x;
  for (let i = 0; i < 60; i++) advance(field, 1, 1 / 60, 0.9);
  assert.equal(hole.x, holeX, 'a pothole does not stalk anybody');
});

test('swimmers cross the channel like walkers and count as pedestrians', async () => {
  const { hazardInfo } = await import('../src/hazardTypes.js');
  const info = hazardInfo('swimmer');
  assert.equal(info.category, 'pedestrian', 'running one down goes on the ledger');
  assert.equal(info.walk, true, 'they swim ACROSS, like jaywalkers cross a road');
  const field = createField();
  const sw = spawn(field, 'swimmer', 0, 300);
  const x0 = sw.x;
  for (let i = 0; i < 30; i++) advance(field, 1, 1 / 60);
  assert.notEqual(sw.x, x0, 'the swimmer is moving across the water');
});
