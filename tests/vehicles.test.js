import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VEHICLES, getVehicle } from '../src/vehicles.js';
import { defaultSave, buyVehicle, selectVehicle, GENRES } from '../src/save.js';
import { createCart, updateCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createField, spawn } from '../src/entities.js';
import { createRun, resolveHits, wiperCharge } from '../src/run.js';

test('vehicle ladder rises in price and the handcart is the free default', () => {
  assert.ok(VEHICLES.length >= 10);
  assert.equal(getVehicle('handcart').price, 0);
  const cars = VEHICLES.filter(v => v.isCar).map(v => v.id);
  assert.ok(cars.includes('probox') && cars.includes('cybertruck'));
  assert.ok(!getVehicle('handcart').isCar && !getVehicle('bicycle').isCar && !getVehicle('yengyeng').isCar);
});

test('buying deducts wallet, grants the ride, and refuses when too poor or owned', () => {
  const save = defaultSave();
  const probox = getVehicle('probox');
  save.wallet = probox.price - 1;
  assert.equal(buyVehicle(save, probox), false, 'cannot afford');
  save.wallet = probox.price + 50;
  assert.equal(buyVehicle(save, probox), true);
  assert.equal(save.wallet, 50);
  assert.ok(save.garage.includes('probox'));
  assert.equal(buyVehicle(save, probox), false, 'already owned, no double charge');
  assert.equal(save.wallet, 50);
});

test('selectVehicle only switches to an owned ride', () => {
  const save = defaultSave();
  selectVehicle(save, 'porsche');
  assert.equal(save.vehicle, 'handcart', 'not owned, no switch');
  save.garage.push('porsche');
  selectVehicle(save, 'porsche');
  assert.equal(save.vehicle, 'porsche');
});

test('a faster ride raises top speed for the same driver', () => {
  const yute = getCharacter('yute');
  const cart = createCart(yute, getVehicle('handcart'));
  const fast = createCart(yute, getVehicle('porsche'));
  for (let i = 0; i < 600; i++) { updateCart(cart, 1 / 60); updateCart(fast, 1 / 60); }
  assert.ok(fast.speed > cart.speed * 1.3, 'porsche clearly outruns the handcart');
});

test('windscreen youth costs coins on contact (forced wash, scaled charge)', () => {
  const cart = createCart(getCharacter('yute'), getVehicle('swift'));
  cart.x = 0; // dead centre
  const field = createField();
  const run = createRun(); run.coins = 5000;
  const e = spawn(field, 'wiper', 1, 0); // lane 1 == x 0, same lane, at the cart plane
  e.z = 0;
  resolveHits(run, cart, field);
  const charge = wiperCharge(0, getVehicle('swift'));
  assert.equal(run.coins, 5000 - charge);
  assert.equal(cart.washCharge, charge);
  assert.ok(cart.washed === true);
  assert.ok(cart.condition.value < 100, 'minor scrape damage too');
});

test('save defaults include a garage, a genre, and the unseen car tip', () => {
  const s = defaultSave();
  assert.deepEqual(s.garage, ['handcart']);
  assert.ok(GENRES.includes(s.settings.genre));
  assert.equal(s.seenCarTip, false);
});
