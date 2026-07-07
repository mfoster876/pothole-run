# Pothole Run — Jamaica Upgrade Spec (Refined Prompt + Build Plan)

**Date:** 2026-07-07
**Author:** Claude (Cowork), for Milton Foster
**Baseline:** `pothole-run` @ 339 passing tests. Full backup at `../pothole-run-BACKUP-<timestamp>/`.

This document turns Milton's large brief into a prioritized, honest build spec. It is
the "improved prompt" and the plan of record. It also logs the geography corrections and
the imagery-access limitation encountered.

---

## 0. Ground truth: what the game already is

Pothole Run is **not** a from-scratch project — it's a mature, modular HTML5 Canvas 2D
game (vanilla ES modules, no build step, `node --test` suite). Relevant existing systems:

- **Pseudo-3D road** (`road.js`) with per-stage `curveMult`, 3 lanes + 2 soft shoulders,
  double-integral curve offset so road/entities/cart bend together.
- **Stages** (`stages.js`): Fern Gully, Holland Bamboo, Negril 7-Mile, New Kingston —
  each with palette + weighted hazard table + scenery id.
- **Characters** (`characters.js` + procedural `portrait.js`): School Yute, Rasta Musician,
  Bleachaz Conductor, Di Politician, Taxi Man. **All male.**
- **Power-ups**: water (supercharge), tools (repair), coffee (jackpot), **character-gated
  drinks** (`drinks.js`) and **character items** (`charitems.js`), plus a generic **fruit**
  pickup. Clean extension points for new foods.
- **Hazards** (`hazardTypes.js`) with `category` immunity, `gust`, `walk`, `swerve`, hop.
- **Mobile**: currently **landscape-locked** — portrait *blocks play* and shows a rotate
  prompt (`screens/rotatePrompt.js`, gate in `main.js`). Touch = tap left/right half to steer.
- **No river/raft mode exists.** All four stages are road-based.
- **Aspirations** (`aspirations.js`, `screens/ending.js`): 9 goals with text-only endings.
- **Races** (`races.js`): 3 tiers, 3 rivals, buy-in/purse, beatable pacing.

Design consequence: we **extend**, we don't rebuild. Every change must keep the 339 tests
green (add new tests for new logic) and keep the game runnable.

---

## 1. Improved prompt (what we're actually building)

> Upgrade the existing Pothole Run into a richer, phone-first, unmistakably Jamaican game.
> Add diverse female playable drivers; deepen pothole physics (varied craters + believable
> jolt/splash/suspension); add **Ackee** and **Beef Patty** power-ups that are
> **character-aware** (the Rasta is served an **ital veggie patty**, never beef); enrich the
> **Negril** scene (turquoise sea + Seven Mile Beach on the right, bars/flora/churches on the
> left, a cliff-top **"Drick's Café"** parody landmark); scatter **overhead power lines +
> wooden light posts** through every world **except Fern Gully**; make **Fern Gully** the
> curviest, canopy-shaded, no-shoulder gauntlet with a roadside **wood-carving craft vendor**;
> add a **Bog Walk Gorge river mode** — float a **bamboo raft** down the Rio Cobre dodging
> stylised litter, crocodiles, burnt/floating cars, avoiding **River Mumma**, passing
> hand-washing life on the banks and floating **under the single-lane Flat Bridge**; raise
> race stakes without dark patterns; give each aspiration a **visual** ending; and lift the
> whole look with more vibrant, dynamic texture. Real Jamaica drives the layout and art;
> nothing copyrighted is embedded; "Red Stripe" style bottles are generic/stylised.

---

## 2. Geography & fact corrections (verified this session)

Verified via web search + text fetch (sources in the final report). **Corrections to
Milton's brief:**

1. **Fern Gully "~300 m-high walls" is a misread.** The famous "300" is the number of
   **fern species** (~300+) in the gully — not a wall height. Real Fern Gully is a ~4–5 km
   collapsed-riverbed gorge (A3, ~5 km south of Ocho Rios toward Colgate/Moneague) with a
   **dense fern-and-tree canopy** overhead and steep green walls close to the road — tall and
   enveloping, but not 300 m. → We render **tall, lush, close-pressing fern/forest walls +
   a shading canopy with light shafts**, and treat "300" as species richness, not height.
2. **Rick's Café ("Drick's") is on Negril's West End limestone cliffs**, *south of* Seven
   Mile Beach (past Negril town), famous for **sunset + cliff diving** (ledges ~8–40 ft).
   It is **not** on the sandy beach itself. → We place beach/sea along the strip and put
   **"Drick's Café" on a cliff headland at the far end** — a faithful composite, noted as
   deliberate stylisation.
3. **River Mumma is canonically tied to Bog Walk Gorge** — "beneath one of the oldest
   bridges in Jamaica lives the ancient siren of the Bog Walk Gorge." She combs long black
   hair on rocks and guards a **Golden Table** that rises at noon; looking/greed gets you
   dragged under. → River mode uses her as an avoid-hazard, plus an optional **Golden Table**
   high-risk bonus.
4. **Flat Bridge** (18.0612 N, 76.9844 W): single lane, ~45 m long × 4 m wide, built ~1770
   by enslaved labour, **no railings — only stone hemispheres**, floods to deck level. →
   Single-lane low bridge to pass under; no railings; respectful framing of its history.
5. **Ackee** = national fruit (red pod splits to yellow arils + black seeds; only ripe arils
   edible). **Ital** = Rasta strict vegetarian/vegan diet → veggie patty is authentic respect.
   **Beef patty** = golden semicircular flaky pastry (turmeric/annatto), scotch-bonnet spiced.

### Map-derived geometry driving each track

- **Negril:** long, gentle coastal **arc** (~11 km, slightly concave to the west); road
  parallels the shore with **sea to the west**. Design orients the **sea/beach on the
  player's right** (driving south down the coast), **inland life on the left**, and a
  **cliff headland with Drick's Café** at the far end. Gentle bends (`curveMult` low).
- **Fern Gully:** continuous **downhill** serpentine (interior → Ocho Rios/sea level), tight
  **alternating S-bends**, canopy overhead, craft stalls, **walls right at the road edge**
  (near-zero shoulder). Highest `curveMult`.
- **Bog Walk / Rio Cobre:** river makes **tight incised meanders** through a steep gorge;
  the **single-lane Flat Bridge** crosses low over the water. Design = winding channel,
  steep vegetated walls both banks, meander bends, a bridge to pass under.

### Written-source cross-reference (Gleaner + Jamaican outlets)

Per Milton's second accuracy pass, each environment was triple-checked against written
descriptions — **the Jamaica Gleaner was reachable** (search + full-article fetch) plus
reputable travel/culture sources. Reconciliations folded into the art:

- **Negril** (Gleaner *"History, beauty, and the road to recovery"*, 2025; *breakwater/erosion*
  coverage): far-western tip across **Westmoreland & Hanover**; white-sand **Seven Mile Beach**
  + dramatic limestone **West End cliffs**; **Rick's Café** the iconic cliffside sunset/cliff-jump
  spot; "relaxed, barefoot" guesthouse-and-bar culture; **Sunday church** part of local life.
  Enrichment: beach-side flora = **sea grape (Coccoloba uvifera) & coco plum** — the real
  dune/sand-holding plants whose removal drives erosion (shore retreating 1–2 m/yr; erosion
  hotspot since 1999). *Correction to my assumption:* Negril is **not** pristine-permanent —
  it's environmentally fragile; I keep the arcade look vibrant but ground the flora in the real
  sand-holding species and put **Drick's Café on the cliff headland**, not on the sand.
- **Fern Gully** (Gleaner *"A Journey through Fern Gully"*; *heavy-vehicle ban* 2023): ~**3-mile**
  fern-walled canopy, Ocho Rios→Colgate; **300 fern species** on the hills both sides (re-confirms
  the "300" = species, not wall height); **dappled light** through the canopy; craft vendors carving
  **wooden figures** (the famous **"Ready Freddie"** roadside carving); **heavy trucks are banned**
  — a narrow, delicate road, which *authentically justifies* the punishing no-shoulder edges.
- **Bog Walk Gorge / Rio Cobre** (Gleaner flood closures 2022/2024; *"Gorge-ous but devious"* 2007;
  fatal plunge off Flat Bridge 2025): steep gorge, meandering Rio Cobre; **single-lane Flat Bridge**
  (pre-1774) with **no railings** (stone hemispheres) — vehicles have **plunged off into the river**;
  floods so routinely it has **flood-control gates**; riverside washing/fishing life; heavy vegetation
  both banks.
- **River Mumma** (Gleaner *"Haywood Hall & the River Mummas"*; *"ghosts of Flat Bridge"* 2002;
  Barbara Gloudon's pantomime *"River Mumma and the Golden Table"*): a river **mermaid** who rises to
  **comb her long hair on the rocks**; **looking directly at her** brings drowning/bad luck; **guardian
  of the river that both protects and destroys**; folklore places her **at Flat Bridge**; she guards the
  **Golden Table**. Faithful in-game: an avoid-figure on a rock (danger = getting close / "staring"),
  with the Golden Table as a high-risk bonus — not an invented creature.

*Contradiction/currency note:* sources vary on Fern Gully's length (**~3 mi / ~4–5 km**) — I use
"about three miles." Negril sources emphasise **erosion + 2025 Hurricane Melissa damage**, which I
acknowledge but don't depict (arcade tone). No source contradicted the River Mumma or Flat Bridge
core facts.

### Imagery-access honesty note

Milton asked me to **actually view** satellite/topographic imagery before shaping the tracks.
In this environment I **could not visually study raster imagery**: no Chrome browser was
connected to the browser MCP (`list_connected_browsers` → empty), so I could not drive Google
Maps/Earth and screenshot tiles; and the sanctioned web-fetch returns page **text/metadata**,
not rendered map tiles I can see. I therefore fell back — as instructed — to **map-derived
geometry**: coordinates, known road alignments (A1/A3, Norman Manley Blvd), and described
bend/meander patterns from multiple sources. The layouts above reflect that real geometry, not
a generic "curvy road." **I did not view images I could not load.** If Milton later runs this
in a session with the Chrome extension connected, re-studying the actual satellite/terrain
imagery is a worthwhile refinement pass.

---

## 3. Legal / asset discipline (enforced in build + audited)

- **No copyrighted photos, logos, or trademarks** embedded. All art is original procedural
  canvas/pixel/vector drawing. Real imagery/facts are **reference only**.
- **"Red Stripe"** is a real trademark → the existing bottle is depicted **generically/
  stylised** (red bottle, no wordmark/logo). New "Drick's Café" is a **deliberate parody** of
  Rick's Café (name changed; no logo). Brand-shaped pickups (Ting, Boom, Lasco) are stylised
  colour/letter forms, not logos — flagged for Milton's review in the audit.
- No embedded map tiles or satellite imagery anywhere in the game.

---

## 4. Prioritized build plan

**Tier 1 — high-impact, well-scoped, ship fully (tests green):**

1. **Ackee + Beef Patty power-ups**, character-aware **veggie patty for Rasta** (ital).
   New `foods.js` (pure logic + tests), hazard types, sprites, legend, spawn wiring.
2. **Female playable drivers** (diverse, respectful, non-stereotyped) — add ≥3, at least one
   unlocked from the start. Stats, portraits, drink/item eligibility, legend, save unlocks.
3. **Pothole physics**: graded crater sizes/depths (seed-driven), water-filled **splash**
   variant, stronger **jolt/suspension** reaction (shake + bounce + brief steering knock).
4. **Negril scene**: turquoise sea + Seven Mile Beach on the **right**; bars, flora, churches
   on the **left**; **Drick's Café** cliff landmark. Vibrant palette.
5. **Roadside power lines + wooden light posts** in every stage **except Fern Gully**
   (stage flag `poles:true/false`).
6. **Fern Gully**: curviest (`curveMult` up), tall fern/forest walls + **canopy with light
   shafts**, periodic clearings, **wood-carving craft vendor on the left**, punishing edges
   (**no soft shoulder** — `noShoulder` flag).
7. **Races**: higher-stakes framing — a named grudge rival + escalating tension + clearer
   risk/reward. No predatory mechanics (no coercive loss-chasing, no fake scarcity).

**Tier 2 — ambitious, attempt meaningfully, be honest about depth:**

8. **Phone-first / portrait**: remove the portrait *block*; adapt the virtual viewport to the
   device aspect so the game **plays in portrait** with touch steering; keep landscape working;
   keep the "fast" DPR path. (Riskiest change; guard carefully.)
9. **Bog Walk river mode**: new `bog-walk` stage + **raft** render + river hazards (stylised
   floating bottles/bags, **crocodile**, **burnt car**, **floating car**, **River Mumma**),
   bank life (women washing in bright buckets, heavy vegetation), **Flat Bridge** pass-under,
   optional **Golden Table** bonus. Core playable; raft→boat→yacht upgrade path **staged**.
   - **Limestone gorge** (verified: Bog Walk is a genuine limestone gorge — dramatic cliffs
     carved by the Rio Cobre): large **limestone rock formations** along both banks and
     **jutting into the river** (scenery, and as solid obstacles where they fit).
   - **Rare limestone easter-egg** (the real "Pum Pum Rock" landmark on the Rio Cobre bank —
     verified): a **very rare**, purely-visual limestone-formation sighting the player only
     occasionally glimpses, rendered accurately as the natural cleft/carving in the rock.
     **Per Milton's final instruction: NO name, label, or text anywhere in the game** — just the
     formation. With no name on screen there is nothing to affect a store rating, so the earlier
     age-rating flag is **fully resolved** (no "Milton's call" toggle needed).
10. **Aspiration visual endings**: a procedural ending-scene framework + arted vignettes for
    the marquee aspirations; remaining ones use the framework with lighter art. Honest partial.

**Tier 3 — polish/vibrancy woven throughout:** richer textures, palettes, parallax.

---

## 5. Definition of done / guardrails

- `node --test` stays green; **new pure logic gets new tests**.
- Game boots and the main flows work (hub → play each stage → game over → shops).
- No copyrighted assets; parody + trademark handling documented.
- Final report is **scrupulously honest**: FULLY done vs PARTIAL/STAGED, per feature.

---

## 6. Adversarial audit checklist (run in Step 2)

- **Cultural:** Rasta ital respected (veggie patty; no bleach-as-pickup regression); the
  river-washing women framed as dignified everyday life (not caricature); folklore (River
  Mumma) treated with weight; poverty-adjacent imagery (burnt cars, litter) not mocking.
- **Player:** fair difficulty curve; readable on a small portrait screen; no dark patterns;
  motion-sickness care (bounded shake/parallax, reduce-motion respect where feasible).
- **Legal:** no embedded copyrighted photos/logos/trademarks; "Drick's" parody labelled;
  Red Stripe generic; brand-shaped pickups flagged for Milton.
