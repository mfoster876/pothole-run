# Handoff: Pothole Run — gorge overhaul, side-swipe traffic, high scores, wiper rework
Date: 2026-07-07 18:20

## Done this session
- **Unripe ackee poison** (earlier arc, committed 43e57ef): universal negative for every driver — closed-pod sprite, 20% condition hit + 7s dizzy haze (`NEGATIVE.poisonSecs`), legend AVOID warning.
- **Visual/menu/music arc** (committed 278255f): billboard near/far desync (`msgShift`), filled feather-frond ferns, reggae speaker box on the cart, minted coins, animated hub menu (parallax/sun/clouds/road/bobbing cart), Fern Gully fully DE-SIGNED (no billboards/roundels/posts — Milton's call), audio.js real harmony (maj/min/dom7 triads, per-genre progressions, verse×2→chorus→verse→BRIDGE→chorus form). sw.js → v45.
- **High-score tracker**: `save.bestTakes` per stage + `recordBest/recordBestTake` return new-record flags; game-over card pulses "★ NEW DISTANCE/MONEY RECORD ★" (gold records line); stage picker shows "★ <stage> record: Xm · best take: $Y" in the footer band (mid-column collides — don't move it back). Cars redesigned in `drawCar` (paint gradient, glowing two-tone tail-lights, bumper, framed plate, exhausts, SUV/wagon roof rails + wiper, mirrors).
- **Gorge overhaul** (Milton's big batch, all verified in-browser):
  - Raft-only river: `RAFT` pseudo-vehicle in vehicles.js (not on dealer ladder), forced in startRun for `stage.river`, `drawRaftsman` (standing rider + punting pole + Jamaican-flag mast) in cartSprite.js; raft skips ground shadow AND vehicleDamage overlay (both floated over water as glitches — fixed). Race path also forces raft (startRace→startRun). maybeBustPart skipped on river runs.
  - Swimmers (`swimmer` hazard: walk+pedestrian → ledger/heat; kid/adult + rasta-mesh/white-merino variants by seed) in bog-walk weights; crocs HOME on cart.x (`home: 0.55` via `advance(field, dz, dt, targetX)`, only while z>0).
  - River Mumma variants by seed: 4 skin tones, busty (50%), dread sirens whose locks render as appealing ropes at distance but SNAKES (heads/eyes/fangs) at s≥30 close pass.
  - Real water: deep-channel tint + bank foam seams + position-driven shimmer in road.js; RAPIDS (`RIVER = {calmLen:250, rapidLen:140, rapidSpeed:250, density:1.9}`): forced pace via updateCart override, ~2× spawn density, obstacle-only pool (`rapidsWeights`), overrides coffee/clearRoads windows, "RAPIDS — hold on!" toast, whitewater chop rendering (`rapids` param on renderRoad, smoothed `rapidsVis`).
- **Traffic**: `len` on bus/taxi/coaster/coconutcart (300/150/220/160); pass is a WINDOW in resolveHits — nose one-shot head-on, mid-pass lane overlap = SIDE-SWIPE (`SIDESWIPE.frac` 0.45 + shove, toast); entities retire at `-40 - len`. Visual roof extension (`vehicleBodyExtension`) so they read long.
- **New Kingston**: fruit 0.4× (`stage.fruitMult`), broomman removed, wiper = charge-ONLY (damage 0, `noRunOver` — no roadkill/heat; test updated to the new spec).
- Tests **363 → 380 pass** (raft ×3, side-swipe ×4, homing/swimmer ×3, records ×3, signs ×2, negatives ×3, wiper/broomman spec updates). `game.cart` getter exposed for headless tests.
- **Late batch (post-checkpoint)**: contextual game-over titles (RAFT CAPSIZE! / BIKE DROP YUH! / CAR-TRUCK-CART MASH UP! by `cart.vehicle.sprite`); Conductor's toothpaste+currypowder MERGED into `blchmix` "Bleaching Creme Ingredients" + new `blchtub` "Bleaching Cream" (same tub as the Yute's — old ids gone from NEGATIVES/ELIGIBLE/sprites/tests); rare `tyreswing` river obstacle (weight 0.6, pedestrian — 3 seed poses: standing on tyre / head-first dive / splash + empty tyre); `rockfall` hazard in Fern Gully (weight 1.5 — dusty fresh-fallen boulder + scattered stones). All sprites probe-verified. sw.js → **v46**.

- **Glitch-sweep batch (evening)**: Holland Bamboo now `poles: false` (bamboo arch only — no light posts/lines; verified via scenery still-frame); unripe ackee redesigned per Milton — FULL RED shell, sealed seams, black seed tips barely poking through (no arils), negatives colour synced to `#c23a24`; verified in the sprite gallery. Full glitch hunt: code-audit subagent over collision/flow/stages/sprites/save/audio (clean — its one "canvas leak in drawRoadkill" finding was a FALSE POSITIVE: the animal branch's restore at sprites.js:1974 closes the outer save, both paths balanced), 380/380 tests, and a headless 10-sim-minutes-per-stage drive (update+render every frame, wrecks+restarts) on all 5 stages — zero exceptions. sw.js → **v47**.

## Open items
- **Deploy** (Milton): `npx wrangler pages deploy .` — phone still on the old build; sw v46 hard-swaps everything.
- Contextual game-over title verified in code only (a deliberate live wreck is slow with the tab-freeze quirk) — glance at it on the first real wreck.
- **Ear/eye tests** (Milton): music (bridges/chord changes per genre), rapids feel + difficulty (`RIVER` constants are the knobs), side-swipe damage feel (`SIDESWIPE.frac`), mumma snake-dread threshold (s≥30).
- Rapids verified by logic + still-frame rendering (calm vs rapids side-by-side), NOT by a live playthrough — the preview tab's rAF freezes when panel focus changes, so a 250m drive wasn't reachable headlessly. First live rapids run is Milton's.
- Working tree has the gorge/side-swipe/tracker batch uncommitted unless the auto-committer swept it (check `git status`; earlier batches landed as 43e57ef/278255f).
- Swimmer/mumma/raft sprites verified in probe canvases + one live calm-river run; swimmers/crocs not yet SEEN spawned live (weights are in, spawn logic is the tested shared path).

## Context for next session
Everything in `/Users/miltonfoster/Documents/Claude/Projects/pothole-run` (vanilla JS canvas PWA). `python3 tools/dev_server.py` (port 8125, no-store) + `node --test` (380 green). Preview quirks: first canvas tap after a reload gets swallowed (tap twice), and the Launch-panel tab backgrounds → rAF freezes (jolt with preview_resize). Next: bump sw to v46, deploy, Milton play-tests the gorge (rapids/swimmers/mumma), the side-swipe feel, and the music.

## Quick-start
Start a new session and say:
"Read /Users/miltonfoster/Documents/Claude/Projects/pothole-run/docs/handoffs/2026-07-07-gorge-overhaul-sideswipe-tracker.md and let's continue from there."
