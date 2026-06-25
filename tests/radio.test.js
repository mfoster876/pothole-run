// tests/radio.test.js — live Jamaican radio: station list + playback wiring.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATIONS, stationCount, stationAt } from '../src/radio.js';
import { GENRES } from '../src/save.js';
import { createAudio } from '../src/audio.js';

test('radio offers several real Jamaican stations', () => {
  assert.ok(STATIONS.length >= 5, 'a decent dial of stations');
  assert.equal(stationCount(), STATIONS.length);
});

test('every station is an https direct stream with a name (no mixed-content block)', () => {
  for (const s of STATIONS) {
    assert.ok(s.name && s.name.length, 'has a display name');
    assert.match(s.url, /^https:\/\//, `${s.name} must stream over https`);
  }
});

test('station mounts are unique', () => {
  assert.equal(new Set(STATIONS.map(s => s.url)).size, STATIONS.length, 'no duplicate mounts');
});

test('stationAt wraps safely for any index (incl. negatives / overrun)', () => {
  assert.equal(stationAt(0), STATIONS[0]);
  assert.equal(stationAt(STATIONS.length), STATIONS[0], 'wraps past the end');
  assert.equal(stationAt(-1), STATIONS[STATIONS.length - 1], 'wraps negatives');
  assert.equal(stationAt(STATIONS.length + 2), STATIONS[2]);
});

test('radio is a selectable riddim', () => {
  assert.ok(GENRES.includes('radio'), 'Radio is in the riddim picker');
});

test('audio.playRadio tunes a stream through an <audio> element (stubbed, no CORS needed)', () => {
  const played = [];
  const prevAudio = globalThis.Audio;
  globalThis.Audio = class {
    constructor() { this.src = ''; this.volume = 1; }
    addEventListener() {}
    play() { played.push(this.src); return Promise.resolve(); }
    pause() {}
  };
  try {
    const audio = createAudio();
    assert.equal(typeof audio.playRadio, 'function', 'playRadio is exposed');
    audio.playRadio(stationAt(0).url);
    assert.deepEqual(played, [stationAt(0).url], 'the chosen station URL is set and played');
    assert.doesNotThrow(() => audio.stop(), 'stop() tears the stream down cleanly');
  } finally {
    globalThis.Audio = prevAudio;
  }
});
