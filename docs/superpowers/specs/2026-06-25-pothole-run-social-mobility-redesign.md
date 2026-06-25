# Pothole Run — "Cyaa Stop Wi": the social-mobility redesign

**Date:** 2026-06-25
**Status:** Approved design, pending spec review → implementation plan
**Builds on:** `2026-06-24-pothole-run-design.md` (the original spec). This document
covers only the *new* layer: a meta-progression spine (lifetime earnings → ranks →
aspirations → bittersweet loop), a healing/power-up overhaul, a difficulty rebalance,
a clean hub of focused screens, and an environment/figure art lift.

---

## 0. Theme (the thing every decision serves)

The game dramatises Jamaican inequality and the feeling that *winning at life is almost
impossible* — without ever being literally impossible. The grind to an "out" is long
and the prices are real; the road is brutal but **always survivable with enough skill**.
The reward for "making it" is **bittersweet**, and the loop continues. Hold this when
resolving any ambiguity below.

---

## 1. Economy: lifetime-earned vs wallet

Two separate counters replace today's single `save.coins`:

- **`lifetimeEarned`** — a monotonic odometer of every dollar ever collected. Never
  decreases. Drives **career ranks**. This is the "progress metric".
- **`wallet`** — spendable balance. Repairs, RIG upgrades, vehicles, Cash Pot plays,
  and aspirations all draw from here.

Both rise together when money is banked at end of run; only `wallet` falls on spend.
In-game money reads as **Jamaican dollars (JMD)** — the large numbers are intentional
and make the inequality legible. `formatMoney()` (money.js) already groups thousands;
reused unchanged.

### Money's role rebalanced
- Coins/cash now **heal only a sliver** in-run. `DAMAGE.repairPerCoin` drops from 4 to
  **1**. Real healing comes from Water, Tools, and the Mech Shop.
- **Alternate more between cash and coins**: reweight `money.js` denomination bands so
  coin ($1–$20) and note ($100+) pickups interleave through mid-distance instead of
  coins drying up early.

---

## 2. Power-ups (collectibles beyond money)

A new module `powerups.js` defines pickup kinds and an **active-effects** record on the
run (each effect a countdown timer in seconds). `run.js` already consumes entities at
the cart plane (`resolveHits`) — power-ups slot in as collectible entity types.

| Kind | Rarity | Effect |
|---|---|---|
| **Water** | Rare | **Full heal** of `cart.condition` + a brief speed/steady boost (~3s). The "quench in the hot sun" lifesaver. |
| **Hardware tools** | **Common** | Repair a chunk (~35% of max) + brief steadiness (~3s). Sprite art swaps by ride: spanner on the handcart, jack/socket set in a car (read `cart.vehicle.isCar`). |
| **Bag of Blue Mountain coffee** | **Very, very rare** | For **10s**: road runs smooth (suppress pothole/bump spawns) **and** the lane floods with `$5000` notes. The jackpot. |

"Brief steadiness" = temporary `stability` bump applied in `updateCart` while the timer
is live (reuses the existing stability path). New SFX in `audio.js`: `water`, `tools`,
`coffee`.

### Sleeping policemen (speed bumps) — a traversal mechanic, not damage
Today bumps deal `DAMAGE.bump`. Redesign: hitting a sleeping policeman **launches the
cart into a short hop** (a `jumpT` timer) during which it **sails over obstacles** —
`resolveHits` skips collision for non-collectibles while airborne. **But** if the hop
ends *on top of* an obstacle's crossing plane, that landing still applies damage. Coins
are still collectible mid-hop (you can grab money over a pothole). Risk/reward.

---

## 3. The fairness rule (solvability guarantee)

Codified in the spawner. **Invariant:** at every spawn row at least one of the 5
`CART_SLOTS` is survivable (a clear lane, or a shoulder — which drains but never
wrecks), AND two consecutive rows may never place their safe slots so far apart that
the cart cannot traverse between them at the current speed (reachability = max lateral
travel per the row's time gap, derived from `cart.speed` and `laneLerp`).

The spawner rejects/rewrites any row that would violate this. The sleeping-policemen
hop is a *second* escape valve layered on top. Result: arbitrarily hard, never
impossible. A `solvability.test.js` asserts the invariant over a long simulated run at
max speed.

---

## 4. Difficulty −20%

Three dials, each ~20% gentler at the **start**, still ramping hard with distance:

- **Flatten the start:** raise `SPAWN.baseInterval` (wider early gaps) and soften
  `SPAWN.ramp` so clutter arrives later.
- **Soften each hit:** trim `DAMAGE` values ~20% (`pothole`, `traffic`, `animal`,
  `bump`-on-landing).
- **Heals come sooner:** water/tools appear earlier and a touch more often in the early
  distance bands.

Exact constants tuned in implementation; the test suite pins the *direction* (early
spawn interval larger than today, per-hit damage lower than today).

---

## 5. Persistent damage + safety valves

`cart.condition` no longer resets to full each run.

- **Carries over:** the run ends at 0; the cart starts the next run at its **saved**
  condition (`save.condition`).
- **40% free floor:** the cart can never be *stuck* below 40%. If saved condition is
  under 40%, each run begins topped up to 40% at no cost — you can always roll out.
- **Guaranteed minimum earnings:** every completed run banks at least a small floor
  amount, so a wrecked run still inches `lifetimeEarned`/`wallet` forward (no hard
  soft-lock). Repairing **above** 40% costs money in the Mech Shop.

Save migration handles the new field additively (see §9).

---

## 6. Screens: clean hub → focused destinations

The single canvas menu in `game.js` is split into a small **screen router** plus one
module per screen (game.js has grown to ~19 KB and mixes menu + loop; this extraction
is in-scope cleanup). Each screen module exports `render(ctx, ...)` and
`hit(x, y) → action`. Router holds `current` screen + a back affordance.

```
hub.js          PLAY · MECH SHOP · CAR DEALER · ASPIRATIONS  (+ rank/lifetime banner)
mechshop.js     Repair to N% (priced) · buy RIG stability upgrades (moved off start menu)
cardealer.js    Window-shop: rides rotating on a turntable; buy/select; prices as today
aspirations.js  The "outs" board (§7) — narrative + price + art per pathway
```

`PLAY` keeps today's driver/stage/genre pickers (those stay simple inline controls on
the play screen). Hub shows current **rank** and **lifetime-earned**. Wave 1 ships hub +
Mech Shop + Car Dealer fully; the Aspirations board is a reachable **stub** in Wave 1
and built out in Wave 2.

---

## 7. Aspirations — the "outs" (Wave 2)

`aspirations.js` defines the ladder; each is purchasable once from the wallet, then
flagged `achieved` in the save. Choosing one triggers a **bittersweet ending** screen
(short, earned, a little melancholy — you got out, but at what cost / who's left
behind), then returns to the **loop** (keep playing; the achievement persists as a
badge). Multiple outs are achievable across a save.

Prices grounded in real JMD values (ascending):

| Aspiration | Price (JMD) | Anchor |
|---|---|---|
| Tithes & Offerings | $1,500,000 | Years of faithful 10% giving — the church/community path |
| Education (UWI/UTech degree) | $3,000,000 | A full undergraduate degree, all-in after subsidy |
| Visual Artist | $4,000,000 | Studio, materials, first gallery exhibition |
| Open a Business | $5,000,000 | Small shop/salon startup + stock |
| Musician / Studio Time | $6,000,000 | Pro single→EP: studio hours, video, promo |
| Migrate / Fly Weh | $7,000,000 | Visa, airfare, resettlement abroad |
| Agriculture | $10,000,000 | A few acres + equipment + first crop |
| House inna di Hills | $50,000,000 | Uptown KGN home (Beverly Hills/Jacks Hill) |
| Hotel / Beachfront | $250,000,000 | Boutique beachfront property (Negril/Ochi) |

**Cash Pot** (separate, a gamble sink — not an "out"): pay-to-play draws from the wallet
with real fixed odds and a published payout table. Net house edge so it's a *temptation*,
not a reliable income — reinforcing the theme.

---

## 8. Career ranks (Wave 2)

`ranks.js` maps `lifetimeEarned` → rank. Proposed thresholds (tweakable):

`Cart Bwoy $0 → Road Hustler $250k → Corner Smalls $1M → Big Tings $5M → Uptown $25M →
Don Dadda $100M`. Rank shows on the hub banner and on the game-over card.

---

## 9. Save migration (additive, no wipe)

Bump key to `pothole-run-save:v2`, but **read v1 too**. `loadSave` already merges over
`defaultSave()`; extend it:

- New fields: `lifetimeEarned`, `wallet`, `condition` (0–100), `bounties`,
  `aspirations: { achieved: [] }`.
- **Migration:** if a v1 save is found, initialise `wallet = coins`,
  `lifetimeEarned = coins` (best-effort seed), `condition = 100`, empty bounties/
  aspirations. Keep `coins` readable for one version as a fallback. **No progress is
  wiped** — garage, upgrades, bests, unlocks all carry forward untouched.
- Corrupt-data path still falls back to `defaultSave()`.

---

## 10. Session hooks (Wave 1)

- **Near-miss combo multiplier:** in `run.js`, when a non-collectible is dodged by a
  small margin (`laneOverlap` near the edge), increment a combo that multiplies the
  *next* money pickups; a hit resets it. Surfaced on the HUD.
- **Rotating bounties:** `bounties.js` holds 3 active missions (e.g. "bank $X this run",
  "dodge N taxis", "reach Ym"). Completing one banks a reward and rolls a fresh bounty
  in its place. Shown on hub + a compact HUD line.

---

## 11. Conductor face redesign (Wave 1)

The Bleachaz Conductor depicts real Jamaican skin-bleaching — render **authentically,
not as caricature**. In `cartSprite.js`/`sprites.js`: **white/bleached face**, **black
lips with a pink centre**, **tattoos on the lighter-skinned neck**, and a **black
(un-bleached) arm** — the bleach contrast that makes the phenomenon visible. Same warmth
and dignity as the other personas.

---

## 12. Responsive: landscape fix + portrait prompt (Wave 1)

- **Landscape cut-off (Android):** fix viewport scaling so the 960×540 virtual stage is
  letterboxed and centred (contain-fit) rather than pinned left and clipped right.
  Touch in `main.js` canvas sizing + `index.html` viewport meta.
- **Portrait prompt:** when the viewport is taller than wide, overlay a rotate icon and
  cycle three patois lines: *"Tun yuh phone sideway"* · *"Set yuh phone good, like so"* ·
  *"A nuh suh yuh fi hol yuh phone"*. Gameplay pauses behind it until rotated.

---

## 13. Environment & figure lift (Wave 3)

- **Fern Gully much denser:** layer multiple fern-bank rows + a darker canopy so it
  reads as a deep shaded gorge, not sparse clumps. (`scenery.js` `fernTree`/render
  loop — more rows, overlap, depth tint.)
- **New Kingston landmarks:** recognisable roadside silhouettes — Emancipation Park's
  *Redemption Song* statue (rendered respectfully), Jamaica Tourist Board, Island Grill,
  patty shops, banks (NCB/Scotia towers), BPO call-centres, cafés. New `scenery` kind(s)
  for the `new-kingston` stage.
- **Richer environments overall:** more prop variety and layering across all stages.
- **Less-blocky people & animals:** the "12-bit" figure lift — smoother silhouettes and
  more shading steps on drivers, pedestrians, and animals.
- **Cameos & road life:** night-Fern-Gully Rolling Calf, Usain Bolt blur, Miss Lou
  matriarch, roadside busker; school-children crossing set-piece, sunroof influencers,
  di convoy, goat inna di Probox, nine-night procession.
- **Secret:** title-screen tap-code unlocks a gold-handcart skin.

---

## 14. Wave plan (build order)

**Wave 1 — Playability (build + push now):** §1 economy split + money rebalance · §2
power-ups (water, tools, coffee) + sleeping-policemen hop · §3 solvability guarantee ·
§4 difficulty −20% · §5 persistent damage + floor + min earnings · §6 hub + Mech Shop +
Car Dealer (+ Aspirations stub) · §10 combo + bounties · §11 conductor face · §12
landscape fix + portrait prompt · §9 save migration.

**Wave 2 — Social-mobility spine:** §7 Aspirations board + Cash Pot · §8 ranks ·
bittersweet endings + loop.

**Wave 3 — Environment & figure lift:** all of §13.

---

## 15. Testing

Pure-logic modules keep `node:test` coverage: `economy` (lifetime vs wallet,
migration), `powerups` (effect timers, tool art by ride, coffee window), `run` (combo
increment/reset, hop skips collision but landing damages), `solvability` (invariant over
a long max-speed sim), `aspirations`/`ranks` (thresholds, purchase gating), `save`
(v1→v2 migration preserves garage/upgrades/bests). Rendering/responsive verified in the
preview. After any deploy, bump the service-worker `CACHE` string, then verify in the
preview with SW + caches + localStorage cleared (the SW is network-first, bumped per
deploy).
