# Handoff: Pothole Run — context-appropriateness fixes (Batch A done, Batch B queued)
Date: 2026-07-07 19:55

## Done this session (Batch A)
- **Rope lashing replaces the wrench on the river**: new `rope` pickup (hazardTypes.js) reusing `powerup: 'tools'` (identical heal + steady window); bog-walk weights swap `tools`→`rope`; game.js toolMult spawn-tune covers both; legend entry "Rope Lashing — raft repair (river)"; sprite = face-on sisal coil ring (radial twist strands, trailing working end) over a bamboo slat — gallery-verified. New `tests/rope-repair.test.js` (3 tests) pins: same powerup, river-has-rope-never-tools / road-has-tools-never-rope, legend presence.
- **Weed is now a ganja PLANT** (sprites.js `weedBud`): stalk + three tiers of serrated 7-finger fan leaves (darker low, bright crown) — the iconic silhouette, gallery-verified.
- **Context sweep fixes**: roadkill impact dust puff becomes a WATER SPLASH (foam rings + droplets) on river stages (`drawRoadkill(..., water)` param, game.js passes `stage.river`); street vendor fruit + hot street food (ackee/patty/plantain/breadfruit) no longer spawn mid-river (gated in game.js activeWeights — drinks/negatives still float like litter, deliberate).
- Suite: **383/383** green. sw.js still at v47 — bump once when Batch B lands.

## Earlier same day (see 2026-07-07-gorge-overhaul-sideswipe-tracker.md)
Gorge overhaul, side-swipe traffic, high scores, contextual game-over titles, bleach merge, tyre-swing divers, rockfall, Holland Bamboo poles removed, unripe ackee red closed pod, full glitch sweep (clean).

## Open items (Batch B — queued next, Milton's improved prompt)
1. **Politician river injustices**: on river stages the `lightpole` negative must NOT spawn; add contextual cash-burn negatives instead — construction waste-water dumping + beach-access-rights protest (sprites, legend, ELIGIBLE gating by stage, tests).
2. **Dog → Jamaican mongrel** redesign (research references online first).
3. **Power-up glow**: pulsing halo around cart/driver while shield (`fx.steady`?) / invincibility (`fx.super`) is active — check which effects count as "shield".
4. Deploy after Batch B: bump sw CACHE to v48, `npx wrangler pages deploy .` (Milton).

## Context for next session
Repo `/Users/miltonfoster/Documents/Claude/Projects/pothole-run`, `node --test` = 383 green, preview on port 8125 (tap twice after reload; tab-background rAF freeze quirk). Negatives spawn via `negativesFor(ch)` in game.js activeWeights — that's where river gating for lightpole goes.

## Quick-start
Start a new session and say:
"Read /Users/miltonfoster/Documents/Claude/Projects/pothole-run/docs/handoffs/2026-07-07-context-fixes-batch.md and let's continue from there."
