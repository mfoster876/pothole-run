import { VIRTUAL } from './constants.js';
import { makeRoad, renderRoad, projectEntity, curveOffsetAt, CART_Z } from './road.js';
import { createCart, steer, updateCart } from './cart.js';
import { createField, spawn, advance, activeEntities } from './entities.js';
import { spawnInterval, pickHazard, laneFor } from './spawner.js';
import { createRun, resolveHits } from './run.js';
import { isWrecked } from './wreck.js';
import { renderHud, renderTouchZones } from './hud.js';
import { drawEntity } from './sprites.js';
import { drawCart } from './cartSprite.js';
import { renderScenery } from './scenery.js';
import { getCharacter } from './characters.js';
import { getStage } from './stages.js';
import { VEHICLES, getVehicle } from './vehicles.js';
import { pickMoney, formatMoney } from './money.js';
import { loadSave, writeSave, recordBest, addCoins, buyVehicle, selectVehicle, GENRES } from './save.js';

const W = VIRTUAL.width, H = VIRTUAL.height;
const GENRE_LABEL = { reggae: 'Reggae', ska: 'Ska', dancehall: 'Dancehall', hiphop: 'Hip-Hop' };

// Menu hit-regions (virtual coords). One row each for driver, ride, stage, genre.
const arrow = (xf, yf) => ({ x: W * xf, y: H * yf - 24, w: 48, h: 48 });
const BTN = {
  driverPrev: arrow(0.15, 0.225), driverNext: arrow(0.80, 0.225),
  vehPrev:    arrow(0.15, 0.37),  vehNext:    arrow(0.80, 0.37),
  buy:        { x: W * 0.5 - 90, y: H * 0.515 - 20, w: 180, h: 40 },
  stagePrev:  arrow(0.15, 0.61),  stageNext:  arrow(0.80, 0.61),
  genrePrev:  arrow(0.15, 0.70),  genreNext:  arrow(0.80, 0.70),
  start:      { x: W * 0.5 - 130, y: H * 0.81 - 28, w: 260, h: 56 }
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
  const state = { mode: 'menu', save, audio, popup: null };
  const menuChoice = { character: 'yute', stage: 'fern-gully', vehicle: save.vehicle, genre: save.settings.genre };
  let road, stage, cart, field, run, camZ, spawnZ, steerLock = 0, activeWeights = [];
  let squeakAccum = 0, hitShake = 0; // hitShake: impact wobble (0..1), decays per frame
  const rng = Math.random;

  function startRun(characterId, stageId) {
    road = makeRoad();
    stage = getStage(stageId);
    cart = createCart(getCharacter(characterId), getVehicle(save.vehicle));
    field = createField();
    run = createRun();
    // windscreen youths only appear when you drive a car (a windscreen to wash)
    activeWeights = cart.vehicle.isCar
      ? stage.hazardWeights.concat([{ type: 'wiper', weight: 3 }])
      : stage.hazardWeights;
    camZ = 0; spawnZ = 600; steerLock = 10; squeakAccum = 0; hitShake = 0;
    state.mode = 'play';
    audio && audio.unlock();
    audio && audio.playStage(stage.musicId);
  }
  function endRun() {
    state.mode = 'gameover';
    audio && audio.sfx('wreck');
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
    if (state.mode !== 'play') return;
    if (steerLock > 0) steerLock--;
    updateCart(cart, dt);
    const dz = cart.speed * dt * 4;
    camZ += dz;
    run.distance += cart.speed * dt * 0.1 * cart.character.scoreMult;
    advance(field, dz, dt);
    spawnZ -= dz;
    if (spawnZ <= 0) {
      const type = pickHazard(activeWeights, rng);
      const lane = type === 'bus' ? 0 : laneFor(rng, 3); // JUTC buses overtake on the left
      const e = spawn(field, type, lane, 5200);
      if (type === 'coin') e.value = pickMoney(run.distance, rng); // denomination by depth
      spawnZ = spawnInterval(run.distance) * 8;
    }
    const coinsBefore = run.coins, condBefore = cart.condition.value;
    cart.gusted = false; cart.washed = false; cart.pickupValue = 0;
    resolveHits(run, cart, field);
    if (run.coins > coinsBefore) audio && audio.sfx(cart.pickupValue >= 100 ? 'cash' : 'coin');
    // any damage event ratchets the permanent rattle up (caps so it stays drivable)
    if (cart.condition.value < condBefore) cart.rattle = Math.min(0.5, cart.rattle + 0.05);
    if (cart.washed) { audio && audio.sfx('wash'); hitShake = Math.max(hitShake, 0.4); }
    else if (cart.condition.value < condBefore) { audio && audio.sfx('hit'); hitShake = 1; }
    if (cart.gusted) { audio && audio.sfx('whoosh'); hitShake = Math.max(hitShake, 0.55); }
    squeakAccum += dz;
    if (squeakAccum >= 215) { squeakAccum -= 215; audio && audio.sfx('squeak'); }
    if (hitShake > 0) hitShake = Math.max(0, hitShake - dt * 2.4);
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
    // jerky ride: rolling wobble + per-frame jitter scaled by the driver's `sway`,
    // AND by accumulated damage — the more battered the ride, the looser and harder
    // to control it gets (every hit drops condition, which feeds straight back here).
    const condFrac = cart.condition.value / cart.condition.max;          // 1 = pristine
    // condition-based wobble recovers if you heal; rattle is a one-way per-run ratchet
    const damageWobble = 1 + (1 - condFrac) * 1.3 + (cart.rattle || 0);  // up to ~2.8× battered
    const sway = (cart.character.sway || 1) * damageWobble;
    const wob = (Math.sin(camZ * 0.05) * 0.5 + Math.sin(camZ * 0.13 + 1) * 0.3) * sway;
    const kickY = -hitShake * cp.size * 0.18;
    const rockX = Math.sin(hitShake * 30) * hitShake * cp.size * 0.14;
    const bobPx = (wob + (Math.random() - 0.5) * 0.54 * sway) * cp.size * 0.063 + kickY;
    const jitX = (Math.random() - 0.5) * cp.size * 0.0225 * sway + rockX;
    drawCart(ctx, cart, cp.x + cartCurve + jitX, cp.y + 6 + bobPx, cp.size * 0.9);
    renderTouchZones(ctx, W, H);
    renderHud(ctx, { stageName: stage.name, coins: run.coins, distance: run.distance, condition: cart.condition }, W);
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
  // ride cycler walks the whole ladder; owned rides become your active ride
  function cycleVehicle(dir) {
    const i = VEHICLES.findIndex(v => v.id === menuChoice.vehicle);
    const v = VEHICLES[(i + dir + VEHICLES.length) % VEHICLES.length];
    menuChoice.vehicle = v.id;
    if (save.garage.includes(v.id)) driveVehicle(v.id);
  }
  function driveVehicle(id) {
    selectVehicle(save, id);
    if (getVehicle(id).isCar && !save.seenCarTip) { save.seenCarTip = true; state.popup = CAR_TIP; }
    writeSave(save);
  }
  function buyCurrent() {
    const v = getVehicle(menuChoice.vehicle);
    if (save.garage.includes(v.id)) return;
    if (buyVehicle(save, v)) { audio && audio.sfx('coin'); driveVehicle(v.id); }
    else { state.popup = { title: 'NUH RICH YET', lines: ['Yuh need ' + formatMoney(v.price) + ' fi di ' + v.name + '.', 'Win races or grind deep runs fi dat kinda money.'] }; }
  }
  function cycleGenre(dir) {
    const i = GENRES.indexOf(menuChoice.genre);
    const g = GENRES[(i + dir + GENRES.length) % GENRES.length];
    menuChoice.genre = g; save.settings.genre = g;
    audio && audio.setGenre(g); writeSave(save);
  }
  function menuPoint(vx, vy) {
    if (state.popup) { state.popup = null; return; }   // any tap dismisses a pop-up
    if (state.mode === 'gameover') { state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;
    if (inRect(BTN.driverPrev, vx, vy)) cycleDriver(-1);
    else if (inRect(BTN.driverNext, vx, vy)) cycleDriver(1);
    else if (inRect(BTN.vehPrev, vx, vy)) cycleVehicle(-1);
    else if (inRect(BTN.vehNext, vx, vy)) cycleVehicle(1);
    else if (inRect(BTN.buy, vx, vy) && !save.garage.includes(menuChoice.vehicle)) buyCurrent();
    else if (inRect(BTN.stagePrev, vx, vy)) cycleStage(-1);
    else if (inRect(BTN.stageNext, vx, vy)) cycleStage(1);
    else if (inRect(BTN.genrePrev, vx, vy)) cycleGenre(-1);
    else if (inRect(BTN.genreNext, vx, vy)) cycleGenre(1);
    else if (inRect(BTN.start, vx, vy)) startRun(menuChoice.character, menuChoice.stage);
  }
  function menuKey(key) {
    if (state.popup) { state.popup = null; return; }
    if (state.mode === 'gameover') { state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;
    if (key === 'ArrowLeft') cycleDriver(-1);
    else if (key === 'ArrowRight') cycleDriver(1);
    else if (key === 'ArrowUp') cycleStage(-1);
    else if (key === 'ArrowDown') cycleStage(1);
    else if (key === '[') cycleVehicle(-1);
    else if (key === ']') cycleVehicle(1);
    else if (key === 'b' || key === 'B') { if (!save.garage.includes(menuChoice.vehicle)) buyCurrent(); }
    else if (key === ',') cycleGenre(-1);
    else if (key === '.') cycleGenre(1);
    else if (key === 'Enter' || key === ' ') startRun(menuChoice.character, menuChoice.stage);
  }
  function toggleMute() {
    save.settings.muted = !save.settings.muted;
    audio && audio.setMuted(save.settings.muted);
    writeSave(save);
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
  function statBars(ctx, c, v, cx, y) {
    const spd = c.topSpeed * v.speed, grp = c.handling * v.handling, tuf = c.toughness * v.toughness;
    const stats = [['SPD', spd / 2.2], ['GRIP', grp / 1.9], ['TUF', tuf / 2.6]];
    ctx.font = '500 14px "Courier New", monospace'; ctx.textBaseline = 'middle';
    let x = cx - 165;
    for (const [label, val] of stats) {
      ctx.fillStyle = '#9fb8a3'; ctx.textAlign = 'left';
      ctx.fillText(label, x, y);
      ctx.fillStyle = '#2a3a2e'; ctx.fillRect(x + 46, y - 6, 60, 12);
      ctx.fillStyle = '#3fae54'; ctx.fillRect(x + 46, y - 6, 60 * Math.max(0.04, Math.min(1, val)), 12);
      x += 112;
    }
  }
  function renderMenu(ctx) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0c020'; ctx.font = '700 58px "Courier New", monospace';
    ctx.fillText('POTHOLE RUN', W / 2, H * 0.09);
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
    ctx.fillText('dodge di potholes — bank coins — upgrade di ride', W / 2, H * 0.15);

    const driver = getCharacter(menuChoice.character);
    const veh = getVehicle(menuChoice.vehicle);
    const stg = getStage(menuChoice.stage);
    const owned = save.garage.includes(veh.id);

    // DRIVER
    button(ctx, BTN.driverPrev, '‹'); button(ctx, BTN.driverNext, '›');
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText(driver.name, W / 2, H * 0.225);

    // RIDE — name, price/owned, a small live preview, and stats for this pairing
    button(ctx, BTN.vehPrev, '‹'); button(ctx, BTN.vehNext, '›');
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText(veh.name, W / 2, H * 0.345);
    const preview = createCart(driver, veh); preview.lean = 0;
    drawCart(ctx, preview, W / 2, H * 0.45, 16);
    statBars(ctx, driver, veh, W / 2, H * 0.40);
    if (owned) {
      ctx.fillStyle = '#3fae54'; ctx.font = '700 18px "Courier New", monospace';
      ctx.fillText(veh.id === save.vehicle ? '▶ DRIVING' : 'OWNED', W / 2, H * 0.515);
    } else {
      const afford = save.coins >= veh.price;
      button(ctx, BTN.buy, 'BUY  ' + formatMoney(veh.price), {
        font: '700 22px "Courier New", monospace',
        stroke: afford ? '#f0c020' : '#5a5a5a', text: afford ? '#f0c020' : '#7a7a7a'
      });
    }

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
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
    ctx.fillText('banked: ' + formatMoney(save.coins) + '    ♪ press M to mute', W / 2, H * 0.95);

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
    ctx.fillText(Math.floor(run.distance) + ' m   •   ' + formatMoney(run.coins), W / 2, H * 0.48);
    ctx.fillText('best: ' + (save.bests[stage.id] || 0) + ' m', W / 2, H * 0.56);
    ctx.fillStyle = '#f0c020'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText('TAP / PRESS TO CONTINUE', W / 2, H * 0.74);
  }

  return { state, update, render, onSteer, menuPoint, menuKey, toggleMute, menuChoice };
}
