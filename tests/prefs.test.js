// tests/prefs.test.js — drives the real controller to prove the Preferences screen wiring:
// the ⚙ hub button opens it, and the Graphics / Sound toggles flip + persist.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const ctxStub = new Proxy(function () {}, { get: () => ctxStub, apply: () => ctxStub });
const fakeEl = { getContext: () => ctxStub, addEventListener() {}, click() {}, style: {}, width: 0, height: 0 };
globalThis.localStorage = (() => { let store = {}; return { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } }; })();
globalThis.document = { getElementById: () => fakeEl };
globalThis.window = { innerWidth: 800, innerHeight: 450, devicePixelRatio: 2, addEventListener() {}, visualViewport: { width: 800, height: 450, addEventListener() {} } };
globalThis.requestAnimationFrame = () => 0;

const { createGame } = await import('../src/game.js');

function audioStub() { const rec = () => () => {}; return { setMuted: rec(), setGenre: rec(), unlock: rec(), playStage: rec(), playUserMusic: rec(), playRadio: rec(), stop: rec(), sfx: rec() }; }

// Virtual-coord centres (W=960, H=540) of the controls on each screen.
const HUB_GEAR = [41, 41];                 // ⚙ button {x:18,y:18,w:46,h:46}
const PREF_GRAPHICS = [480, 215];          // graphics toggle row
const PREF_SOUND = [480, 312];             // sound toggle row

test('the ⚙ button opens Preferences and the Graphics toggle flips smooth↔fast', () => {
  const game = createGame(audioStub());
  assert.equal(game.state.save.settings.graphics, 'smooth', 'defaults to smooth');
  game.menuPoint(...HUB_GEAR);
  game.menuPoint(...PREF_GRAPHICS);
  assert.equal(game.state.save.settings.graphics, 'fast', 'tap → fast');
  game.menuPoint(...PREF_GRAPHICS);
  assert.equal(game.state.save.settings.graphics, 'smooth', 'tap again → smooth');
});

test('the Sound toggle on Preferences mutes / unmutes', () => {
  const game = createGame(audioStub());
  const before = game.state.save.settings.muted;
  game.menuPoint(...HUB_GEAR);
  game.menuPoint(...PREF_SOUND);
  assert.equal(game.state.save.settings.muted, !before, 'sound toggled');
});
