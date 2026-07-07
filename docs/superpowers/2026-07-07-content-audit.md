# Pothole Run — Adversarial Content Audit (cultural · player · legal)

**Date:** 2026-07-07 · Scope: this upgrade's additions, plus flags on pre-existing content Milton should weigh.
**Method:** adversarial read of every new depiction against the verified Jamaican sources (Gleaner et al.),
plus fairness/accessibility/motion review and a copyright/trademark pass. Tests + a headless render smoke
back the "renders and behaves" claims.

## Cultural

**Handled well / fixed in code**
- **Rasta ital respected.** The new Beef Patty becomes an **ital Veggie (callaloo) Patty** for the Rasta —
  character-aware at spawn and at effect (`foods.js`, tested). No meat is ever served to him. Consistent
  with the existing design where pork is a *blessing-stripping avoid* for the Rasta.
- **River-washing women** are drawn as **dignified everyday life** — kneeling at bright plastic buckets,
  headwrap, a cloth drying on a rock — not caricature. It reads as ordinary riverside labour.
- **River Mumma** is faithful to the folklore verified in Jamaican sources (a long-haired river mermaid who
  combs her hair on the rocks; danger is **contact/looking**; tied to Flat Bridge). Rendered as a tasteful
  ethereal silhouette — **no explicit detail**. She's a rare, dangerous avoid, not a cartoon monster.
- **The rare limestone easter-egg** (the real Bog Walk landmark) is **purely visual with no name or text
  anywhere** (per Milton's final instruction) — rendered as the natural cleft in the rock.
- **New women drivers are diverse and non-stereotyped**: a **university student**, a **nurse** (steadiest,
  toughest — a competent professional), and a **market higgler** (a *shrewd entrepreneur*, not a "mammy").
  The nurse's cap deliberately carries **no red-cross emblem** (that mark is protected).
- **Poverty-adjacent river imagery** (burnt-out cars, floating litter) is framed **neutrally as hazards**
  with plain labels — reflecting the Rio Cobre's real, documented dumping/pollution — not mockery.

**Needs Milton's human review (his creative call, not mine to change)**
- **"Bleachaz Conductor"** (existing): skin-bleaching that progresses to peeling flesh/skull. It reads as
  *satire of colorism/skin-bleaching*, but it's strong body-horror imagery that some will find offensive or
  distressing. Milton should confirm the framing lands as critique, not spectacle.
- **"Lady of di Night"** (existing sex-worker temptation) and **alcohol/"tipsy" mechanics**: mature themes.
  Fine for an older audience; relevant to the separate age-rating brief.
- **River Mumma as a "hazard"**: folklore casts her as a *guardian* who both protects and destroys. We used
  the "destroys" side (contact = danger). If Milton wants her fuller duality, that's a design extension.

## Player (fairness · accessibility · motion)

- **Fairness / no dark patterns.** Races stay non-predatory: fixed in-game buy-ins, no real money, no
  loss-chasing, no "so close — try again" nagging. The new apex tier and the named **grudge rival** add
  tension via a bigger purse + a tougher race, not coercion. The solvability floor still guarantees every
  spawn is dodgeable.
- **Motion comfort (fixed).** The stronger pothole jolt is **bounded and fast-decaying** (shake capped at
  1.7, down from an initial 2.0) so it reads as a jolt, not a lurching camera. The "Fast" graphics setting
  still steadies micro-jitter.
- **River Mumma damage** (60, rare) is severe-but-survivable by design (manhole is the only instant wreck);
  for a fragile driver it's near-fatal — intended ("drags you under"), and rare. Flagged for Milton to tune.
- **Open accessibility items (flagged, not fixed):** condition feedback is **colour-coded** (green/amber/red)
  — a shape/label cue would help colour-blind players; and there's **no explicit reduce-motion toggle** yet
  (the shake is bounded, but a dedicated setting would be better). Both are good follow-ups.
- **Small-screen readability:** portrait now fills the phone, but the exact framing (a tall/narrow road with
  a large sky band) should be **eyeballed on a real device** — see the honesty note in the verification report.

## Legal / assets (content-level)

- **No copyrighted photographs, logos, satellite tiles, or map imagery are embedded** anywhere — 100%
  original procedural canvas art. Real places/imagery were **reference only**.
- **"Red Stripe" trademark:** the beer is depicted **generically** (plain red bottle, no wordmark); the new
  floating-litter bottle is explicitly **brand-free**.
- **"Drick's Café"** is a **deliberate parody** of Rick's Café — name changed, no logo. The on-screen
  "DRICK'S" text is original parody wording.
- **Pre-existing brand references to flag for Milton's own legal comfort** (not introduced by this upgrade):
  stylised **Ting / Boom / Lasco** drink pickups, and **NCB / Scotiabank** towers named in the New Kingston
  backdrop. These are stylised, not logos — but they are real trademarks, so Milton should decide whether to
  keep, further genericise, or rename them before any commercial release.
