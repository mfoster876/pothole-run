import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STABILITY_UPGRADES, stabilityBonus, nextUpgrade, upgradesForVehicle } from '../src/upgrades.js';
import { defaultSave, buyUpgrade, ownedUpgrades } from '../src/save.js';
import { createCart, onShoulder, isShoulder } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';

test('stabilityBonus sums owned upgrades; nextUpgrade walks the ladder', () => {
  assert.equal(stabilityBonus([], 'handcart'), 0);
  assert.equal(nextUpgrade([], 'handcart').id, STABILITY_UPGRADES[0].id);
  const all = STABILITY_UPGRADES.map(u => u.id);
  assert.ok(stabilityBonus(all, 'handcart') > 0.7);
  assert.equal(nextUpgrade(all, 'handcart'), null); // fully upgraded
});

test('the upgrade set is tailored to the ride (cart vs car vs EV)', () => {
  const rig = upgradesForVehicle('handcart').map(u => u.id);
  const car = upgradesForVehicle('porsche').map(u => u.id);
  const ev  = upgradesForVehicle('cybertruck').map(u => u.id);
  assert.notDeepEqual(rig, car, 'a car shows different parts than a handcart');
  assert.notDeepEqual(car, ev, 'an EV shows different parts than a petrol car');
  assert.ok(car.includes('roll-cage') && rig.includes('wide-axle'));
});

test('buyUpgrade is per-vehicle: a car part does not carry to the handcart', () => {
  const save = defaultSave();
  const carPart = upgradesForVehicle('porsche')[0];
  save.wallet = carPart.price + 100;
  assert.equal(buyUpgrade(save, carPart, 'porsche'), true);
  assert.equal(save.wallet, 100);
  assert.ok(ownedUpgrades(save, 'porsche').includes(carPart.id));
  assert.deepEqual(ownedUpgrades(save, 'handcart'), [], 'handcart unaffected');
  assert.equal(buyUpgrade(save, carPart, 'porsche'), false); // no double-buy
});

test('buyUpgrade refuses when too poor', () => {
  const save = defaultSave();
  const u = STABILITY_UPGRADES[0];
  save.wallet = u.price - 1;
  assert.equal(buyUpgrade(save, u, 'handcart'), false);
  assert.deepEqual(ownedUpgrades(save, 'handcart'), []);
});

test('upgrades raise the cart stability; the bare handcart is wobbly', () => {
  const bare = createCart(getCharacter('yute'), getVehicle('handcart'), 0);
  const decked = createCart(getCharacter('yute'), getVehicle('handcart'), stabilityBonus(STABILITY_UPGRADES.map(u => u.id), 'handcart'));
  assert.ok(bare.stability < 0.8, 'starts wobbly');
  assert.ok(decked.stability > bare.stability + 0.5, 'upgrades steady it');
});

test('the outer slots are the soft shoulder, the inner three are lanes', () => {
  assert.equal(isShoulder(0), true);
  assert.equal(isShoulder(4), true);
  assert.equal(isShoulder(2), false);
  const cart = createCart(getCharacter('yute'));
  assert.equal(onShoulder(cart), false);
});
