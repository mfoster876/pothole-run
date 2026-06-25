# Police Stops & Traffic Court — design spec (build brief)
Date: 2026-06-25
Status: APPROVED (decisions locked via AskUserQuestion). Ready to build on a fresh context.

A funny "Babylon pull-you-over" subsystem layered on the existing run loop. Make the
copy patois and comedic throughout.

## On the road — the stop
- A **police officer** spawns occasionally as a road entity (rarer early, more likely
  deeper / at higher speed). It already has sprite scaffolding: `cartSprite.js` has a
  `police` head (navy cap + gold badge) and `shirtColor.police`.
- **Direct contact** with the officer = you're pulled over: the run pauses into a
  **STOP screen** (a new game `state.mode === 'stop'`, like the gameover overlay).
- **Politician immunity:** if the driver is `politician`, the cops wave him through —
  no stop triggers at all (diplomatic immunity). Expose `isImmune(character)`.

## The shakedown — "Right or left, driva?"  (DECISION: guess sets the stakes)
1. The officer barks **"Right or left, driva?"** — two buttons, LEFT / RIGHT.
2. The pick **randomly reveals the shakedown** (weighted by vehicle — worse in a car):
   - Handcart / cheap ride → minor: "Mi did see yuh a speed!" → small bribe or small fine.
   - Car → can escalate: "Weh yuh registration / fitness?" → heavy fine OR **confiscation**.
   - Either → "Di whole squad hungry" → you're buying lunch for the WHOLE squad (a
     multiplied bribe that eats your budget).
3. Then the player chooses their response:
   - **Buy him a lunch** (bribe) — pay now from wallet, settles instantly. (Squad = bribe × N.)
   - **"Cha, write di ticket"** (risk) — the fine goes on your **court tab** (`save.fines`)
     and you keep driving. BUT on a confiscation-tier stop in a car, refusing means he
     **takes the vehicle**: remove it from the garage and revert `save.vehicle` to
     `handcart` — you must repurchase it.
   - If you can't afford the bribe, only the risk option is available.

## Traffic Court — start-menu screen
- New hub button → **TRAFFIC COURT** screen showing your outstanding `save.fines`.
- **Days progress:** each run played = a day. At run start, if `fines > 0`, increment
  `courtDays` and add a **late fee** (e.g. +10%/day). Leave it too long → a **warrant**.
- **Pay fines** down from wallet on the court screen.
- **Jail (DECISION: sit out OR post bail):** a warrant **blocks your next run** until you
  either **serve the time** (skip a run — clears the warrant) or **post bail** (lump sum
  from wallet — clears it immediately). Pressing PLAY with a warrant routes to court/jail.

## Money rule
All bribes, fines, bail, purses MUST be strict bills: **$100 / $500 / $1000 / $2000 /
$5000** (see `money.js` `BILLS`). No in-between amounts anywhere player-facing.

## Build order (incremental, each commit green)
1. **Logic core (TDD):** `save.js` schema (`fines`, `courtDays`, `warrant`); `police.js`
   (`rollStop(vehicle, side, rng)`, `settle(save, scenario, choice)`, `isImmune`);
   `court.js` (`passDay`, `payFines`, `postBail`, `serveTime`, `blockedByWarrant`,
   late-fee + warrant thresholds in `constants.js`).
2. **Screens (canvas contract):** `screens/stop.js` (the pull-over: Right/Left → reveal →
   bribe/risk), `screens/court.js` (fines list, pay, bail/serve). Hub button + routing.
3. **Wiring:** police road entity + spawn weight; contact → `state.mode='stop'`;
   `passDay` at run start; warrant gate on PLAY; politician immunity; SW precache + bump.

## Open/tunable (sensible defaults, Milton can adjust on sight)
- Bribe ≈ $500, squad ×3–5; car fines $1000–$5000; bail ≈ outstanding × 1.5; warrant at
  ~3 unpaid days or fines > ~$5000; police spawn weight ~1.5 (rural/town vary later).
