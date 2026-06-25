// tests/persistent-condition.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, startCondition } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { FLOOR_CONDITION } from '../src/constants.js';

test('a healthy saved cart starts at its saved condition', () => {
  const c = createCart(getCharacter('yute'), getVehicle('handcart'), 0, 73);
  assert.equal(c.condition.value, 73);
});
test('a battered saved cart is floored up to 40% for free', () => {
  assert.equal(startCondition(12), FLOOR_CONDITION);
  const c = createCart(getCharacter('yute'), getVehicle('handcart'), 0, 12);
  assert.equal(c.condition.value, FLOOR_CONDITION);
});
test('missing saved condition defaults to full', () => {
  const c = createCart(getCharacter('yute'));
  assert.equal(c.condition.value, 100);
});
