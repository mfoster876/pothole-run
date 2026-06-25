import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CODE, emptyState, feedTap } from '../src/tapcode.js';

// Helper: feed multiple tokens in sequence and return the final result
function feedAll(tokens) {
  let state = emptyState();
  let result;
  for (const token of tokens) {
    result = feedTap(state, token);
    state = result.state;
  }
  return result;
}

test('CODE is defined and has 5 elements', () => {
  assert.ok(Array.isArray(CODE));
  assert.equal(CODE.length, 5);
});

test('emptyState returns progress 0', () => {
  assert.deepEqual(emptyState(), { progress: 0 });
});

test('correct full sequence matches', () => {
  const result = feedAll(CODE);
  assert.equal(result.matched, true);
});

test('correct sequence resets progress to 0 on match', () => {
  const result = feedAll(CODE);
  assert.deepEqual(result.state, { progress: 0 });
});

test('a wrong tap mid-sequence resets progress', () => {
  let state = emptyState();
  // Feed the first two correct tokens
  ({ state } = feedTap(state, CODE[0]));
  ({ state } = feedTap(state, CODE[1]));
  // Feed a token that is not the next expected AND is not CODE[0]
  // Use an invalid corner label that is never in CODE
  const wrongToken = 'ZZ';
  const r = feedTap(state, wrongToken);
  assert.equal(r.matched, false);
  assert.deepEqual(r.state, { progress: 0 });
});

test('a wrong tap that equals CODE[0] restarts progress at 1', () => {
  let state = emptyState();
  // Advance past CODE[0]
  ({ state } = feedTap(state, CODE[0]));
  ({ state } = feedTap(state, CODE[1]));
  assert.equal(state.progress, 2);
  // Feed CODE[0] again (which is wrong at position 2 but equals CODE[0])
  const r = feedTap(state, CODE[0]);
  assert.equal(r.matched, false);
  assert.equal(r.state.progress, 1);
});

test('completing the code twice both times matches', () => {
  let state = emptyState();
  let matched1 = false, matched2 = false;
  for (const token of CODE) {
    const r = feedTap(state, token);
    state = r.state;
    if (r.matched) matched1 = true;
  }
  assert.equal(matched1, true);
  // After first completion state is reset; run again
  for (const token of CODE) {
    const r = feedTap(state, token);
    state = r.state;
    if (r.matched) matched2 = true;
  }
  assert.equal(matched2, true);
});

test('partial sequence does not match', () => {
  let state = emptyState();
  for (let i = 0; i < CODE.length - 1; i++) {
    const r = feedTap(state, CODE[i]);
    assert.equal(r.matched, false);
    state = r.state;
  }
});

test('wrong first token resets to 0', () => {
  // Feed something that is not CODE[0]
  const notFirst = CODE[0] === 'TR' ? 'BL' : 'TR';
  const r = feedTap(emptyState(), notFirst);
  assert.equal(r.matched, false);
  assert.deepEqual(r.state, { progress: 0 });
});
