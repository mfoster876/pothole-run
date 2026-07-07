# Handoff: Road-safety overhaul + Jamaican landscape
Date: 2026-06-26

## Done this session (pushed to main as potholerun-dev)
Two commits on top of the click-fix (5211c8c):
- **3989bd3 — Road-safety overhaul.** Speed-degrades-control (CONTROL curve in cart.js,
  bites only above a calm cruise, no upgrade offsets it); km/h speedometer in hud.js (red
  over 50); road signage in new `src/signs.js` (speed roundels + fatality billboards,
  `JA_ROAD_DEATHS=400` centralized — Milton to confirm exact figure); asymmetric L/R verges;
  graphic run-overs (drawRoadkill in sprites.js + run.js flag + game.js gore/thud);
  banged-up vehicles by tier/type (vehicleDamage in cartSprite.js); per-damage vehicle
  sounds (clatter/knock in audio.js, condition-aware in game.js); Boom→black. SW v34.
- **023119c — Jamaican landscape.** Horizon mountains + one consistent sun (drawHorizon in
  scenery.js, LIGHT in constants.js, cart shadow offset in cartSprite.js); Fern Gully is the
  twistiest/hardest (per-stage curveMult in stages.js, setCurveScale/curvatureAt in road.js,
  corner-pull in game.js update); billboard text width-fit. SW v35.
- **0b874ca — Safety-sim tuning.** De-gored run-overs (dust puff + dazed "seeing stars",
  no blood); thinned signage cadence (~2 features per 18 rows/side); GREEN NRSC billboards;
  fatality facts grounded in The Gleaner (current to Jun 2026) — JA_ROAD_DEATHS=373 (2025
  actual), plus a "down in 2026" hopeful line (~29% lower YTD). SW v36.
- 327 tests green (control-speed, mechshop-tuning, winding-road suites added).

## Open items
- **Fatality figure RESOLVED**: `JA_ROAD_DEATHS=373` / `JA_DEATHS_YEAR=2025` in src/signs.js,
  Gleaner-sourced. Update both if you want a newer figure.
- **On-device pass owed**: all visuals/audio (signs, run-over gore, banged-up panels, black
  Boom, mountains, sun direction, per-damage sounds) and the FELT corner-pull / control-loss
  are unverified by eye — headless rAF is parked, so I verified via tests + stub-render +
  headless integration only. Tune Fern's `curveMult` (1.8) and `CONTROL`/`CURVE` constants
  to taste after playing.
- Optional further mech-shop extortion (fitness certificate, tow fee) — easy on the
  bust/re-fit foundation now in place.

## Context for next session
Repo: github.com/mfoster876/pothole-run · dir: Projects/pothole-run · all commits anonymous
(potholerun-dev; never put "Milton" in a tracked file). Run `node --test` (327 green).
This handoff stays UNTRACKED.

## Quick-start
"Read docs/handoffs/2026-06-26-roadsafety-landscape.md and let's continue."
