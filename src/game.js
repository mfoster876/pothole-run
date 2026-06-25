import { VIRTUAL, SHOULDER, SUPERCHARGE, IMPAIR } from './constants.js';
import { setLetterboxColors } from './main.js';
import { drinkWeightsFor } from './drinks.js';
import { makeRoad, renderRoad, projectEntity, curveOffsetAt, CART_Z } from './road.js';
import { createCart, steer, updateCart, onShoulder } from './cart.js';
import { createField, spawn, advance, activeEntities } from './entities.js';
import { spawnInterval, pickHazard, laneFor } from './spawner.js';
import { createRun, resolveHits } from './run.js';
import { isWrecked, applyDamage } from './wreck.js';
import { renderHud, renderTouchZones } from './hud.js';
import { drawEntity } from './sprites.js';
import { drawCart } from './cartSprite.js';
import { renderScenery } from './scenery.js';
import { getCharacter } from './characters.js';
import { getStage } from './stages.js';
import { VEHICLES, getVehicle } from './vehicles.js';
import { STABILITY_UPGRADES, stabilityBonus, nextUpgrade } from './upgrades.js';
import { pickMoney, formatMoney } from './money.js';
import { loadSave, writeSave, recordBest, addCoins, buyVehicle, selectVehicle, buyUpgrade, GENRES } from './save.js';
import { emptyState as tapcodeEmpty, feedTap } from './tapcode.js';
import { bankRun } from './economy.js';
import { createEffects, tickEffects, effectActive, applyPowerup } from './powerups.js';
import { rollBounties, progressBounties, refresh as refreshBounties, BOUNTY_DEFS } from './bounties.js';
import { createRouter } from './screens/router.js';
import * as hub from './screens/hub.js';
import * as mechshop from './screens/mechshop.js';
import * as cardealer from './screens/cardealer.js';
import * as aspirations from './screens/aspirations.js';
import * as ending from './screens/ending.js';
import * as cashpotScreen from './screens/cashpot.js';
import { rankFor } from './ranks.js';
import { purchaseAspiration, canBuy } from './aspirations.js';
import { playCashPot } from './cashpot.js';
import * as tithesScreen from './screens/tithes.js';
import { blessingEffects, decayBlessing, offeringAmount, giveTithe } from './tithes.js';

const W = VIRTUAL.width, H = VIRTUAL.height;
const GENRE_LABEL = { reggae: 'Reggae', ska: 'Ska', dancehall: 'Dancehall', hiphop: 'Hip-Hop' };

// Menu hit-regions (virtual coords). One row each for driver, ride, stage, genre.
const arrow = (xf, yf) => ({ x: W * xf, y: H * yf - 24, w: 48, h: 48 });
const BTN = {
  driverPrev: arrow(0.15, 0.225), driverNext: arrow(0.80, 0.225),
  stagePrev:  arrow(0.15, 0.61),  stageNext:  arrow(0.80, 0.61),
  genrePrev:  arrow(0.15, 0.70),  genreNext:  arrow(0.80, 0.70),
  start:      { x: W * 0.5 - 130, y: H * 0.795 - 28, w: 260, h: 54 },
  back:       { x: 24, y: 18, w: 80, h: 36 }
};
function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

const CAR_TIP = {
  title: 'WINDSCREEN YOUTHS',
  lines: [
    'Now you roll inna car, di yutes wid soapy',
    'cans rush yuh at di stop-light fi wash di glass.',
    'Bounce dem and yuh lose coins (a forced wash) —',
    'so slide round dem same way yuh dodge potholes.'
  ]
};

export function createGame(audio) {
  const save = loadSave();
  if (audio && audio.setMuted) audio.setMuted(save.settings.muted);
  if (audio && audio.setGenre) audio.setGenre(save.settings.genre);
  const router = createRouter('hub');
  const state = { mode: 'menu', save, audio, popup: null };
  const menuChoice = { character: 'yute', stage: 'fern-gully', vehicle: save.vehicle, genre: save.settings.genre };
  let road, stage, cart, field, run, camZ, spawnZ, steerLock = 0, activeWeights = [];
  let squeakAccum = 0, hitShake = 0;
  let tapcodeState = tapcodeEmpty(); // secret tap-code progress
  // Power-up effects + car dealer display index
  let effects = createEffects();
  let dealerIdx = 0;
  let endingId = null; // tracks which aspiration's ending is showing
  let goldToast = 0;  // frames remaining to show GOLD CART UNLOCK toast
  let cashpotResult = null; // last result from playCashPot
  const rng = Math.random;

  function startRun(characterId, stageId) {
    road = makeRoad();
    stage = getStage(stageId);
    // Match the letterbox bars to this stage so wide phones read full, not black-barred.
    setLetterboxColors(stage.palette.sky, stage.palette.ground);
    cart = createCart(getCharacter(characterId), getVehicle(save.vehicle), stabilityBonus(save.upgrades), save.condition);
    cart.goldHandcart = !!(save.goldHandcart && save.vehicle === 'handcart');
    field = createField();
    run = createRun();
    effects = createEffects();
    // Tithe blessing: resilience + longer invincibility + a brief roll-out grace.
    cart.blessing = blessingEffects(save.blessing || 0);
    if (cart.blessing.startGrace > 0) {
      effects.super = cart.blessing.startGrace;
      effects.superMax = cart.blessing.startGrace;
    }
    // Seed bounties if this is the player's first run or they've been exhausted
    if (!save.bounties || save.bounties.length === 0) {
      save.bounties = rollBounties(rng, 3);
    }
    // windscreen youths only appear when you drive a car (a windscreen to wash);
    // drinks the current driver is allowed to pick up are mixed into the spawn pool
    // (a School Yute, a minor, only ever sees sodas — never rum).
    activeWeights = (cart.vehicle.isCar
      ? stage.hazardWeights.concat([{ type: 'wiper', weight: 3 }])
      : stage.hazardWeights.slice()
    ).concat(drinkWeightsFor(cart.character));
    camZ = 0; spawnZ = 600; steerLock = 10; squeakAccum = 0; hitShake = 0;
    state.mode = 'play';
    audio && audio.unlock();
    audio && audio.playStage(stage.musicId);
  }
  function endRun() {
    state.mode = 'gameover';
    audio && audio.sfx('wreck');
    // Persist the ending condition (40% floor applied at next run start by createCart)
    save.condition = Math.max(0, cart.condition.value);
    // Blessing fades a little each run — keeps faithful giving a recurring choice.
    decayBlessing(save);
    // Bank earnings via economy module (ensures MIN_EARN floor)
    bankRun(save, run.coins);
    addCoins(save, run.coins);
    recordBest(save, stage.id, Math.floor(run.distance));
    maybeUnlock();
    writeSave(save);
    audio && audio.stop();
  }
  function maybeUnlock() {
    const u = save.unlocks;
    if (run.distance >= 400 && stage.id === 'fern-gully' && !u.stages.includes('holland-bamboo')) u.stages.push('holland-bamboo');
    if (run.distance >= 400 && stage.id === 'holland-bamboo' && !u.stages.includes('negril')) u.stages.push('negril');
    // New Kingston (where the JUTC buses run) opens once you've banked a little
    if (save.coins >= 500 && !u.stages.includes('new-kingston')) u.stages.push('new-kingston');
    if (save.coins >= 2500 && !u.characters.includes('conductor')) u.characters.push('conductor');
  }

  function update(dt) {
    if (goldToast > 0) goldToast--;
    if (state.mode !== 'play') return;
    if (steerLock > 0) steerLock--;
    // Loose-rig wander: a slow, mean-reverting drift that pulls the cart off its line.
    // Alcohol (cart.tipsy) adds to that wander — booze makes the steering error-prone.
    const looseness = Math.max(0, 1.15 - (cart.stability || 1)) + (cart.tipsy ? cart.tipsy * IMPAIR.wander : 0);
    cart.drift = (cart.drift || 0) * Math.exp(-1.6 * dt) + (Math.random() - 0.5) * looseness * 6 * dt;
    cart.drift = Math.max(-0.15, Math.min(0.15, cart.drift));

    // Tick power-up effects
    tickEffects(effects, dt);
    // Booze wears off: once the tipsy timer expires, steering steadies again.
    if (!effectActive(effects, 'tipsy')) cart.tipsy = 0;
    // Supercharge: water makes the cart invincible (handled in run.js) and surges
    // the speed up toward a higher cap so you cover more ground while collecting.
    if (effectActive(effects, 'super')) {
      cart.speed = Math.min(cart.speed + SUPERCHARGE.accel * dt, SUPERCHARGE.maxSpeed);
    }
    // Steady: tools power-up raises effective stability
    if (effectActive(effects, 'steady')) {
      cart.stability = Math.min((cart.stability || 1) + 0.3 * dt, 2.0);
    }

    updateCart(cart, dt);
    const dz = cart.speed * dt * 4;
    camZ += dz;
    const dDist = cart.speed * dt * 0.1 * cart.character.scoreMult;
    run.distance += dDist;
    advance(field, dz, dt);
    spawnZ -= dz;
    if (spawnZ <= 0) {
      // Coffee power-up: suppress hazard spawns during the smooth window
      const inCoffeeWindow = run.coffeeUntilDist && run.distance < run.coffeeUntilDist;
      // Supercharge (water) floods the road with extra money while you're invincible.
      const supercharged = effectActive(effects, 'super');
      const spawnWeights = supercharged
        ? activeWeights.concat([{ type: 'coin', weight: SUPERCHARGE.coinWeightBonus }])
        : activeWeights;
      let type = inCoffeeWindow ? 'coin' : pickHazard(spawnWeights, rng);
      // Ultra-rare Blue Mountain coffee bag — not before 600m, ~1-in-500 spawn chance
      if (!inCoffeeWindow && run.distance >= 600 && rng() < 0.002) type = 'coffee';
      const lane = type === 'bus' ? 0 : laneFor(rng, 3); // JUTC buses overtake on the left
      const e = spawn(field, type, lane, 5200);
      if (type === 'coin') {
        // During coffee window bias to $5000 notes; supercharge fattens every note.
        e.value = inCoffeeWindow ? 5000
          : Math.round(pickMoney(run.distance, rng) * (supercharged ? SUPERCHARGE.moneyMult : 1));
      }
      spawnZ = spawnInterval(run.distance, undefined, undefined, cart.speed) * 8;
    }
    const coinsBefore = run.coins, condBefore = cart.condition.value;
    cart.gusted = false; cart.washed = false; cart.pickupValue = 0; cart.nearMiss = false;
    resolveHits(run, cart, field, effects);
    if (run.coins > coinsBefore) audio && audio.sfx(cart.pickupValue >= 100 ? 'cash' : 'coin');
    // any damage event ratchets the permanent rattle up
    if (cart.condition.value < condBefore) cart.rattle = Math.min(0.5, cart.rattle + 0.05);
    if (cart.washed) { audio && audio.sfx('wash'); hitShake = Math.max(hitShake, 0.4); }
    else if (cart.condition.value < condBefore) { audio && audio.sfx('hit'); hitShake = 1; }
    if (cart.gusted) { audio && audio.sfx('whoosh'); hitShake = Math.max(hitShake, 0.55); }
    squeakAccum += dz;
    const shoulder = onShoulder(cart);
    if (squeakAccum >= (shoulder ? 120 : 215)) { squeakAccum -= (shoulder ? 120 : 215); audio && audio.sfx('squeak'); }
    if (shoulder) cart.condition = applyDamage(cart.condition, SHOULDER.drainPerSec * dt);
    const reelTarget = shoulder ? (cart.laneIndex === 0 ? -1 : 1) * (0.17 + Math.sin(camZ * 0.06) * 0.05) : 0;
    cart.reel = (cart.reel || 0) + (reelTarget - (cart.reel || 0)) * (1 - Math.exp(-9 * dt));
    if (hitShake > 0) hitShake = Math.max(0, hitShake - dt * 2.4);

    // Bounty progress events
    if (save.bounties && save.bounties.length) {
      const completed = [
        ...progressBounties(save.bounties, { kind: 'dist', amount: dDist }),
        ...(condBefore > cart.condition.value ? progressBounties(save.bounties, { kind: 'dodge', amount: 0 }) : []),
        ...(cart.nearMiss ? progressBounties(save.bounties, { kind: 'dodge', amount: 1 }) : []),
        ...(run.coins > coinsBefore ? progressBounties(save.bounties, { kind: 'bank', amount: run.coins - coinsBefore }) : [])
      ];
      if (completed.length) {
        for (const defId of completed) {
          const def = BOUNTY_DEFS.find(d => d.id === defId);
          if (def) bankRun(save, def.reward);
        }
        refreshBounties(save.bounties, rng);
        writeSave(save);
      }
    }

    if (isWrecked(cart.condition)) endRun();
  }

  function render(ctx) {
    if (state.mode === 'menu') return renderMenu(ctx);
    if (state.mode === 'gameover') return renderGameOver(ctx);
    renderRoad(ctx, road, stage.palette, camZ, W, H);
    renderScenery(ctx, stage, camZ, W, H);
    for (const e of activeEntities(field).sort((a, b) => b.z - a.z)) {
      const camZe = e.z + CART_Z;
      const p = projectEntity(e.x, camZe, W, H);
      if (p.visible) drawEntity(ctx, e.type, p.x + curveOffsetAt(camZ, camZe), p.y, p.size, e.seed, e.value);
    }
    const cp = projectEntity(cart.x, CART_Z, W, H);
    const cartCurve = curveOffsetAt(camZ, CART_Z);
    const condFrac = cart.condition.value / cart.condition.max;
    const damageWobble = 1 + (1 - condFrac) * 1.3 + (cart.rattle || 0);
    const sway = (cart.character.sway || 1) * damageWobble;
    const wob = (Math.sin(camZ * 0.05) * 0.5 + Math.sin(camZ * 0.13 + 1) * 0.3) * sway;
    const kickY = -hitShake * cp.size * 0.18;
    const rockX = Math.sin(hitShake * 30) * hitShake * cp.size * 0.14;
    const bobPx = (wob + (Math.random() - 0.5) * 0.54 * sway) * cp.size * 0.063 + kickY;
    const jitX = (Math.random() - 0.5) * cp.size * 0.0225 * sway + rockX;
    drawCart(ctx, cart, cp.x + cartCurve + jitX, cp.y + 6 + bobPx, cp.size * 0.9);
    renderTouchZones(ctx, W, H);
    renderHud(ctx, { stageName: stage.name, coins: run.coins, distance: run.distance, condition: cart.condition, effects }, W, H);
  }

  // --- input ---
  function onSteer(dir) {
    if (state.mode !== 'play' || steerLock !== 0) return;
    const before = cart.laneIndex;
    steer(cart, dir);
    if (cart.laneIndex !== before) audio && audio.sfx('creak');
  }
  function cycleDriver(dir) {
    const list = save.unlocks.characters;
    menuChoice.character = list[(list.indexOf(menuChoice.character) + dir + list.length) % list.length];
  }
  function cycleStage(dir) {
    const list = save.unlocks.stages;
    menuChoice.stage = list[(list.indexOf(menuChoice.stage) + dir + list.length) % list.length];
  }
  function cycleGenre(dir) {
    const i = GENRES.indexOf(menuChoice.genre);
    const g = GENRES[(i + dir + GENRES.length) % GENRES.length];
    menuChoice.genre = g; save.settings.genre = g;
    audio && audio.setGenre(g); writeSave(save);
  }
  function driveVehicle(id) {
    selectVehicle(save, id);
    if (getVehicle(id).isCar && !save.seenCarTip) { save.seenCarTip = true; state.popup = CAR_TIP; }
    writeSave(save);
  }
  function toggleMute() {
    save.settings.muted = !save.settings.muted;
    audio && audio.setMuted(save.settings.muted);
    writeSave(save);
  }

  // Mech shop: repair and rig upgrade handlers
  function doRepair() {
    if (mechshop.applyRepair(save, 100)) { audio && audio.sfx('cash'); writeSave(save); }
    else state.popup = { title: 'NUH RICH YET', lines: ['Repair costs ' + formatMoney(mechshop.repairCost(save.condition, 100)) + '.', 'Bank more coins on di road first.'] };
  }
  function doBuyUpgrade(upgradeId) {
    const upgrade = STABILITY_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;
    if (buyUpgrade(save, upgrade)) { audio && audio.sfx('cash'); writeSave(save); }
    else state.popup = { title: 'NUH RICH YET', lines: [upgrade.name + ' cost ' + formatMoney(upgrade.price) + '.', 'Grind some more money pon di road first.'] };
  }

  // Car dealer handlers
  function doBuyVehicle(v) {
    if (save.garage.includes(v.id)) return;
    if (buyVehicle(save, v)) { audio && audio.sfx('coin'); driveVehicle(v.id); }
    else state.popup = { title: 'NUH RICH YET', lines: ['Yuh need ' + formatMoney(v.price) + ' fi di ' + v.name + '.', 'Win races or grind deep runs fi dat kinda money.'] };
  }

  function menuPoint(vx, vy) {
    if (state.popup) { state.popup = null; return; }
    if (state.mode === 'gameover') { router.go('hub'); state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;

    const screen = router.current;

    // Hub: four big buttons
    if (screen === 'hub') {
      const action = hub.hit(vx, vy, { W, H });
      if (action === 'play') { router.go('play'); return; }
      if (action) { router.go(action); return; }
      // Corner tap secret code — only fires when no hub button was hit
      const corner = (vx < W * 0.5 ? 'L' : 'R');
      const token = (vy < H * 0.5 ? 'T' : 'B') + corner;
      const tc = feedTap(tapcodeState, token);
      tapcodeState = tc.state;
      if (tc.matched) {
        save.goldHandcart = true;
        writeSave(save);
        goldToast = 180; // ~3 s at 60 fps
      }
      return;
    }

    // Play: existing driver/stage/genre pickers + START
    if (screen === 'play') {
      if (inRect(BTN.back, vx, vy)) { router.go('hub'); return; }
      if (inRect(BTN.driverPrev, vx, vy)) cycleDriver(-1);
      else if (inRect(BTN.driverNext, vx, vy)) cycleDriver(1);
      else if (inRect(BTN.stagePrev, vx, vy)) cycleStage(-1);
      else if (inRect(BTN.stageNext, vx, vy)) cycleStage(1);
      else if (inRect(BTN.genrePrev, vx, vy)) cycleGenre(-1);
      else if (inRect(BTN.genreNext, vx, vy)) cycleGenre(1);
      else if (inRect(BTN.start, vx, vy)) startRun(menuChoice.character, menuChoice.stage);
      return;
    }

    // Mech shop
    if (screen === 'mechshop') {
      const action = mechshop.hit(vx, vy, { W, H, save });
      if (action === 'back') { router.go('hub'); return; }
      if (action === 'repair100') { doRepair(); return; }
      if (action && action.startsWith('buy:')) { doBuyUpgrade(action.slice(4)); return; }
      return;
    }

    // Car dealer
    if (screen === 'cardealer') {
      const action = cardealer.hit(vx, vy, { W, H, save, idx: dealerIdx });
      if (action === 'back') { router.go('hub'); return; }
      if (action === 'next') { dealerIdx = (dealerIdx + 1) % VEHICLES.length; return; }
      if (action === 'prev') { dealerIdx = (dealerIdx - 1 + VEHICLES.length) % VEHICLES.length; return; }
      if (action === 'buy') { doBuyVehicle(VEHICLES[dealerIdx]); return; }
      if (action === 'select') { driveVehicle(VEHICLES[dealerIdx].id); return; }
      return;
    }

    // Aspirations — row taps try to purchase; Back returns to hub; Cash Pot pill
    if (screen === 'aspirations') {
      const action = aspirations.hit(vx, vy, { W, H });
      if (action === 'back') { router.go('hub'); return; }
      if (action === 'cashpot') { cashpotResult = null; router.go('cashpot'); return; }
      // Tithes is a recurring offering, not a one-time buy — open its own screen.
      if (action === 'row:tithes') { router.go('tithes'); return; }
      if (action && action.startsWith('row:')) {
        const id = action.slice(4);
        if (canBuy(save, id)) {
          const ok = purchaseAspiration(save, id);
          if (ok) {
            writeSave(save);
            endingId = id;
            router.go('ending');
          }
        }
        return;
      }
      return;
    }

    // Cash Pot mini-game
    if (screen === 'cashpot') {
      const action = cashpotScreen.hit(vx, vy, { W, H });
      if (action === 'back') { router.go('aspirations'); return; }
      if (action === 'play') {
        cashpotResult = playCashPot(save, Math.random);
        writeSave(save);
        return;
      }
      return;
    }

    // Tithes & Offerings — choose an amount to give for a blessing
    if (screen === 'tithes') {
      const action = tithesScreen.hit(vx, vy, { W, H });
      if (action === 'back') { router.go('aspirations'); return; }
      if (action && action.startsWith('give:')) {
        const amount = offeringAmount(save, action.slice(5));
        if (giveTithe(save, amount)) { audio && audio.sfx('cash'); writeSave(save); }
        return;
      }
      return;
    }

    // Ending vignette — CONTINUE returns to hub
    if (screen === 'ending') {
      const action = ending.hit(vx, vy, { W, H });
      if (action === 'continue') { endingId = null; router.go('hub'); return; }
      return;
    }
  }

  function menuKey(key) {
    if (state.popup) { state.popup = null; return; }
    if (state.mode === 'gameover') { router.go('hub'); state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;
    const screen = router.current;
    if (screen === 'hub') {
      if (key === 'Enter' || key === ' ') router.go('play');
      return;
    }
    if (screen === 'play') {
      if (key === 'Escape') { router.go('hub'); return; }
      if (key === 'ArrowLeft') cycleDriver(-1);
      else if (key === 'ArrowRight') cycleDriver(1);
      else if (key === 'ArrowUp') cycleStage(-1);
      else if (key === 'ArrowDown') cycleStage(1);
      else if (key === ',') cycleGenre(-1);
      else if (key === '.') cycleGenre(1);
      else if (key === 'Enter' || key === ' ') startRun(menuChoice.character, menuChoice.stage);
      return;
    }
    if (screen === 'mechshop' || screen === 'cardealer' || screen === 'aspirations') {
      if (key === 'Escape') router.go('hub');
      return;
    }
    if (screen === 'cashpot' || screen === 'tithes') {
      if (key === 'Escape') router.go('aspirations');
      return;
    }
    if (screen === 'ending') {
      if (key === 'Escape' || key === 'Enter' || key === ' ') { endingId = null; router.go('hub'); }
      return;
    }
  }

  // --- menu / gameover screens ---
  function button(ctx, r, label, opts = {}) {
    ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = opts.text || '#f4f1e6';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = opts.font || '700 30px "Courier New", monospace';
    ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
  }

  function renderMenu(ctx) {
    const screen = router.current;
    if (screen === 'hub') {
      hub.render(ctx, { save, W, H });
      if (goldToast > 0) {
        const alpha = Math.min(1, goldToast / 30);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#d8b020';
        ctx.font = '700 28px "Courier New", monospace';
        ctx.fillText('★ GOLD CART UNLOCK ★', W / 2, H * 0.88);
        ctx.restore();
      }
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'mechshop') {
      mechshop.render(ctx, { save, W, H });
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'cardealer') {
      cardealer.render(ctx, { save, W, H, idx: dealerIdx });
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'aspirations') {
      aspirations.render(ctx, { save, W, H });
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'cashpot') {
      cashpotScreen.render(ctx, { save, lastResult: cashpotResult, W, H });
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'tithes') {
      tithesScreen.render(ctx, { save, W, H });
      if (state.popup) renderPopup(ctx, state.popup);
      return;
    }
    if (screen === 'ending') {
      ending.render(ctx, { aspirationId: endingId, W, H });
      return;
    }
    // 'play' screen — existing driver/stage/genre pickers
    renderPlayScreen(ctx);
  }

  function renderPlayScreen(ctx) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0c020'; ctx.font = '700 58px "Courier New", monospace';
    ctx.fillText('POTHOLE RUN', W / 2, H * 0.09);
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
    ctx.fillText('dodge di potholes — bank coins — upgrade di ride', W / 2, H * 0.15);

    // Back button
    button(ctx, BTN.back, '‹ HUB', { font: '700 18px "Courier New", monospace', stroke: '#9fb8a3', text: '#9fb8a3' });

    const driver = getCharacter(menuChoice.character);
    const stg = getStage(menuChoice.stage);

    // DRIVER
    button(ctx, BTN.driverPrev, '‹'); button(ctx, BTN.driverNext, '›');
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText(driver.name, W / 2, H * 0.225);

    // Show current vehicle (read-only — change it in Car Dealer)
    const veh = getVehicle(save.vehicle);
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 14px "Courier New", monospace';
    ctx.fillText('ride: ' + veh.name + '  (change in Car Dealer)', W / 2, H * 0.345);

    // STAGE
    button(ctx, BTN.stagePrev, '‹'); button(ctx, BTN.stageNext, '›');
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText(stg.name, W / 2, H * 0.61);

    // GENRE
    button(ctx, BTN.genrePrev, '‹'); button(ctx, BTN.genreNext, '›');
    ctx.fillStyle = '#cbe7cf'; ctx.font = '500 15px "Courier New", monospace';
    ctx.fillText('RIDDIM', W / 2, H * 0.66);
    ctx.fillStyle = '#f0c020'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText(GENRE_LABEL[menuChoice.genre] || 'Reggae', W / 2, H * 0.70);

    button(ctx, BTN.start, 'START');
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 15px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('wallet: ' + formatMoney(save.wallet) + '    ♪ press M to mute', W / 2, H * 0.97);

    if (state.popup) renderPopup(ctx, state.popup);
  }

  function renderPopup(ctx, p) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
    const bw = W * 0.74, bh = 230, bx = (W - bw) / 2, by = (H - bh) / 2;
    ctx.fillStyle = '#15241a'; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#f0c020'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0c020'; ctx.font = '700 30px "Courier New", monospace';
    ctx.fillText(p.title, W / 2, by + 44);
    ctx.fillStyle = '#eef0e6'; ctx.font = '500 17px "Courier New", monospace';
    p.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, by + 90 + i * 28));
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 15px "Courier New", monospace';
    ctx.fillText('tap to continue', W / 2, by + bh - 24);
  }

  function renderGameOver(ctx) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#c0382c'; ctx.font = '700 60px "Courier New", monospace';
    ctx.fillText('CART MASH UP!', W / 2, H * 0.3);
    ctx.fillStyle = '#cbe7cf'; ctx.font = '500 30px "Courier New", monospace';
    ctx.fillText(Math.floor(run.distance) + ' m   •   ' + formatMoney(run.coins), W / 2, H * 0.46);
    ctx.fillText('best: ' + (save.bests[stage.id] || 0) + ' m', W / 2, H * 0.54);
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 20px "Courier New", monospace';
    ctx.fillText('wallet: ' + formatMoney(save.wallet), W / 2, H * 0.61);
    // Rank display on gameover
    ctx.fillStyle = '#3fae54'; ctx.font = '700 20px "Courier New", monospace';
    ctx.fillText('rank: ' + rankFor(save.lifetimeEarned).label, W / 2, H * 0.68);
    ctx.fillStyle = '#f0c020'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText('TAP / PRESS TO CONTINUE', W / 2, H * 0.78);
  }

  return { state, update, render, onSteer, menuPoint, menuKey, toggleMute, menuChoice };
}
