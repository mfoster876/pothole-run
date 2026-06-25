# Pothole Run — Design Spec

**Working title:** Pothole Run *(alt: "Cyaa Stop Wi" — name not final)*
**Date:** 2026-06-24
**Status:** Approved design, pending spec review → implementation plan

---

## 1. Concept

A pixel-art endless-survival driving game with a Jamaican soul. The player rolls a
homemade downtown-Kingston **handcart** — sound system blaring on the back — down
Jamaica's notoriously potholed roads, sliding between lanes to dodge potholes and
traffic for as long as possible. The vibe is early-2000s Wii-era playful warmth:
chunky 16-bit sprites, vibrant island colour, and original 8-bit reggae riddims.

It is **not** a go-kart game. The hero vehicle is a real artifact: a makeshift
flat-bed wooden pushcart of the kind registered and raced in downtown Kingston and
used as mobile market stalls / pirated-CD stands.

**Platform target:** plays in **iPhone Safari** (landscape) and **macOS Safari**,
served from the web (not a local file). Installable as a fullscreen PWA.

---

## 2. Core gameplay loop

- The cart **auto-accelerates** down the road (speed ramps with distance).
- Player **taps/holds the left or right thumb-zone** to slide the cart between lanes.
- The road is rendered **pseudo-3D** (classic segment/scanline projection — the
  "OutRun" method): the road rushes *into the screen*, selling speed via parallax.
- **Hazards** approach from the horizon: potholes (the signature hazard), plus
  traffic and roadside obstacles (goats, taxis, vendors, handcarts, roadblocks).
- Hitting a hazard damages the cart (see §5). Coins and cart-parts are collectible.
- The run ends when the cart's condition hits zero. Score = distance + coins; bests
  are saved per stage and overall.

**Success criterion:** the first time a stranger picks it up on an iPhone, the cart
feels good to slide, the speed reads clearly, and "one more run" is the instinct.

---

## 3. The hero object — the cart (art-direction anchor)

The cart gets the most art love; it is the brand of the game. Built from:

- **Flat, old/rotten wooden base** (visible plank seams, weathered grain).
- **Wheels bolted to iron rods** underneath the short side.
- A long metal **steering rod (mopstick-iron)** rising from the base.
- A **car rim** as the steering wheel.
- A **mini sound-system box (speaker) on the back** that visibly thumps in time
  with the music and emits floating music notes.

Viewed from behind (player's seat), the sound-system box faces the camera at the
bottom of the screen; the driver persona sits/stands at the steering rim.

As the cart takes damage, the wood visibly cracks and a wheel begins to wobble.

---

## 4. Controls & feel

| Platform | Input |
|---|---|
| iPhone Safari (landscape) | Tap/hold left or right on-screen thumb-zone to slide |
| macOS Safari | Left/Right arrow keys, or A / D |

- Cart **leans** into the slide; subtle road parallax and screen shake on impact.
- One-thumb playable. No tilt, no swipe (chosen for reliability across iOS Safari).
- Audio must be unlocked by a first user tap (iOS requirement) — handled at the
  start-screen "tap to play".

---

## 5. Cart-wreck (damage) model

- A **condition meter**: green → amber → red.
- Potholes chip a small amount; large hazards chip more.
- **Visual feedback:** wood cracks, a wheel wobbles, the cart lists as it nears red.
- **Coins / cart-parts** repair a little, rewarding pickups over pure avoidance.
- At zero condition the cart **falls apart** — run ends, score banked, best updated.

---

## 6. Characters — roster + traffic

Seven Jamaican personas. Each is **both** a selectable driver **and** appears as
road traffic / cameo in the world.

1. School Yute
2. Bleachaz Conductor
3. Police Officer
4. Business Woman
5. Taxi Man
6. Jonkonnu
7. Rasta Musician

**Driver stats** (light tilts, not extreme): top speed, handling, and a "cool"
coin-magnet stat. Stats are flavour-forward, balanced so every driver is viable.

**MVP roster (3):** School Yute (balanced/easy), Rasta Musician (cool coin-magnet),
Bleachaz Conductor (fast, loud). Remaining 4 unlock via progression.

---

## 7. Environments — stage-select + endless

Nine locations, each with its own palette, hazard mix, and chiptune:

Fern Gully · Holland Bamboo · Coronation Market · Montego Bay Pier 1 ·
Negril 7-Mile Beach · Portmore back road · Old Hope Road · Norbrook · Cherry Gardens

Plus **Downtown Kingston = unlockable HARD mode**, styled as a **Tron-influenced
neon-grid "digital dancehall"**: night setting, glowing road lines, laser-lit
potholes, and the sound-system box throbbing neon to the riddim. Gameplay-wise it is
the climax — dense traffic, tight lanes, relentless potholes. The Tron aesthetic is
**deliberately contained to this stage**; every daytime location stays warm and
tropical so the neon hit lands as a reward, not a reskin.

**Two modes:**
- **Stage Select** — pick a single location and run it.
- **"Round Jamaica" Endless** — biomes chain back-to-back, difficulty ramps with
  distance.

**MVP stages (3):** Fern Gully, Holland Bamboo, Negril 7-Mile Beach, plus the
endless-mode scaffolding (chaining + ramp logic) in place. Remaining stages and
Downtown hard mode land in Phase 2.

---

## 8. Music & sound — the sound system

- Original **8-bit reggae chiptunes generated in code** via the **Web Audio API**:
  one-drop kick/snare, offbeat skank, dub bassline. Inspired by the Lila Iké /
  Sevana / Protoje / Chronixx / Jesse Royal palette — **original compositions, no
  copyrighted material, no audio files to host.**
- A **distinct loop per environment**, presented as playing from the cart's speaker
  (which pulses to the beat).
- SFX: pothole thud, coin chime, wheel wobble, cart break-up.
- **Mute toggle** always available; audio starts on first tap.

---

## 9. Progression & save

- **Coins + stage completion** unlock additional drivers and stages, and eventually
  Downtown hard mode.
- All progress (unlocks, per-stage bests, coin bank, settings) persists on-device
  via **`localStorage`**. No accounts, no backend.

---

## 10. Technical architecture

**Stack:** vanilla **HTML5 Canvas 2D + plain JavaScript**, **no build step, no
dependencies.** Chosen for 60fps on older iPhones, zero framework weight in Safari,
and drop-in static hosting.

**Files:**

```
index.html            # canvas + start screen shell
manifest.webmanifest  # PWA install metadata
sw.js                 # service worker — offline cache
/src
  game.js        # state machine: menu → select → play → gameover
  road.js        # pseudo-3D road renderer (segment projection)
  cart.js        # player cart: position, lean, condition, render
  spawner.js     # hazard + traffic + pickup spawning (object-pooled)
  collision.js   # lane/segment collision + wreck math
  characters.js  # roster data + stats
  stages.js      # per-environment config (palette, hazards, music id)
  audio.js       # Web Audio chiptune engine + SFX
  input.js       # touch thumb-zones + keyboard
  hud.js         # condition meter, coins, location banner, buttons
  save.js        # localStorage load/save (unlocks, bests, settings)
/assets
  sprites/       # chunky 16-bit sprite atlases (AI-generated, approved)
  icons/         # PWA app icons
```

**Module boundaries:** each file has one job and a small interface. `road.js` knows
nothing about scoring; `audio.js` knows nothing about collision; `save.js` is the
only module that touches `localStorage`. This keeps each unit testable in isolation.

---

## 11. Performance guardrails (mobile Safari)

- Fixed-timestep update loop driven by `requestAnimationFrame`.
- Cap `devicePixelRatio` (e.g. ≤ 2) to limit fill cost on Retina.
- **Sprite atlases** to minimise draw calls; **object pooling** for hazards/pickups.
- Pre-render static road furniture where possible.
- Audio unlocked on first tap; loops scheduled ahead on the Web Audio clock.
- Target: steady **60fps on a mid-range iPhone**.

---

## 12. Art

- **Chunky 16-bit (SNES-era) pixel art**, vibrant palette flattering to Jamaican
  colour. AI-generated sprites, each approved before integration.
- Consistent sprite scale and palette across personas and environments.
- **One deliberate exception:** the Downtown Kingston hard mode (§7) uses a
  dark **neon-grid (Tron-influenced) night palette** — glowing road lines, neon
  edges, laser potholes. Same sprites, recoloured/glow-treated for the night stage.

---

## 13. Hosting & deploy

- **Public GitHub repo → free GitHub Pages.** Static files, no build.
- Loads from a normal URL in both Mac and iPhone Safari (sidesteps the
  local-file-in-Safari problem).
- PWA manifest + service worker enable **Add to Home Screen**: fullscreen launch,
  home-screen icon, offline play after first load.

---

## 14. Build phasing

**Phase 1 — Playable MVP (this build):**
- Pseudo-3D road, auto-accelerate, tap-hold lane sliding.
- Cart with sound-system box + damage visuals; cart-wreck model.
- 3 drivers (Yute, Rasta, Conductor) with stats + select screen.
- 3 stages (Fern Gully, Holland Bamboo, Negril 7-Mile) + endless-mode scaffolding.
- Coins, condition meter HUD, location banner.
- Web Audio chiptune engine with per-stage loop + core SFX; mute toggle.
- `localStorage` save (bests, coins, unlocks, settings).
- PWA install + offline.
- Deployed to GitHub Pages, verified on Mac Safari and iPhone Safari.

**Phase 2 — Full game:**
- Remaining 4 drivers + 6 stages.
- Downtown Kingston hard mode (Tron-influenced neon-grid night stage).
- "Round Jamaica" endless polish + full unlock economy.
- Personas as road traffic/cameos across all stages.
- Additional chiptunes and SFX polish.

---

## 15. Testing approach

TDD on the testable logic (runnable headless, no canvas needed):
- `collision.js` — lane/segment overlap, hit detection edge cases.
- wreck math — damage chips, repair, zero-condition end.
- `spawner.js` — spawn cadence, difficulty ramp, pooling correctness.
- `save.js` — round-trip persistence, first-run defaults, corrupt-data fallback.
- `characters.js` / `stages.js` — config integrity (no missing fields).

Rendering, audio feel, and on-device controls are verified manually on Mac Safari
and a real iPhone (the parts that can't be meaningfully unit-tested).

---

## 16. Open / deferred items

- **Final name** (Pothole Run vs Cyaa Stop Wi vs other) — can be decided any time
  before launch; does not block the build.
- Exact per-driver stat numbers — tuned during implementation playtesting.
- Pause/resume, leaderboard sharing, haptics — explicitly **out of scope** for now
  (YAGNI); revisit only if wanted after Phase 1.
