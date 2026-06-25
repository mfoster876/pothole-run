# Pothole Run — Wave 3 (Environment & Figure Lift) Plan

**Date:** 2026-06-25
**Status:** Split build. Part A (objective, no aesthetic sign-off needed) built overnight.
Part B (reference-gated JA look/feel) is documented here and **awaits the owner's reference
photos / sign-off** per his non-negotiable authenticity bar.

Spec: §13 of `2026-06-25-pothole-run-social-mobility-redesign.md`.

---

## Why this wave is split

the owner's standing, repeated, non-negotiable rule: **the Jamaican look & feel is built
from his reference photos, not invented by an agent.** Past corrections (narrow 2-lane
roads, marl-white crater interiors, Negril sea-on-right, driver-visible) all came from
him supplying ground truth. Wave 3 is almost entirely that kind of work. Building it
blind overnight would violate the rule and risk wholesale rejection.

So Wave 3 is split:
- **Part A — objective / technique / logic** (no aesthetic judgment call): built + shipped overnight.
- **Part B — JA aesthetic content** (needs his eye + photos): specified here, NOT invented overnight.

---

## Part A — built overnight (objective, shippable)

### A1. Title tap-code → gold handcart skin
- **Logic (testable):** a tap/key sequence detector on the title/hub. A fixed code
  (e.g. the corners sequence, or `↑↑↓↓` via keys / a 4-tap corner pattern) toggles
  `save.goldHandcart = true`. New module `src/tapcode.js` with a pure
  `feedTap(state, token)` → `{matched, state}` reducer; unit-tested.
- **Skin:** when `save.goldHandcart`, the handcart body/rims render in gold. This is a
  **recolor of the existing, already-approved handcart sprite** — not new art. Gated in
  `cartSprite.js` by the save flag.
- **Save:** additive boolean `goldHandcart` (default false); migrates fine.

### A2. Denser Fern Gully
- **Quantitative intensification of the existing, approved Fern Gully style** — more
  fern-bank rows, more overlap, a darker depth tint receding into the gorge. Touches
  `scenery.js` (`fern` render: more clumps per row + a back layer) and possibly the
  `COUNT`/`GAP`/`EDGE` constants for that stage. No new silhouette invented — just more
  of the fern bank already shipped. Preview-verified for density/readability.

---

## Part B — REFERENCE-GATED (awaits the owner's photos / sign-off — do NOT invent)

Each item below needs the owner's reference images or explicit aesthetic direction before
building, per his authenticity bar. Listed so he can hand over references fast.

### B1. New Kingston landmarks (recognisable roadside silhouettes)
Emancipation Park's **"Redemption Song"** statue (the two tall bronze figures + fountain
— iconic, must be rendered respectfully), **Jamaica Tourist Board**, **Island Grill**,
**patty shops** (Tastee/Juici), **banks** (NCB/Scotia towers), **BPO call-centres**,
**cafés**. → Needs: which buildings matter most, their signage/colour, how stylised.

### B2. Less-blocky people & animals (the "12-bit" figure lift)
Smoother silhouettes + more shading bands on drivers, pedestrians, animals. → Needs his
target aesthetic (how smooth, how much detail) — risk of losing the charm he likes if
done blind.

### B3. Conductor front-facing portrait (so the bleached face is actually visible)
**Discovered in Wave 1:** the game is a rear view, so the conductor's bleached face,
black-pink lips, and neck tattoos are never seen in play. Needs a **front-facing driver
portrait** on the Play/character-select screen or game-over card to land his exact spec.
→ Build once he confirms placement + reviews the face.

### B4. Richer environments overall
More prop variety/layering across all stages. → Per-stage direction from him.

### B5. Cameos & road life
Night-Fern-Gully **Rolling Calf**, **Usain Bolt blur**, **Miss Lou** matriarch, roadside
**busker**; **school-children crossing** set-piece, **sunroof influencers**, **di convoy
ah pass**, **goat inna di Probox**, **nine-night procession**. Several need new
mechanics (night Fern Gully variant, crossing set-piece) + his look direction.

---

## Self-review
Part A items are objective (a tap-code reducer is logic; a gold recolor and denser ferns
are intensifications of approved art) — safe to ship. Part B is correctly withheld for
his ground truth rather than invented, honouring [[feedback-ground-truth]] and his
authenticity bar.
