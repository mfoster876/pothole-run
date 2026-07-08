# Handoff: Pothole Run — context-appropriateness fixes (Batch A done, Batch B queued)
Date: 2026-07-07 19:55

## Done this session (Batch A)
- **Rope lashing replaces the wrench on the river**: new `rope` pickup (hazardTypes.js) reusing `powerup: 'tools'` (identical heal + steady window); bog-walk weights swap `tools`→`rope`; game.js toolMult spawn-tune covers both; legend entry "Rope Lashing — raft repair (river)"; sprite = face-on sisal coil ring (radial twist strands, trailing working end) over a bamboo slat — gallery-verified. New `tests/rope-repair.test.js` (3 tests) pins: same powerup, river-has-rope-never-tools / road-has-tools-never-rope, legend presence.
- **Weed is now a ganja PLANT** (sprites.js `weedBud`): stalk + three tiers of serrated 7-finger fan leaves (darker low, bright crown) — the iconic silhouette, gallery-verified.
- **Context sweep fixes**: roadkill impact dust puff becomes a WATER SPLASH (foam rings + droplets) on river stages (`drawRoadkill(..., water)` param, game.js passes `stage.river`); street vendor fruit + hot street food (ackee/patty/plantain/breadfruit) no longer spawn mid-river (gated in game.js activeWeights — drinks/negatives still float like litter, deliberate).
- Suite: **383/383** green. sw.js still at v47 — bump once when Batch B lands.

## Earlier same day (see 2026-07-07-gorge-overhaul-sideswipe-tracker.md)
Gorge overhaul, side-swipe traffic, high scores, contextual game-over titles, bleach merge, tyre-swing divers, rockfall, Holland Bamboo poles removed, unripe ackee red closed pod, full glitch sweep (clean).

## Done (Batch B)
- **Politician river injustices**: `lightpole` AND `roadfix` are now `roadOnly` — never on the river; new riverOnly cash-burn negatives `wastewater` "Waste-Water Dump" (350k — drum-float + corrugated pipe gushing a murky plume) and `protest` "Beach Rights Protest" (200k — three placard-raising protesters in the shallows). `negativesFor(character, stage)` is stage-aware; game.js passes the stage. Sprites gallery-verified; negatives tests respec'd + new stage-aware test.
- **Dog = Jamaican BROWNIE** (per Milton's follow-up): the island's classic yard mongrel — solid short warm-BROWN coat (no bib), smallish terrier-ish build, lean high-carried body, rib shading, long legs/muzzle, cocked ears (one tip-kinked), thin curled-up tail; roadkill palette synced. Refs: Caribbean potcake type + Jamaica Observer's "Brownie" (small, short brown/tan coat, the most common mongrel).
- **Supercharge glow**: pulsing golden halo + rim ring wraps driver + ride while `super` (water/fruit invincibility) is active; blinks fast in the last 1.2 s as a drop warning. (`game.js` beside drawCart. Only `super` grants invincibility in resolveHits — `steady` is steering, not a shield.)
- Suite **384/384**; headless 10-min/stage sim re-run clean; sw.js → **v48**.

## Done (late add)
- **Animal roadkill split from the human ledger**: hitting an animal (goat/dog/cat/cattle/croc) now counts ONLY on a new `run.roadkill` tally — no police heat, no run-over ledger (people unchanged: heat + "smaddy" toast). Separate counter surfaces three ways: "ROADKILL ×N" under the HUD speed readout, its own "Roadkill! ×N" toast, and an amber game-over line with `save.lifetimeRoadkill` (both tallies tighten into one band when they co-appear so the bust warning keeps clearance). Tests respec'd (heat cap now uses people) + new animal-roadkill test → suite **385/385**, sim clean.

## Open items
1. Deploy: `npx wrangler pages deploy .` (Milton) — sw v48 hard-swaps phones.
2. Eye-tests (Milton): the glow in motion (grab a water bottle), first river run as the Politician (wastewater/protest spawns), mongrel + new sprites at road scale, the HUD/game-over roadkill counters after flattening a goat.

## Context for next session
Repo `/Users/miltonfoster/Documents/Claude/Projects/pothole-run`, `node --test` = 383 green, preview on port 8125 (tap twice after reload; tab-background rAF freeze quirk). Negatives spawn via `negativesFor(ch)` in game.js activeWeights — that's where river gating for lightpole goes.

## Quick-start
Start a new session and say:
"Read /Users/miltonfoster/Documents/Claude/Projects/pothole-run/docs/handoffs/2026-07-07-context-fixes-batch.md and let's continue from there."
