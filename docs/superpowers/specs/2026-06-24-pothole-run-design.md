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

**Driver stats — distinct, not subtle.** Each driver should play *noticeably*
differently. Stats span: top speed, handling (steering responsiveness / how loose
the cart slides), cart toughness (damage taken per hit), and coin draw (pickup
magnet radius / coin multiplier). Drivers are archetypes with real trade-offs, not
near-identical clones — but each is *viable* in skilled hands.

**MVP roster (3) — concrete archetypes:**

| Driver | Archetype | Top speed | Handling | Toughness | Coin draw |
|---|---|---|---|---|---|
| **School Yute** | Balanced / beginner — the "learn the game" pick | Mid | Tight & forgiving | Mid | Mid |
| **Rasta Musician** | Cool & steady — economy player | Low–mid | Smooth | High | High (big magnet) |
| **Bleachaz Conductor** | **Reckless** — high risk / high reward | **Highest** | **Loose & twitchy** (hard to control, oversteers) | **Fragile** (takes extra damage) | High (score/coin multiplier as the payoff for surviving) |

The Conductor is the adrenaline pick: blistering speed and a scoring bonus, but the
cart is hard to keep straight and shatters fast — built for players chasing top
scores, punishing for beginners.

Remaining 4 personas unlock via progression, each its own distinct archetype
(e.g. Police = sturdy/slow tank, Taxi Man = fast/aggressive lane-weaver).

---

## 7. Environments — stage-select + endless

Ten locations, each with its own palette, hazard mix, and chiptune:

Fern Gully · Holland Bamboo · Coronation Market · Montego Bay Pier 1 ·
Negril 7-Mile Beach · Portmore back road · Old Hope Road · Norbrook · Cherry Gardens ·
Bog Walk Gorge (Flat Bridge)

**Bog Walk Gorge (Flat Bridge)** is the **set-piece "gauntlet"** stage: a narrow road
squeezed between the Rio Cobre and a sheer cliff, with falling boulders, rockslides, a
rising river that floods the road, and the infamously low, railing-thin Flat Bridge as a
one-lane pinch. Intense and memorable — a natural second challenge stage alongside the
Downtown hard mode.

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
- Remaining 4 drivers + 7 stages (incl. Bog Walk Gorge / Flat Bridge gauntlet).
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

## 16. Authenticity & hazard grounding

Full reference: [`docs/superpowers/research/2026-06-24-jamaica-environment-research.md`](../research/2026-06-24-jamaica-environment-research.md).
Stages and hazards are drawn from real Jamaican reporting, not invented. Key takeaways
that bind the build:

**Signature recurring mechanic — the stripped road (scrap-metal theft).** This is the
game's distinctive, true-to-life hazard family and a thematic throughline (the *reason*
the road is so deadly). Grounded in NWA / Road Safety Unit reporting (~36 signs stolen
in Portmore 2012–14; manhole/water-meter covers, guardrails, even bridge rails off
Washington Boulevard, all sold for scrap). In-game it appears as:
- **Open manholes / missing drain covers** — black instant-fail pits, deadlier than a
  pothole, sometimes mid-lane with no warning.
- **Sign-stripped junctions** — a bare metal stub where a stop/keep-left sign was, so
  cross-traffic (a route taxi) appears with no warning.
- **Missing guardrails** on cliff/bridge/hill edges — nothing between the cart and the
  drop (Negril West End, hill bends).
- **Cut street-light poles** — the in-world justification for dark night stages.
- Optional roadside vignette: a **scrap-thief NPC** sawing a rail / dragging a cover.

**Telegraphing via improvised markers.** Because real signs are gone, Jamaicans mark
craters with what's to hand — a **branch jammed in the pothole**, a ring of
**rockstones**, a **breeze-block**, an old tyre. In-game these *telegraph* a crater just
ahead, rewarding players who read the verge (and can be used for the occasional fake-out).

**"Craters," not potholes.** Reporting calls them craters and the road a "moonscape" —
useful register for naming and for the pothole art (sharp black shadow lips, mismatched
patch scars, wavy undulating asphalt, white marl ribbon roads).

**Flavour vocabulary to use** (HUD, signage, character barks): *crater, sleeping
policeman* (speed bump), *robot/route taxi* (red plates), *yeng-yeng* (motorbike swarm),
*higgler* (market vendor), *JUTC bus + conductor*, *zinc fence*.

**MVP stage grounding (the 3 we ship first):**
- **Fern Gully** — green fern-tunnel with dappled light; hazards: overturned paint truck
  + slick, sudden river-flood across the road, wet shadow patches, vendor-stall pinch.
- **Holland Bamboo** — golden bamboo arch; hazards: stray goats/cattle, schoolchildren
  crossing (Holland Primary zone), speeding oncoming bus on the straight, fallen bamboo
  culms, washboard surface.
- **Negril 7-Mile + West End** — leaning palms / sunset / cliff lighthouse; hazards:
  road narrowing where erosion ate the shoulder, **missing-guardrail cliff drop**,
  pothole field, hustler stepping into the lane, route-taxi dead-stop, darting
  pedestrian, stray goat.

**Hazard tiers for the spawner** (`spawner.js` reads these): *common* = craters, goats,
DIY speed bumps, marker-telegraphed craters, fare-stopping taxis; *mid* = open manholes,
missing-guardrail edges, darting dogs, yeng-yeng swarm, breakdown squeeze, JUTC bus;
*set-piece* = cattle-herd crossing, flood-hidden craters, blind-corner head-on taxi.

---

## 17. Open / deferred items

- **Final name** (Pothole Run vs Cyaa Stop Wi vs other) — can be decided any time
  before launch; does not block the build.
- Exact per-driver stat numbers — tuned during implementation playtesting.
- Pause/resume, leaderboard sharing, haptics — explicitly **out of scope** for now
  (YAGNI); revisit only if wanted after Phase 1.
