// All music + SFX generated live (no files, no copyright). Four switchable genres,
// each its own riddim: a reggae one-drop, an up-tempo ska chop, a digital dancehall
// bounce, and a boom-bap hip-hop beat. Stage `musicId` sets the key; genre sets the
// tempo and the pattern. SFX for coins, hits, the cart wreck, squeak/creak/whoosh.
//
// User-music path: HTMLAudioElement playlist from IndexedDB blobs.
// Controller calls playUserMusic() instead of playStage(); SFX always use Web Audio.
import { getPlayableTracks, revoke } from './usermusic.js';

export function createAudio() {
  let ctx = null, master = null, loopTimer = null, muted = false;
  let stageRoot = 146.83, genre = 'reggae', noiseBuf = null;

  // --- User-music playlist state ---
  let userEl     = null;   // single reused HTMLAudioElement
  let userTracks = [];     // [{ id, name, url }]
  let userUrls   = [];     // tracked for revocation
  let userIdx    = 0;      // current track index

  // --- Live radio state (a separate element so the playlist logic stays untouched) ---
  let radioEl  = null;     // reused HTMLAudioElement pointed at a live stream
  let radioUrl = null;     // current station URL (kept for reconnect on a dropout)

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
    // one reusable white-noise buffer for snares, claps and hats
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  // root key per stage; genre supplies the tempo
  const STAGE_ROOT = { fern: 146.83, bamboo: 164.81, negril: 130.81, kingston: 138.59, hills: 155.56 };
  const GENRE_BPM = { reggae: 142, ska: 168, dancehall: 102, hiphop: 92 };

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
    o.frequency.exponentialRampToValueAtTime(hi ? 180 : 45, start + 0.08);
    g.gain.setValueAtTime(0.4, start); g.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + 0.14);
  }
  // noise burst through a high-pass — snares (low hp), claps (mid), hats (high)
  function noiseHit(start, dur, hp, vol) {
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    src.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, start); g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(start); src.stop(start + dur + 0.02);
  }
  // A low-passed stack of partials — warm, less buzzy than a raw oscillator. Used
  // for rounded dub bass and the organ chords that give reggae its bubble.
  function tone(freqs, t, dur, type, gain, lp) {
    const g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = lp; f.Q.value = 0.6;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const fr of freqs) { const o = ctx.createOscillator(); o.type = type; o.frequency.value = fr; o.connect(g); o.start(t); o.stop(t + dur + 0.02); }
    g.connect(f); f.connect(master);
  }
  const bassNote = (fr, t, dur, gain) => tone([fr, fr * 0.5], t, dur, 'triangle', gain, 520); // warm, rounded dub bass
  // Chord voicings play the ACTUAL triad tones so harmony changes are audible: the organ
  // "bubble" sits in a mid register, the skank chops the same chord an octave up and bright.
  const organChord = (triad, t, dur, gain) => tone(triad, t, dur, 'square', gain, 2000);
  const skankChord = (triad, t, dur, gain) => tone(triad.map(f => f * 2), t, dur, 'square', gain, 5000);

  // ── Harmony: equal-tempered chords over the stage root, and real Jamaican progressions ──
  const SEMI = n => Math.pow(2, n / 12);
  // Chord voicings as semitone intervals. `dom` adds the flat-7 for a real dominant-7 chord
  // (the tension in the ska turnaround), so it doesn't just read as a plain major triad.
  const TRIAD = { maj: [0, 4, 7], min: [0, 3, 7], dom: [0, 4, 7, 10] };
  // A chord spec is { off: semitones above the tonic, q: quality }. makeChord voices it:
  // `cr` = the chord root in the bass register, `triad` = the three chord tones for comping.
  function makeChord(root, spec) {
    const base = root * SEMI(spec.off);
    const ivals = TRIAD[spec.q] || TRIAD.maj;
    return { cr: base, triad: ivals.map(iv => base * SEMI(iv)), q: spec.q };
  }
  // Authentic per-genre progressions (Roman numerals in the stage key). Each section is one
  // chord per bar. reggae = sunny I–IV–V one-drop; ska = jazzy 50s changes; dancehall = a
  // minor i–VII vamp; hip-hop = a moody minor loop — each with a distinct chorus and BRIDGE.
  const M = 'maj', m = 'min', d = 'dom';
  const PROG = {
    reggae: {
      verse:  [{ off: 0, q: M }, { off: 5, q: M }, { off: 7, q: M }, { off: 5, q: M }],   // I  IV V  IV
      chorus: [{ off: 0, q: M }, { off: 7, q: M }, { off: 9, q: m }, { off: 5, q: M }],   // I  V  vi IV
      bridge: [{ off: 9, q: m }, { off: 5, q: M }, { off: 0, q: M }, { off: 7, q: M }],   // vi IV I  V
    },
    ska: {
      verse:  [{ off: 0, q: M }, { off: 9, q: m }, { off: 5, q: M }, { off: 7, q: M }],   // I  vi IV V
      chorus: [{ off: 0, q: M }, { off: 5, q: M }, { off: 0, q: M }, { off: 7, q: M }],   // I  IV I  V
      bridge: [{ off: 2, q: m }, { off: 7, q: M }, { off: 0, q: M }, { off: 9, q: d }],   // ii V  I  VI7
    },
    dancehall: {
      verse:  [{ off: 0, q: m }, { off: 10, q: M }, { off: 0, q: m }, { off: 10, q: M }], // i  VII (vamp)
      chorus: [{ off: 0, q: m }, { off: 8, q: M }, { off: 10, q: M }, { off: 0, q: m }],  // i  VI VII i
      bridge: [{ off: 5, q: m }, { off: 7, q: m }, { off: 0, q: m }, { off: 10, q: M }],  // iv v  i  VII
    },
    hiphop: {
      verse:  [{ off: 0, q: m }, { off: 0, q: m }, { off: 5, q: m }, { off: 5, q: m }],   // i (2) iv (2)
      chorus: [{ off: 0, q: m }, { off: 8, q: M }, { off: 10, q: M }, { off: 7, q: m }],  // i  VI VII v
      bridge: [{ off: 3, q: M }, { off: 8, q: M }, { off: 5, q: m }, { off: 7, q: m }],   // III VI iv v
    },
  };
  // Song FORM: the order of sections, so the tune has an arc and a bridge recurs throughout
  // instead of vamping one chord forever. verse×2 → chorus → verse → BRIDGE → chorus, then loop.
  const FORM = [
    { sec: 'verse', reps: 2 }, { sec: 'chorus', reps: 1 },
    { sec: 'verse', reps: 1 }, { sec: 'bridge', reps: 1 }, { sec: 'chorus', reps: 1 },
  ];
  let formGenre = null, formSeq = [];   // cached flattened chord-per-bar sequence for `genre`
  function barChordSpec(idx) {
    if (formGenre !== genre) {
      const P = PROG[genre] || PROG.reggae;
      formSeq = [];
      for (const { sec, reps } of FORM) {
        const prog = P[sec] || P.verse;
        for (let r = 0; r < reps; r++) formSeq.push(...prog);
      }
      formGenre = genre;
    }
    return formSeq[((idx % formSeq.length) + formSeq.length) % formSeq.length];
  }

  // --- one bar per genre over a given CHORD. Returns the bar length in seconds. ---
  function bar(t0, chord, beat) {
    const cr = chord.cr, triad = chord.triad;
    if (genre === 'ska') {
      const sw = beat * 0.03;                            // light swing
      for (let b = 0; b < 4; b++) {
        const t = t0 + b * beat;
        if (b % 2 === 0) drum(t, false);                 // kick on 1 & 3
        else noiseHit(t, 0.13, 2200, 0.22);              // snare backbeat 2 & 4
        skankChord(triad, t + beat / 2 + sw, beat * 0.15, 0.1);  // bright upstroke chop on the &
        noiseHit(t + beat / 2, 0.04, 6500, 0.05);                // light hat on the &
      }
      const walk = [cr, cr * 1.25, cr * 1.5, cr * 1.68]; // walking bassline anchored on the chord
      for (let b = 0; b < 4; b++) bassNote(walk[b], t0 + b * beat, beat * 0.4, 0.24);
    } else if (genre === 'dancehall') {
      for (let b = 0; b < 4; b++) {
        const t = t0 + b * beat;
        drum(t, false);                                  // digital four-on-the-floor
        if (b % 2 === 1) noiseHit(t, 0.16, 1500, 0.22);  // clap on 2 & 4
        organChord(triad.map(f => f * 2), t + beat / 2, beat * 0.16, 0.05); // synth stab on the &
      }
      // syncopated digital bassline riff across the bar (eighths) — the bounce, on the chord root
      const riff = [cr, cr, cr * 1.5, cr, cr * 1.33, cr, cr * 1.5, cr * 1.78];
      for (let i = 0; i < 8; i++) bassNote(riff[i], t0 + i * (beat / 2), beat * 0.4, 0.26);
    } else if (genre === 'hiphop') {
      const sw = beat * 0.06;                            // swung hats
      for (let b = 0; b < 4; b++) {
        const t = t0 + b * beat;
        if (b === 0) drum(t, false);                     // kick on 1
        if (b === 2) { drum(t, false); drum(t + beat / 2, false); } // kick on 3 + the &
        if (b % 2 === 1) noiseHit(t, 0.2, 1400, 0.26);   // fat snare on 2 & 4
      }
      for (let i = 0; i < 8; i++) noiseHit(t0 + i * (beat / 2) + (i % 2 ? sw : 0), 0.05, 6000, i % 2 ? 0.05 : 0.08);
      organChord(triad, t0 + beat * 0.5, beat * 0.5, 0.035);   // a sparse chord pad under the loop
      bassNote(cr, t0, beat * 1.8, 0.3);                 // deep sub bass on the chord root
      bassNote(cr * 0.75, t0 + beat * 2, beat * 1.8, 0.3);
    } else {                                             // reggae one-drop (default)
      const sw = beat * 0.05;                            // laid-back swing on the offbeats
      for (let b = 0; b < 4; b++) {
        const t = t0 + b * beat;
        if (b === 2) { drum(t, false); noiseHit(t, 0.16, 1700, 0.2); }  // one-drop on 3
        skankChord(triad, t + beat / 2 + sw, beat * 0.2, 0.075);        // guitar skank on the &
        // organ "bubble": the syncopated shuffle that makes it read as reggae
        organChord(triad, t + beat * 0.5 + sw, beat * 0.16, 0.05);
        organChord(triad.map(f => f * 2), t + beat * 0.75 + sw, beat * 0.14, 0.04);
      }
      const bass = [cr, 0, cr * 1.33, cr * 0.75];        // walking dub line; rests on beat 2 for space
      for (let b = 0; b < 4; b++) if (bass[b]) bassNote(bass[b], t0 + b * beat, beat * 0.6, 0.28);
    }
    return 4 * beat;
  }

  function playStage(musicId) {
    unlock();
    if (!ctx) return;
    stageRoot = STAGE_ROOT[musicId] || STAGE_ROOT.fern;
    stop();
    let next = ctx.currentTime + 0.1;
    let barIdx = 0;                        // walks the song FORM so chords + bridges progress
    const tick = () => {
      const beat = 60 / (GENRE_BPM[genre] || 140);
      while (next < ctx.currentTime + 1.0) {
        const chord = makeChord(stageRoot, barChordSpec(barIdx++));
        next += bar(next, chord, beat);
      }
      loopTimer = setTimeout(tick, 250);
    };
    tick();
  }
  function stopUserMusic() {
    if (userEl) { userEl.pause(); userEl.src = ''; }
    revoke(userUrls);
    userUrls = [];
    userTracks = [];
    userIdx = 0;
  }

  function stopRadio() {
    if (radioEl) { radioEl.pause(); radioEl.src = ''; }
    radioUrl = null;
  }

  function stop() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    stopUserMusic();
    stopRadio();
  }

  /**
   * Tune into a live internet-radio stream (real Jamaican stations — see radio.js).
   * Plays straight through a plain HTMLAudioElement: no Web Audio graph, so no CORS
   * requirement, and any https audio stream works on the HTTPS build. A live stream
   * shouldn't "end" — if it drops, we reconnect to the same station once it fires 'ended'.
   */
  function playRadio(url) {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    stopUserMusic();
    stopRadio();
    if (!url) return;
    radioUrl = url;
    if (!radioEl) {
      radioEl = new Audio();
      radioEl.preload = 'none';
      const reconnect = () => {
        // A live stream shouldn't end; the CDN edge can also briefly 503. Reconnect to the
        // CURRENT station ONCE per load (guarded), then leave it to the player to switch.
        if (radioUrl && !muted && !radioEl._retried) {
          radioEl._retried = true;
          setTimeout(() => { if (radioUrl) { radioEl.src = radioUrl; radioEl.play().catch(() => {}); } }, 1500);
        }
      };
      radioEl.addEventListener('ended', reconnect);
      radioEl.addEventListener('error', reconnect);
    }
    radioEl._retried = false;     // fresh station load gets a fresh reconnect budget
    radioEl.src = url;
    radioEl.volume = 0.55;
    if (!muted) radioEl.play().catch(() => { /* autoplay blocked — needs a user gesture */ });
  }

  // switch genre live — the running loop picks up the new pattern on the next bar
  function setGenre(g) { if (GENRE_BPM[g]) genre = g; }

  /**
   * Load tracks from IndexedDB and play them as a looping playlist.
   * If no tracks are stored, does nothing (caller should fall back to playStage).
   * SFX remain on Web Audio; only the music goes through the HTMLAudioElement.
   */
  async function playUserMusic() {
    // Stop any running procedural music first
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    stopUserMusic();

    const tracks = await getPlayableTracks();
    if (!tracks.length) return;   // nothing uploaded — caller falls back

    userTracks = tracks;
    userUrls   = tracks.map(t => t.url);
    userIdx    = 0;

    if (!userEl) {
      userEl = new Audio();
      userEl.addEventListener('ended', () => {
        if (!userTracks.length) return;
        userIdx = (userIdx + 1) % userTracks.length;
        _playUserTrack();
      });
    }

    if (!muted) _playUserTrack();
  }

  function _playUserTrack() {
    if (!userEl || !userTracks.length) return;
    userEl.src    = userTracks[userIdx].url;
    userEl.volume = 0.6;
    userEl.play().catch(() => { /* autoplay blocked — user gesture needed */ });
  }

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
    // fatter, richer flourish when you scoop up paper money
    if (kind === 'cash') { note(660, t, 0.09, 'square', 0.2); note(990, t + 0.06, 0.09, 'square', 0.2); note(1480, t + 0.13, 0.12, 'square', 0.18); }
    if (kind === 'hit') drum(t, false);
    if (kind === 'wreck') { drum(t, false); note(70, t, 0.5, 'sawtooth', 0.3); }
    // a wet, descending squelch for the soapy-can windscreen wash
    if (kind === 'wash') { rub(t, 900, 300, 0.12, 0.26, 1100, 4); note(180, t, 0.2, 'square', 0.08); }
    // dry, slightly random wheel squeak — high and thin
    if (kind === 'squeak') { const b = 1700 + Math.random() * 1000; rub(t, b, b * 0.66, 0.05, 0.16, 2600, 7); }
    // low wooden creak when the cart leans into a turn
    if (kind === 'creak') { const b = 120 + Math.random() * 70; rub(t, b, b * 1.5, 0.08, 0.2, 380, 3); }
    // bright rising shimmer when SUPERCHARGE activates
    if (kind === 'super') { note(880, t, 0.1, 'sine', 0.2); note(1320, t + 0.06, 0.1, 'sine', 0.18); note(1760, t + 0.12, 0.14, 'sine', 0.16); }
    // heavy thud of plowing through a body — a low boom + a dull wet smack
    if (kind === 'thud') { drum(t, false); note(56, t, 0.24, 'sawtooth', 0.3); noiseHit(t, 0.14, 280, 0.16); }
    // PER-DAMAGE vehicle voice — a busted ride that's barely hanging on rattles itself
    // apart; a single labouring knock for a half-dead motor. game.js picks these by the
    // cart's condition so you HEAR the difference between a new ride and a wreck.
    if (kind === 'clatter') {
      for (let i = 0; i < 4; i++) {
        const tt = t + i * (0.045 + Math.random() * 0.03);
        const f = 140 + Math.random() * 180;
        note(f, tt, 0.05, 'square', 0.06);
        noiseHit(tt, 0.04, 2400 + Math.random() * 1500, 0.05);
      }
    }
    if (kind === 'knock') { note(70, t, 0.1, 'square', 0.12); noiseHit(t, 0.05, 500, 0.06); }
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
  function setMuted(v) {
    muted = v;
    if (master) master.gain.value = v ? 0 : 0.5;
    // also pause / resume the user-music element
    if (userEl && userTracks.length) {
      if (v) {
        userEl.pause();
      } else {
        userEl.play().catch(() => {});
      }
    }
    // …and the live radio stream
    if (radioEl && radioUrl) {
      if (v) radioEl.pause();
      else radioEl.play().catch(() => {});
    }
  }

  return { unlock, playStage, playUserMusic, playRadio, stop, sfx, setMuted, setGenre };
}
