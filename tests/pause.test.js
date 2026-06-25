// tests/pause.test.js — drives the REAL game controller headlessly to prove the
// pause/resume flow and the live riddim switch work end-to-end (no canvas pixels).
//
// game.js imports main.js, whose top-level code grabs the canvas + starts a rAF loop, so
// the browser globals must be stubbed BEFORE the dynamic import below.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// A recursive, callable stub so any 2D-context call is a harmless no-op.
const ctxStub = new Proxy(function () {}, { get: () => ctxStub, apply: () => ctxStub });
const fakeEl = { getContext: () => ctxStub, addEventListener() {}, click() {}, style: {}, width: 0, height: 0 };

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.document = { getElementById: () => fakeEl };
globalThis.window = {
  innerWidth: 800, innerHeight: 450, devicePixelRatio: 1,
  addEventListener() {}, visualViewport: { width: 800, height: 450, addEventListener() {} },
};
globalThis.requestAnimationFrame = () => 0;

const { createGame } = await import('../src/game.js');

// A silent audio stub: records nothing, just satisfies the controller's calls.
function audioStub() {
  const calls = [];
  const rec = (k) => (...a) => { calls.push([k, ...a]); };
  return { calls, setMuted: rec('setMuted'), setGenre: rec('setGenre'), unlock: rec('unlock'),
    playStage: rec('playStage'), playUserMusic: rec('playUserMusic'), playRadio: rec('playRadio'),
    stop: rec('stop'), sfx: rec('sfx') };
}

// Spin up a game and start an actual run (hub → play → START via the keyboard path).
function startedGame() {
  const audio = audioStub();
  const game = createGame(audio);
  game.menuKey('Enter');   // hub → play screen
  game.menuKey('Enter');   // play → START the run
  assert.equal(game.state.mode, 'play', 'a run is underway');
  return { game, audio };
}

test('P pauses the run and P resumes it (world frozen while paused)', () => {
  const { game } = startedGame();
  game.menuKey('p');
  assert.equal(game.state.mode, 'paused', 'P pauses');
  game.update(1);  // a frame while paused must NOT crash and stays paused
  assert.equal(game.state.mode, 'paused', 'still paused after an update tick');
  game.menuKey('p');
  assert.equal(game.state.mode, 'play', 'P resumes');
});

test('Escape also toggles pause/resume', () => {
  const { game } = startedGame();
  game.menuKey('Escape');
  assert.equal(game.state.mode, 'paused');
  game.menuKey('Escape');
  assert.equal(game.state.mode, 'play');
});

test('the ❚❚ button (top-left) pauses, RESUME button resumes — via taps', () => {
  const { game } = startedGame();
  game.menuPoint(20, 26);   // inside the top-left pause button
  assert.equal(game.state.mode, 'paused', 'tapping ❚❚ pauses');
  game.menuPoint(480, 192); // centre of the RESUME button (W*0.5, H*0.30 area)
  assert.equal(game.state.mode, 'play', 'tapping RESUME resumes');
});

test('the riddim can be changed live while paused (and persists)', () => {
  const { game, audio } = startedGame();
  game.menuKey('p');
  const before = game.state.save.settings.genre;
  game.menuKey('.');  // next riddim
  const after = game.state.save.settings.genre;
  assert.notEqual(after, before, 'the chosen riddim changed');
  // the new source was (re)started so the music is audible immediately
  assert.ok(audio.calls.some(c => c[0] === 'setGenre' && c[1] === after), 'genre pushed to audio');
  assert.equal(game.state.mode, 'paused', 'still paused after switching riddim');
});
