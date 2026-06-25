# Pothole Run — Phase 2: feel, drinks, tithes-blessing, environment lift

**Date:** 2026-06-25
**Driver:** the owner's batch ("I want it all now", phase 2 approved, reference-gated work unblocked: "use what you have").
**Method:** parallel Sonnet subagents owning *disjoint* files; controller (Opus) owns `game.js`/`router.js`/`sw.js` and final integration + preview verification. Net-new-file modules built first, then wired in. Honours [[feedback-parallel-build-superpowers]], [[feedback-self-review]], [[feedback-ground-truth]].

Ground-truth code map captured this session (powerups/cart/run/constants/spawner/stages/characters/screens/aspirations/viewport/hud/audio/save) + authenticity notes from `docs/superpowers/research/2026-06-24-jamaica-environment-research.md`.

---

## Delivered in 4 verified, pushed increments

### Push 1 — Feel & fairness (no new-art dependency)
1. **Difficulty +10%.** `constants.js`: `SPAWN.baseInterval 125→113`, `SPAWN.ramp 20→18` (tightens faster), `DAMAGE.pothole 9→10`, `traffic 18→20`, `animal 14→15` (bump stays 4), `CART.startSpeed 72→79`. Solvability floor (`reachabilityFloorZ`) is speed-derived and unchanged → invariant still holds. Tests pin direction (baseInterval < 125, key damages > prior) and any value-pinned tests updated to new constants.
2. **Water → SUPERCHARGE.** Reworked in `powerups.js`. No slow, no heal-only. Sets `effects.super` (duration ~6s, `SUPERCHARGE.dur`). While `super`: (a) cart **invincible** — `run.js` damage branch skips all non-collectible damage AND wiper coin-loss; (b) **speed-up** — `game.js` adds `SUPERCHARGE.accel` toward `SUPERCHARGE.maxSpeed`; (c) **money flows faster** — `game.js` augments the stage spawn weights with extra `coin`/`cash` weight while super, and money values get `SUPERCHARGE.moneyMult`. New SFX `audio.sfx('super')`.
3. **HUD glow + timer.** `hud.js` draws a glowing aura/border + a shrinking countdown bar labelled `SUPERCHARGE 4.2s` whenever `super` (or a drink boost, Push 2) is active. `cartSprite.js` tints the cart with a gold/aqua glow while invincible.
4. **Hop higher.** `constants.js` `HOP.air 0.55→0.85` (longer airtime) + new `HOP.height` for visual arc amplitude; `cartSprite.js` raises the cart by a parabolic arc of `HOP.height` peak from `jumpT/HOP.air`.
5. **Livestock → rural only.** `stages.js`: keep `goat` in `fern-gully`/`holland-bamboo`; **add `cattle`** to `holland-bamboo` (rural); ensure `negril`/`new-kingston` carry no goat/cattle (dog only on coast). Reserve the heavy livestock for dense-rural feel.
6. **Android background fill.** `main.js`/`index.html`/`styles.css`: keep **contain-fit for gameplay+HUD** (nothing cropped), but fill the letterbox bars with the active stage's **sky (top) / ground (bottom)** instead of black, so the screen reads full on wide Android phones. Add `viewport-fit=cover`, switch `100vh→100dvh` (fallback 100vh), and size from `window.visualViewport?.height ?? innerHeight` so the Android URL-bar resize doesn't shrink the stage.

### Push 2 — Drinks system
- New `drinks.js` (+ `drinks.test.js`): `DRINKS` table `{id,label,potency,alcohol,color,tier}` — `ting`(0.4/0), `boom`(0.7/0), `redstripe`(0.8/0.4), `whiterum`(1.0/0.85); rasta-only `spirulina`(0.8/0), `rootstonic`(0.5/0.1). `canDrink(character,id)` — yute=sodas only (`ting`,`boom`); conductor (older)=all four alcohol/soda; rasta=all four **plus** `spirulina`,`rootstonic`. `applyDrink(effects, cart, id)` → sets `effects.super` scaled by potency (`DRINK.baseDur*(0.5+potency)`) AND, if `alcohol>0`, `effects.tipsy` (magnitude=`alcohol`, lasts `DRINK.tipsyExtra` **longer** than the boost — the drunk lingers).
- `hazardTypes.js`: add the 6 drink types, `collectible:true, powerup:'drink', drink:'<id>'`.
- `powerups.js`: route `'drink'` → `drinks.applyDrink`.
- `cart.js`: while `tipsy`, scale `effHandling` down by `tipsy` magnitude (sluggish = "resistant to direction changes") and raise wander/drift (error-prone). Continuous & readable — never drop inputs (that reads as a bug).
- `game.js` (controller): spawn only drinks the **current character can drink** (filter `DRINKS` by `canDrink`); tick `super`/`tipsy`; HUD shows a `TIPSY` indicator + subtle wobble while impaired.

### Push 3 — Tithes → blessing
- New `tithes.js` (+ `tithes.test.js`): `OFFERINGS` = widow's-mite fixed (`$2,000`) + `1%`/`5%`/`10%` of `wallet`. `offeringAmount(save,id)`; `giveTithe(save,amount)` spends `wallet`, tops up `save.blessing` (0..1 cap) by `clamp(fractionOfWallet/0.10,0,1)*TITHE.perGift`; `blessingEffects(blessing)`→`{resist (≤TITHE.maxResist), invincExtend, startGrace}`; `decayBlessing(save)` (−`TITHE.decay`/run, floor 0).
- New `screens/tithes.js`: render/hit screen — wallet, blessing meter, offering buttons, blessing preview, patois line ("Give wid a clean heart — di Most High walk wid yuh pon di road"), BACK.
- `aspirations.js`: `tithes` row routes to the offering screen (not an instant buy); drop it from the one-time `achieved` badge model.
- `run.js`/`cart.js`: blessing **resist** multiplies down all damage; blessing **invincExtend** lengthens `super`/drink windows; blessing **startGrace** = brief invincibility at run start.
- `game.js`: `decayBlessing` on run start; apply start grace; route aspirations→tithes screen.
- `save.js`: add `blessing: 0` + migration.

### Push 4 — Portraits + environment (reference-gated, unblocked)
- New `portrait.js`: `renderPortrait(ctx, characterId, x, y, size)` — **front-facing** procedural portraits. `yute` schoolchild (uniform); `rasta` locks + red-gold-green tam + beard, calm; **`conductor` per spec §11 — bleached white face, black lips w/ pink centre, neck tattoos, one un-bleached (black) arm, conductor cap; rendered with warmth + dignity, NOT caricature**. Shown on character-select (PLAY) + game-over card via `game.js`.
- `scenery.js`: New Kingston landmarks as recognisable roadside silhouettes for the `new-kingston` stage — **Redemption Song** statue (two tall bronze figures + fountain, rendered respectfully), Jamaica Tourist Board, Island Grill, patty shop (Tastee/Juici), bank towers (NCB/Scotia), BPO call-centre, café; richer prop layering across stages; **12-bit figure lift** (smoother silhouettes, more shading bands on drivers/pedestrians/animals).
- All from the owner's own named list + documented photo-grounded look notes; nothing invented from web research.

---

## Conflict-free file ownership
- **New modules (parallel, first):** `drinks.js`, `tithes.js`, `screens/tithes.js`, `portrait.js` (+ their tests).
- **Push-1 mechanics agent:** `constants.js`, `powerups.js`, `run.js`, `cart.js`, `audio.js`, `hazardTypes.js`.
- **Push-1 responsive agent:** `main.js`, `index.html`, `styles.css`.
- **Environment agent:** `stages.js`, `scenery.js`, `cartSprite.js`.
- **Screens/save agent:** `save.js`, `aspirations.js`, `hud.js`.
- **Controller (me) only:** `game.js`, `router.js`, `sw.js` (CACHE v10→v11 + precache new modules), final wiring + preview verification + pushes.

## Testing
`node --test` green throughout. New: `drinks` (eligibility, potency→durations, alcohol→tipsy), `tithes` (offering amounts, blessing top-up/cap/decay, effects scaling), `powerups` (water→super invincibility+money, no heal-only), `run` (invincible skips damage, blessing resist reduces damage), `constants`-direction. Rendering/responsive verified in preview (super glow+timer, hop arc, tipsy wobble, portraits, New Kingston landmarks, Android letterbox fill via `preview_resize` to a phone aspect). Bump SW `CACHE` per push.

## Self-review
Simplicity guards: tipsy impairment is continuous (sluggish+wander), never input-dropping, so it never reads as a bug. Android fix keeps contain-fit for gameplay (zero crop risk) and only repaints the bars — low-risk. Drinks are spawn-filtered per character so a minor never sees rum. Water-super invincibility is bounded by a visible timer so it can't feel cheap. Blessing decays so it stays a *temptation-to-keep-giving*, matching the inequality theme. Environment art is from the owner's named list + his documented look notes, honouring the authenticity bar.
