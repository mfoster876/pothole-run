# Handoff: Pothole Run — portrait overhaul, Di Principal, races, river
Date: 2026-07-07 12:05

## Done this session
- **Portrait mode rebuilt as driver's POV**: portrait virtual stage 540→430 wide (fixes the "very very small" fonts — now matches landscape physical size); horizon rises to 0.36H with a 1.3× view scale (`horizonYFor`/`viewScaleFor` in `road.js`, threaded through `scenery.js`); menu/pause/game-over content lays out in a centred 1.55×W band. Fixed the root tap bug (menu/pause hit-rects were computed once at module load — now rebuilt on stage change) plus portrait layouts across hub, legend (stacked single column), mech shop, car dealer, races screen, HUD (two-row gauges + backing strip).
- **Nurse → Di Principal**: new portrait (bun, spectacles, blazer), School Bell (roads-clear) + Extra Lessons Fees pickups, Placement Bribe (cash now, scandal impair) + PTA Meeting negatives; save migration maps old `nurse` id. All portraits now clip busts to their frames.
- **Run-over ledger + police heat** (Milton chose "ledger + heat" card): `run.runOvers`/`run.heat` in run.js, `save.lifetimeRunOvers`; heat multiplies police spawns (×0.6/level) and fines (×0.5/level, cap 5); game-over card shows the toll; roadkill now draws the ACTUAL victim hit (type carried through; broom man falls with brooms + tam, vendor with fruit, etc.).
- **Sprites**: real speed bump (yellow-banded hump), realistic open ackee, readable thatch brooms on the broom man, fully redrawn goat (white/tan patches, alert head, swept horns). New: ripe plantain (island-wide food) + roast breadfruit (rural stages only — `stage.rural` flag, biggest food heal).
- **Races made watchable**: rivals rubber-band around the player (PACK in races.js), visible rivals get nameplates (grudge in gold ★), race panel gained a progress strip (markers + checkered finish) + live grudge callout.
- **Bog Walk is a river now**: `renderRoad(…, river)` draws water glints/muddy banks/no centre line; bamboo raft (`drawRaft` in cartSprite.js) under the vehicle.
- **Quit-to-home**: pause → ✕ QUIT RUN (or `Q`) ends the run properly (banks coins, records best, "RUN PARK UP" gold card). Game-over tap-grace switched to wall-clock (was frozen forever in backgrounded tabs). Auto-pause on visibilitychange. sw.js at **v44** + missing `foods.js` added to precache; dead rotatePrompt.js removed.
- **Dev tools**: `tools/dev_server.py` (no-store — plain http.server serves stale modules and burned us repeatedly; browser HTTP cache poisoning solved by moving preview to port 8125), `tools/sprite_gallery.html` (eyeball sprites without hunting spawns). Tests 350 → **363 pass** (heat, migration, foods, Principal).

## Open items
- **Deploy**: Milton's phone still runs the old build — `npx wrangler pages deploy .` from the repo; v44 SW will swap caches. All his 10:27 complaints (tiny fonts, broken taps) were the un-deployed build.
- Working tree has the last batch uncommitted (races/river/foods/goat/quit + polish); an auto-committer ("potholerun-dev") swept earlier batches as "Improvements".
- Not visually verified (formula-verified only): New Kingston + landscape legend at the new maxWidths; race pause-hint reposition (transient, geometry checked); race-quit DNF path.
- Cart wheels still show on the raft in river mode (sits on the deck — acceptable, could hide wheels later).
- Preview quirk: the Launch panel tab goes `document.hidden` when panel focus changes → rAF freezes mid-test; jolt with preview_resize. Remember for future sessions.

## Context for next session
Everything lives in `/Users/miltonfoster/Documents/Claude/Projects/pothole-run` (vanilla JS canvas PWA, no build). Read `README.md` + this file; run `python3 tools/dev_server.py` + `node --test` (363 green expected). Immediate next step is deploying and having Milton play-test portrait on his actual phone — especially races, Bog Walk, and Di Principal.

## Quick-start
Start a new session and say:
"Read /Users/miltonfoster/Documents/Claude/Projects/pothole-run/docs/handoffs/2026-07-07-portrait-overhaul-principal-races.md and let's continue from there."
