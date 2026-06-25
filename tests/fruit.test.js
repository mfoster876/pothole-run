// tests/fruit.test.js — the paid street-fruit pickup: costs cash, gives strength + a dash.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPowerup, createEffects, effectActive } from '../src/powerups.js';
import { hazardInfo } from '../src/hazardTypes.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { FRUIT } from '../src/constants.js';

test('fruit costs a little cash but restores strength and gives a quick dash', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('rasta'));
  cart.condition.value = 50;
  const run = { coins: 1000 };
  applyPowerup(fx, cart, run, 'fruit', 0, hazardInfo('fruit'));
  assert.equal(run.coins, 1000 - FRUIT.cost, 'paid the vendor');
  assert.ok(cart.condition.value > 50, 'strength (condition) restored');
  assert.ok(effectActive(fx, 'super'), 'a brief dash');
});

test('the fruit hazard is a collectible powerup the spawner recognises', () => {
  const info = hazardInfo('fruit');
  assert.equal(info.collectible, true);
  assert.equal(info.powerup, 'fruit');
  assert.equal(info.label, 'Vendor Fruit');
});

test('a debt-proof driver (School Yute) floors at zero rather than going negative on fruit', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('yute'));   // debtProof
  const run = { coins: 50 };                        // less than the cost
  applyPowerup(fx, cart, run, 'fruit', 0, hazardInfo('fruit'));
  assert.equal(run.coins, 0, 'never driven into the red');
});
