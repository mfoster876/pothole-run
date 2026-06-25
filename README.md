# Pothole Run ("Cyaa Stop Wi")

A pixel-art endless dodge-runner with a Jamaican soul: roll a downtown-Kingston
makeshift **handcart** — sound system blaring on the back — down Jamaica's
notoriously potholed roads, sliding between lanes to dodge craters, traffic and
goats for as long as your cart holds together. Underneath the arcade game is a
quiet theme: the long, real-priced grind toward "a way out" of inequality — the
road is brutal but **always survivable with enough skill**, and making it is
bittersweet.

- **Play:** _(hosted build — see **Deploy** below)_
- **Built with:** vanilla HTML5 Canvas 2D + ES modules. **No build step, no dependencies.**
- **Tests:** `node --test` (pure-logic modules are unit-tested)

## Controls

- **Slide lanes:** hold / tap the **left or right** side of the screen, or **Arrow keys** (also `A` / `D`).
  You can ride onto the soft **shoulder** to dodge — hazard-free but bumpy, and it slowly drains the cart.
- **Mute:** `M`
- **How to play:** the **`?`** button on the hub opens a 4-page in-game help guide.
- **Portrait phones:** rotate to landscape (a patois prompt nudges you).

## What's in the game

**Drivers** — School Yute, Rasta Musician, and the reckless Bleachaz Conductor (each
with a front-facing portrait on character-select and the game-over card; stats multiply
with the vehicle).

**Stages** — Fern Gully (dense shaded gorge), Holland Bamboo, Negril 7-Mile, and New
Kingston (with recognisable landmarks: the Emancipation Park *Redemption Song* statue,
Island Grill, patty shops, NCB/Scotia towers, BPO call-centres, sound-system stacks).

**Economy & rank** — every dollar ever banked lifts your career **rank** (Cart Bwoy →
Don Dadda); your **wallet** is the spendable balance for repairs, RIG upgrades, vehicles,
Cash Pot, and Aspirations. Near-miss **combos** multiply money; a hit resets them.

**Aspirations** — buy your "way out" (education, business, migration, a house in the
hills, a beachfront hotel…) for a short, bittersweet ending, then keep playing.

**Faith & Offerings** — **pray**, **read di Bible** (both free, once per run), and
**tithe** (give from your wallet, up to a full 10%) to build a **blessing**: less injury,
longer invincibility windows, and a roll-out grace. The blessing **decays each run**, so
it wears off if you neglect it.

**Power-ups**
- **Water → Supercharge:** full invincibility (driver + cart) + a speed surge + a money
  flood, shown by a glowing frame and a countdown timer.
- **Hardware Tools:** repair the cart + brief steadiness (the main in-run heal).
- **Blue Mountain Coffee:** ultra-rare jackpot — smooth road + a flood of $5,000 bills.
- **Drinks (per driver):** sodas (Ting/Boom) give a clean boost; the Conductor can drink
  Red Stripe & White Rum, the Rasta also Spirulina & Roots Tonic. Stronger alcohol gives
  a bigger boost **but then you steer sloppy** (a lingering "TIPSY" swerve).
- **Character items (per driver):** the Conductor's bleach vanity (cake soap, curry
  powder, toothpaste) gives a flashy invincible boost that then **backfires** into a
  "BLEACH BURN" sloppy-steering tail — vanity has a cost. The School Yute's wholesome
  items (books, stationery, bag juice, Lasco shake) give steadier hands, a small repair,
  and a brief refreshment dash — pure upside.
- **Sleeping policemen** (speed bumps) launch the cart into a **hop** over obstacles —
  but landing on top of one still hurts.

**Custom soundtracks** — pick **"My Music"** as the riddim on the Play screen to upload
your own audio files and hear them while driving. Files are stored **locally** in your
browser (IndexedDB) and never leave your device.

**Secret** — a title-screen tap-code (corners: top-left, top-left, top-right,
bottom-left, bottom-right) unlocks a gold handcart skin.

**The fairness rule** — no matter how fast it gets, the spawner guarantees there is
**always a way through** for a skilled player. Persistent cart condition has a free 40%
floor so you can always roll out, and every run banks a minimum so you never soft-lock.

## Project layout

```
index.html · styles.css · sw.js (PWA service worker, cache bumped per deploy)
src/
  main.js          canvas sizing / letterbox fill / loop / input bridge
  game.js          the controller: hub → screens router, run loop, wiring
  road.js scenery.js cartSprite.js sprites.js portrait.js   rendering
  cart.js run.js spawner.js entities.js collision.js wreck.js  simulation
  constants.js characters.js vehicles.js stages.js hazardTypes.js  data
  economy.js ranks.js aspirations.js cashpot.js tithes.js  meta-progression
  powerups.js drinks.js bounties.js solvability.js          systems
  save.js          versioned localStorage save (v2) with additive migration
  usermusic.js     IndexedDB store for the player's own soundtracks
  audio.js         Web Audio procedural music + SFX, plus user-track playback
  hud.js input.js money.js upgrades.js tapcode.js
  screens/         hub, play (in game.js), mechshop, cardealer, aspirations,
                   cashpot, tithes (Faith), ending, help, rotatePrompt, router
tests/             node:test unit tests for the pure-logic modules
docs/superpowers/  specs + implementation plans (full design history)
```

## Development

```bash
# Run locally (no build needed)
python3 -m http.server          # then open http://localhost:8000

# Run the test suite
node --test
```

**Deploy:** the game is fully static (no build step), so it deploys as a plain folder.
The simplest anonymous host is **Cloudflare Pages — Direct Upload**, which needs no Git
link (the public sees only a `*.pages.dev` URL):

```bash
npx wrangler pages deploy .        # uploads the current folder; prints the live URL
```

The service worker is **network-first**; after any deploy, bump the `CACHE`
string in `sw.js` so clients pick up the new code (and precache any new modules).

**Save format:** `localStorage` key `pothole-run-save:v2`; `loadSave()` merges over
defaults and migrates older saves additively (no wipe), with a corrupt-data fallback.

See `docs/superpowers/specs/` and `docs/superpowers/plans/` for the full design and
build history (the social-mobility redesign and the Phase 2 feel/drinks/tithes/
environment work).
