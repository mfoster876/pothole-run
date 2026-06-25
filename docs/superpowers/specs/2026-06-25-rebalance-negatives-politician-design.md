# Rebalance, Negatives Framework, Police & Politician — Design

Date: 2026-06-25
Status: building (this pass, all of it)

This pass bundles several owner requests into one coherent build. The unifying
idea: **the chosen driver is a difficulty/reward dial**, and most new "threats"
share one mechanism (a non-collectible, character-gated road object that bites on
contact — losing money and/or condition, or impairing steering).

## 1. Risk/reward rebalance (per character)

Reckless drivers should reach a HIGHER reward ceiling, but cash should be
frustratingly hard to *find* and to *collect*. Smooth drivers get frequent,
easy, smaller money. Implemented with three knobs (no arbitrary value
multipliers, so the strict $100/500/1000/2000/5000 bill ladder is preserved):

- `cashFind` — multiplier on the `coin` spawn weight (how OFTEN money appears).
- `billBias` — integer ladder-shift on each spawned note (reckless → bigger notes
  when they do appear; uses `nextBill` stepping, stays on the strict ladder).
- `coinDraw` (existing) — collection magnet half-width (reckless → smaller, so
  even visible money is harder to scoop).

Reward ceiling for reckless also rides the existing higher `scoreMult`.

| driver     | cashFind | billBias | coinDraw | scoreMult | feel |
|------------|----------|----------|----------|-----------|------|
| yute       | 1.0      | 0        | 1.05     | 1.0       | baseline |
| rasta      | 1.35     | 0        | 1.4      | 1.0       | smooth, easy small money, low ceiling |
| conductor  | 0.5      | 1        | 0.8      | 1.35      | reckless: rare, big, hard-to-grab notes, high ceiling |
| politician | 1.0      | 0†       | 1.6      | 1.2       | own economy (mostly $5000) |

† politician money is handled specially (see §4).

## 2. Negatives / detractors framework (`negatives.js`)

One module powers yute temptations, rasta avoidances, AND the politician's
money-pit "responsibilities". Each negative is a NON-collectible, character-gated
road object. On contact (when not invincible) it applies any of:

- `damage`   — flat condition damage (% of max), independent of toughness.
- `drainPct` — fraction of *current* coins lost (proportional to earnings).
- `impair`   — sets `cart.tipsy` magnitude + a few seconds of `effects.tipsy`.
- `blessingLoss` — zeroes the run's tithe-blessing resilience.

Eligibility (only these spawn for that driver):
- **yute**: bleaching, tightpants, weed, molly, teensex (teenage sex drains ~92%
  of money — "almost all").
- **rasta**: obeah, pork (blessingLoss), jw.
- **politician**: roadfix, constituent, lightpole, hustlerlunch, voter, contractor
  — all `drainPct` only (no condition damage; he shrugs off the physical world).

Routing: HAZARD_TYPES entries carry `negative:'<id>'` and `damage:0`; `run.js`
calls `applyNegative` in the damage branch. Invincibility (`super`) skips them.

## 3. Police spawn-threat (urban-frequent)

New `police` hazard: condition damage (traffic-tier) + a cash fine on contact.
Weighted into stages by area — frequent in New Kingston (urban), occasional in
the rural stages. The full stop-and-interrogate "Right/Left? (risk vs bribe)" +
traffic-court subsystem remains its own next arc (already specced separately).

| stage           | setting | police weight |
|-----------------|---------|---------------|
| new-kingston    | urban   | 3 |
| negril          | tourist | 2 |
| fern-gully      | rural   | 1 |
| holland-bamboo  | rural   | 1 |

## 4. The Politician (extract money, dodge responsibility)

Unlocked with loads of money. Plays as a near-immune money magnet whose only real
risk is being forced to spend.

- **Money almost exclusively $5000.** ~85% of his notes are $5000 (rest big).
- **Paved roads.** Pothole/manhole spawn weights cut (~×0.4) — fewer craters. But
  potholes/manholes still hit at FULL damage (no immunity there).
- **Immunities (data-driven via hazard `category`).** Immune to `police`,
  `pedestrian`, and `animal` categories (no damage, no fine, plows through).
  `damageScale.traffic = 0.5` (half damage from other cars).
- **Responsibilities (his negatives).** roadfix / constituent / lightpole /
  hustlerlunch / voter / contractor — each drains a % of current coins. These
  spawn fairly often for him, so the challenge is dodging expenditure.

Net: earns loads easily, but the drain obstacles can erase it — "get as much
money out of the system as possible without incurring expenditure by avoiding
responsibilities."

Costume (handled by the visual pass): half-orange/half-green suit + British court
wig.

## 5. Clearer notifications

A transient centre-screen pickup TOAST names the specific item collected
("CAKE SOAP", "LASCO SHAKE", "TING", "WATER"…) instead of a generic "irie boost".
Negatives flash a red toast ("BLEACHING!", "TEENAGE SEX — money gone!"). The
supercharge bar keeps its source label.

## 6. Legend screen

A LEGEND button on the driver-select (start) screen opens a per-driver legend:
the pickups that help THIS driver (shared water/tools/coffee + their drinks +
their items) and the negatives they must avoid. Data via `legendFor(character)`.

## Testing
TDD for the logic: `negatives.js` (effects + eligibility), rebalance fields +
billBias/cashFind, politician immunities + money, police fine. Plus updates to
config/hazardTypes tests. Visual files validated by `node --check` only (the
headless preview's rAF is parked, so pixels are owner-verified on-device).
