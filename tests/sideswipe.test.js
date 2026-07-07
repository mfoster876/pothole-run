// tests/sideswipe.test.js — LONG traffic: the body occupies [z, z+len], so the pass is a
// window. Dodging the nose is not enough — steering into the flank mid-pass is a
// side-swipe (lighter than a head-on, plus a shove back); slipping past clean costs nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createField, spawn } from '../src/entities.js';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { hazardInfo } from '../src/hazardTypes.js';
import { SIDESWIPE } from '../src/constants.js';

const mkCart = () => { const c = createCart(getCharacter('yute'), getVehicle('handcart')); return c; };

test('traffic carries a real length; static hazards do not', () => {
  assert.ok(hazardInfo('bus').len >= 250, 'a JUTC bus is LONG');
  assert.ok(hazardInfo('taxi').len > 0 && hazardInfo('coaster').len > 0 && hazardInfo('coconutcart').len > 0);
  assert.ok(!hazardInfo('pothole').len, 'a pothole has no flank');
});

test('dodging the nose but steering into the flank mid-pass = SIDE-SWIPE (lighter hit)', () => {
  const cart = mkCart(); cart.x = 0;                    // centre lane
  const field = createField(); const run = createRun();
  const bus = spawn(field, 'bus', 0, 10);               // next lane over
  bus.z = 0;                                            // nose reaches the cart plane
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 100, 'nose crossing in another lane — no hit');
  assert.equal(bus.collected, false, 'the bus is still passing (window open)');
  // now the player steers INTO the bus while its body is alongside
  bus.z = -100;                                         // mid-pass (len 300 ⇒ body spans [-100, 200])
  cart.x = bus.x;
  resolveHits(run, cart, field);
  const headOn = hazardInfo('bus').damage / cart.character.toughness;
  const expected = headOn * SIDESWIPE.frac;
  assert.ok(cart.condition.value < 100, 'the flank bit');
  assert.ok(Math.abs((100 - cart.condition.value) - expected) < 1.5,
    `side-swipe is the lighter hit (took ${100 - cart.condition.value}, expected ≈${expected})`);
  assert.equal(cart.sideswiped, true, 'flagged for the HUD toast');
  assert.equal(run.combo, 0, 'combo resets');
});

test('a head-on into the nose is the FULL traffic hit, not a side-swipe', () => {
  const cart = mkCart(); const field = createField(); const run = createRun();
  const bus = spawn(field, 'bus', 1, 10);               // same lane as centre cart
  cart.x = bus.x;
  bus.z = 0;
  resolveHits(run, cart, field);
  const headOn = hazardInfo('bus').damage / cart.character.toughness;
  assert.ok(Math.abs((100 - cart.condition.value) - headOn) < 1.5, 'full head-on damage');
});

test('slipping past a long vehicle clean costs nothing and spends it', () => {
  const cart = mkCart(); cart.x = 0;
  const field = createField(); const run = createRun();
  const bus = spawn(field, 'bus', 0, 10);
  bus.z = 0; resolveHits(run, cart, field);             // nose passes, no overlap
  bus.z = -150; resolveHits(run, cart, field);          // alongside, still no overlap
  assert.equal(cart.condition.value, 100, 'no contact, no damage');
  bus.z = -301; resolveHits(run, cart, field);          // tail cleared (len 300)
  assert.equal(bus.collected, true, 'the pass is over — the bus is spent');
  cart.x = bus.x;                                       // steering over AFTER it cleared
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 100, 'no late hit from a vehicle already past');
});
