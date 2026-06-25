import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STABILITY_UPGRADES, stabilityBonus, nextUpgrade } from '../src/upgrades.js';
import { defaultSave, buyUpgrade } from '../src/save.js';
import { createCart, onShoulder, isShoulder } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';

test('stabilityBonus sums owned upgrades; nextUpgrade walks the ladder', () => {
  assert.equal(stabilityBonus([]), 0);
  assert.equal(nextUpgrade([]).id, STABILITY_UPGRADES[0].id);
  const all = STABILITY_UPGRADES.map(u => u.id);
  assert.ok(stabilityBonus(all) > 0.7);
  assert.equal(nextUpgrade(all), null); // fully upgraded
});

test('buyUpgrade deducts wallet, grants, and refuses when poor or owned', () => {
  const save = defaultSave();
  const u = STABILITY_UPGRADES[0];
  save.wallet = u.price - 1;
  assert.equal(buyUpgrade(save, u), false);
  save.wallet = u.price + 100;
  assert.equal(buyUpgrade(save, u), true);
  assert.equal(save.wallet, 100);
  assert.ok(save.upgrades.includes(u.id));
  assert.equal(buyUpgrade(save, u), false); // no double-buy
});

test('upgrades raise the cart stability; the bare handcart is wobbly', () => {
  const bare = createCart(getCharacter('yute'), getVehicle('handcart'), 0);
  const decked = createCart(getCharacter('yute'), getVehicle('handcart'), stabilityBonus(STABILITY_UPGRADES.map(u => u.id)));
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
