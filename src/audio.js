// Original 8-bit reggae, generated live (no files, no copyright): a square-wave
// skank on the offbeat, a triangle dub bassline, and a one-drop kick/snare on beat
// 3. Per-stage tempo/key via musicId. SFX for coins, hits and the cart wreck.
export function createAudio() {
  let ctx = null, master = null, loopTimer = null, muted = false, current = null;

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }

  const STAGE_SETTINGS = {
    fern:   { bpm: 140, root: 146.83 }, // D3
    bamboo: { bpm: 150, root: 164.81 }, // E3
    negril: { bpm: 132, root: 130.81 }  // C3
  };

  function note(freq, start, dur, type, gain) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + dur + 0.02);
  }
  function drum(start, hi) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(hi ? 220 : 90, start);
    o.frequency.exponentialRampToValueAtTime(hi ? 180 : 50, start + 0.08);
    g.gain.setValueAtTime(0.4, start); g.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + 0.14);
  }

  function scheduleBar(cfg, t0) {
    const beat = 60 / cfg.bpm;
    const root = cfg.root;
    for (let b = 0; b < 4; b++) {
      const t = t0 + b * beat;
      if (b === 2) { drum(t, false); drum(t, true); }     // one-drop on beat 3
      note(root * 2, t + beat / 2, beat * 0.28, 'square', 0.12);   // offbeat skank
      note(root * 2.5, t + beat / 2, beat * 0.28, 'square', 0.08);
      const bass = [root, root, root * 1.33, root * 0.75][b];      // dub bassline
      note(bass, t, beat * 0.6, 'triangle', 0.25);
    }
    return 4 * beat;
  }

  function playStage(musicId) {
    unlock();
    if (!ctx) return;
    current = STAGE_SETTINGS[musicId] || STAGE_SETTINGS.fern;
    stop();
    let next = ctx.currentTime + 0.1;
    const tick = () => {
      while (next < ctx.currentTime + 1.0) next += scheduleBar(current, next);
      loopTimer = setTimeout(tick, 250);
    };
    tick();
  }
  function stop() { if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; } }

  // A short band-passed glide — used for the dry wheel squeak and the wood creak.
  function rub(t, f0, f1, peak, dur, bp, q) {
    const o = ctx.createOscillator(), g = ctx.createGain(), filt = ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = bp; filt.Q.value = q;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.linearRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(filt); filt.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function sfx(kind) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    if (kind === 'coin') { note(880, t, 0.08, 'square', 0.2); note(1320, t + 0.05, 0.08, 'square', 0.18); }
    if (kind === 'hit') drum(t, false);
    if (kind === 'wreck') { drum(t, false); note(70, t, 0.5, 'sawtooth', 0.3); }
    // dry, slightly random wheel squeak — high and thin
    if (kind === 'squeak') { const b = 1700 + Math.random() * 1000; rub(t, b, b * 0.66, 0.05, 0.16, 2600, 7); }
    // low wooden creak when the cart leans into a turn
    if (kind === 'creak') { const b = 120 + Math.random() * 70; rub(t, b, b * 1.5, 0.08, 0.2, 380, 3); }
    // airy whoosh of a vehicle blasting past (sweeping band-passed wash)
    if (kind === 'whoosh') {
      const o = ctx.createOscillator(), g = ctx.createGain(), bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 0.7;
      bp.frequency.setValueAtTime(600, t); bp.frequency.exponentialRampToValueAtTime(2400, t + 0.16);
      bp.frequency.exponentialRampToValueAtTime(500, t + 0.34);
      o.type = 'sawtooth'; o.frequency.setValueAtTime(170, t); o.frequency.linearRampToValueAtTime(80, t + 0.34);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.13, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
      o.connect(bp); bp.connect(g); g.connect(master); o.start(t); o.stop(t + 0.38);
    }
  }
  function setMuted(v) { muted = v; if (master) master.gain.value = v ? 0 : 0.5; }

  return { unlock, playStage, stop, sfx, setMuted };
}
