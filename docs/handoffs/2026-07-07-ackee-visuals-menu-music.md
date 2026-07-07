# Handoff: Pothole Run — unripe ackee, visual polish, dynamic menu, real music
Date: 2026-07-07 17:05

## Done this session
- **Unripe ackee poison hazard**: new UNIVERSAL negative (bites every driver) in `negatives.js` — closed green pod sprite (`drawUnripeAckee` in sprites.js), heavy 20% condition hit + a LONG 7s dizzy haze (`NEGATIVE.poisonSecs` vs the normal 4s), spawn weight 0.4 via `universalNegatives()` in game.js, "Unripe Ackee — CLOSED pod, poison!" warning in every driver's legend AVOID column. Tests: 3 added in negatives.test.js.
- **Billboard duplication fix**: the two verges could show the IDENTICAL safety headline at once (near row A + far row A−7 resolve to the same ordinal). Far verge now passes `msgShift=3` (half the 6-message list) through `roadsideFeature` — never the same sign twice on screen. 2 tests added in signs.test.js.
- **Visual polish**: Fern Gully ferns rebuilt as filled feather-fronds with veins/pinnae (was spiky strokes) in `fernTree`; sound-system speaker box on the cart is now a real reggae rig (green-gold-red stripe, bolted chrome woofer, horn tweeter, bass port) in cartSprite.js; coins are minted metal (milled rim, embossed $, sheen, glint — copper/silver/gold by value) via `drawCoin` in sprites.js.
- **Dynamic home menu** (`screens/hub.js`): animated backdrop — sun glow, parallax ridges, drifting clouds, road rushing to a vanishing point with accelerating dashes, bobbing sound-system cart, contrast scrim; title bobs. Footer text moved to H*0.845/0.875 so the cart clears it. Verified landscape AND portrait.
- **Fern Gully de-signed**: NO safety billboards / speed roundels / sign posts in the gorge any more — pure scenic drive (fern banks + craft vendor). Bog Walk gorge was already clean (renderRiver draws no signs, `poles:false`).
- **Music overhaul** (`audio.js`): real harmony replaces the single looped chord — chord voicings (maj/min/dom7 triads via `makeChord`), authentic per-genre progressions (reggae I–IV–V / I–V–vi–IV; ska I–vi–IV–V with ii–V–I–VI7 bridge; dancehall i–VII vamp; hip-hop minor loop), and a song FORM verse×2→chorus→verse→BRIDGE→chorus that walks bar-by-bar in playStage. Runtime-verified: distinct roots 147/196/220 (I/IV/V over fern's D) schedule correctly, live genre switch re-flattens the form.
- **Housekeeping**: sw.js bumped to v45; sprite_gallery.html now covers the full pickup/hazard set + coin denominations. Tests 363 → **368 pass**. Both batches committed by the auto-committer ("improvements" 43e57ef, "Game updates" 278255f); tree clean.

## Open items
- **Deploy** (Milton): `npx wrangler pages deploy .` — phone still runs the old build; v45 SW will swap caches. This was already the standing blocker from the last handoff.
- **Ear-test the music** (Milton): harmony logic is verified but nobody has HEARD it — judge authenticity per genre and whether the bridge lands; tuning knobs are PROG/FORM/GENRE_BPM in audio.js.
- **Eye-test on the phone**: dynamic menu (both orientations), de-signed Fern Gully, new ferns/coins/speaker box.
- Sprite gallery dev tool has a cosmetic layout quirk (big vertical gaps between rows when the list is long) — harmless, dev-only.
- "Light posts" ask: Fern Gully/gorge never drew power-line poles (only sign posts, now gone). If Milton meant poles on another stage, that's untouched.

## Context for next session
Everything lives in `/Users/miltonfoster/Documents/Claude/Projects/pothole-run` (vanilla JS canvas PWA, no build). Read `README.md` + this file; run `python3 tools/dev_server.py` (port 8125, no-store) + `node --test` (368 green expected). Immediate next step is Milton deploying + play-testing music and menu on the real phone.

## Quick-start
Start a new session and say:
"Read /Users/miltonfoster/Documents/Claude/Projects/pothole-run/docs/handoffs/2026-07-07-ackee-visuals-menu-music.md and let's continue from there."
