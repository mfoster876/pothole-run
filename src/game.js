import { VIRTUAL } from './constants.js';
import { makeRoad, renderRoad, projectEntity, CART_Z } from './road.js';
import { createCart, steer, updateCart } from './cart.js';
import { createField, spawn, advance, activeEntities } from './entities.js';
import { spawnInterval, pickHazard, laneFor } from './spawner.js';
import { createRun, resolveHits } from './run.js';
import { isWrecked } from './wreck.js';
import { renderHud, renderTouchZones } from './hud.js';
import { drawEntity } from './sprites.js';
import { drawCart } from './cartSprite.js';
import { getCharacter, CHARACTERS } from './characters.js';
import { getStage } from './stages.js';
import { loadSave, writeSave, recordBest, addCoins } from './save.js';

const W = VIRTUAL.width, H = VIRTUAL.height;

// Menu hit-regions (virtual coords).
const BTN = {
  driverPrev: { x: W * 0.20, y: H * 0.38, w: 56, h: 56 },
  driverNext: { x: W * 0.74, y: H * 0.38, w: 56, h: 56 },
  stagePrev:  { x: W * 0.20, y: H * 0.54, w: 56, h: 56 },
  stageNext:  { x: W * 0.74, y: H * 0.54, w: 56, h: 56 },
  start:      { x: W * 0.5 - 140, y: H * 0.74, w: 280, h: 64 }
};
function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

export function createGame(audio) {
  const save = loadSave();
  if (audio && audio.setMuted) audio.setMuted(save.settings.muted);
  const state = { mode: 'menu', save, audio };
  const menuChoice = { character: 'yute', stage: 'fern-gully' };
  let road, stage, cart, field, run, camZ, spawnZ, steerLock = 0;
  const rng = Math.random;

  function startRun(characterId, stageId) {
    road = makeRoad();
    stage = getStage(stageId);
    cart = createCart(getCharacter(characterId));
    field = createField();
    run = createRun();
    camZ = 0; spawnZ = 320; steerLock = 10;
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
    if (save.coins >= 150 && !u.characters.includes('conductor')) u.characters.push('conductor');
  }

  function update(dt) {
    if (state.mode !== 'play') return;
    if (steerLock > 0) steerLock--;
    updateCart(cart, dt);
    const dz = cart.speed * dt * 4;
    camZ += dz;
    run.distance += cart.speed * dt * 0.1 * cart.character.scoreMult;
    advance(field, dz);
    spawnZ -= dz;
    if (spawnZ <= 0) {
      spawn(field, pickHazard(stage.hazardWeights, rng), laneFor(rng, 3), 900);
      spawnZ = spawnInterval(run.distance) * 6;
    }
    const coinsBefore = run.coins, condBefore = cart.condition.value;
    resolveHits(run, cart, field);
    if (run.coins > coinsBefore) audio && audio.sfx('coin');
    else if (cart.condition.value < condBefore) audio && audio.sfx('hit');
    if (isWrecked(cart.condition)) endRun();
  }

  function render(ctx) {
    if (state.mode === 'menu') return renderMenu(ctx);
    if (state.mode === 'gameover') return renderGameOver(ctx);
    renderRoad(ctx, road, stage.palette, camZ, W, H);
    for (const e of activeEntities(field).sort((a, b) => b.z - a.z)) {
      const p = projectEntity(e.x, e.z, W, H);
      if (p.visible) drawEntity(ctx, e.type, p.x, p.y, p.size);
    }
    const cp = projectEntity(cart.x, CART_Z, W, H);
    drawCart(ctx, cart, cp.x, cp.y + 6, cp.size * 0.9);
    renderTouchZones(ctx, W, H);
    renderHud(ctx, { stageName: stage.name, coins: run.coins, distance: run.distance, condition: cart.condition }, W);
  }

  // --- input ---
  function onSteer(dir) { if (state.mode === 'play' && steerLock === 0) steer(cart, dir); }
  function cycleDriver(dir) {
    const list = save.unlocks.characters;
    menuChoice.character = list[(list.indexOf(menuChoice.character) + dir + list.length) % list.length];
  }
  function cycleStage(dir) {
    const list = save.unlocks.stages;
    menuChoice.stage = list[(list.indexOf(menuChoice.stage) + dir + list.length) % list.length];
  }
  function menuPoint(vx, vy) {
    if (state.mode === 'gameover') { state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;
    if (inRect(BTN.driverPrev, vx, vy)) cycleDriver(-1);
    else if (inRect(BTN.driverNext, vx, vy)) cycleDriver(1);
    else if (inRect(BTN.stagePrev, vx, vy)) cycleStage(-1);
    else if (inRect(BTN.stageNext, vx, vy)) cycleStage(1);
    else if (inRect(BTN.start, vx, vy)) startRun(menuChoice.character, menuChoice.stage);
  }
  function menuKey(key) {
    if (state.mode === 'gameover') { state.mode = 'menu'; return; }
    if (state.mode !== 'menu') return;
    if (key === 'ArrowLeft') cycleDriver(-1);
    else if (key === 'ArrowRight') cycleDriver(1);
    else if (key === 'ArrowUp') cycleStage(-1);
    else if (key === 'ArrowDown') cycleStage(1);
    else if (key === 'Enter' || key === ' ') startRun(menuChoice.character, menuChoice.stage);
  }
  function toggleMute() {
    save.settings.muted = !save.settings.muted;
    audio && audio.setMuted(save.settings.muted);
    writeSave(save);
  }

  // --- menu / gameover screens ---
  function button(ctx, r, label) {
    ctx.fillStyle = 'rgba(244,241,230,0.10)';
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = '#cbe7cf'; ctx.lineWidth = 2;
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = '#f4f1e6';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 30px "Courier New", monospace';
    ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
  }
  function statBars(ctx, c, cx, y) {
    const stats = [['SPD', c.topSpeed / 1.3], ['GRIP', c.handling / 1.1], ['TUF', c.toughness / 1.3]];
    ctx.font = '500 14px "Courier New", monospace'; ctx.textBaseline = 'middle';
    let x = cx - 150;
    for (const [label, v] of stats) {
      ctx.fillStyle = '#9fb8a3'; ctx.textAlign = 'left';
      ctx.fillText(label, x, y);
      ctx.fillStyle = '#2a3a2e'; ctx.fillRect(x + 44, y - 6, 60, 12);
      ctx.fillStyle = '#3fae54'; ctx.fillRect(x + 44, y - 6, 60 * Math.min(1, v), 12);
      x += 110;
    }
  }
  function renderMenu(ctx) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f0c020';
    ctx.font = '700 70px "Courier New", monospace';
    ctx.fillText('POTHOLE RUN', W / 2, H * 0.18);
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 18px "Courier New", monospace';
    ctx.fillText('dodge di potholes inna di sound-system cart', W / 2, H * 0.27);

    const driver = getCharacter(menuChoice.character);
    const stg = getStage(menuChoice.stage);
    button(ctx, BTN.driverPrev, '‹');
    button(ctx, BTN.driverNext, '›');
    button(ctx, BTN.stagePrev, '‹');
    button(ctx, BTN.stageNext, '›');
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 30px "Courier New", monospace';
    ctx.fillText(driver.name, W / 2, H * 0.38 + 14);
    statBars(ctx, driver, W / 2, H * 0.47);
    ctx.fillStyle = '#f4f1e6'; ctx.font = '700 30px "Courier New", monospace';
    ctx.fillText(stg.name, W / 2, H * 0.54 + 28);

    button(ctx, BTN.start, 'START');
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
    ctx.fillText('coins banked: ' + save.coins + '    ♪ press M to mute', W / 2, H * 0.92);
  }
  function renderGameOver(ctx) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#c0382c'; ctx.font = '700 60px "Courier New", monospace';
    ctx.fillText('CART MASH UP!', W / 2, H * 0.3);
    ctx.fillStyle = '#cbe7cf'; ctx.font = '500 30px "Courier New", monospace';
    ctx.fillText(Math.floor(run.distance) + ' m   •   $' + run.coins, W / 2, H * 0.48);
    ctx.fillText('best: ' + (save.bests[stage.id] || 0) + ' m', W / 2, H * 0.56);
    ctx.fillStyle = '#f0c020'; ctx.font = '700 26px "Courier New", monospace';
    ctx.fillText('TAP / PRESS TO CONTINUE', W / 2, H * 0.74);
  }

  return { state, update, render, onSteer, menuPoint, menuKey, toggleMute, menuChoice };
}
