// tests/mechshop-tuning.test.js — the mech-shop overhaul: tune-ups radically change the
// FEEL (handling), parts can get BUSTED in a crash, and a paid RE-FIT bolts them back on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, updateCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { handlingBonus, upgradesForVehicle } from '../src/upgrades.js';
import { defaultSave, maybeBustPart, refitPart, bustedParts, ownedUpgrades } from '../src/save.js';
import { refitCost, REFIT_FACTOR } from '../src/screens/mechshop.js';

test('handlingBonus sums the handling of owned parts only', () => {
  const set = upgradesForVehicle('handcart');
  assert.equal(handlingBonus([], 'handcart'), 0);
  const two = [set[0].id, set[1].id];
  assert.ok(Math.abs(handlingBonus(two, 'handcart') - (set[0].handling + set[1].handling)) < 1e-9);
});

test('a kitted ride steers noticeably snappier than a stock one (tune-ups change the feel)', () => {
  const mk = (hb) => {
    const c = createCart(getCharacter('yute'), getVehicle('handcart'), 0, null, hb);
    c.laneIndex = 0; c.speed = 40; c.throttle = 0;
    return c;
  };
  const stock = mk(0), kitted = mk(handlingBonus(upgradesForVehicle('handcart').map(u => u.id), 'handcart'));
  updateCart(stock, 1 / 60, 0);
  updateCart(kitted, 1 / 60, 0);
  assert.ok(Math.abs(kitted.x) > Math.abs(stock.x), `kitted ${kitted.x} steers more than stock ${stock.x}`);
});

test('a wreck can BUST an owned part — moving it owned → busted', () => {
  const save = defaultSave();
  const set = upgradesForVehicle('handcart');
  save.upgrades.handcart = [set[0].id, set[1].id];
  const busted = maybeBustPart(save, 'handcart', true /* wrecked */, 0, () => 0.1 /* low → busts, picks idx 0 */);
  assert.equal(busted, set[0].id, 'the first part busted');
  assert.ok(!ownedUpgrades(save, 'handcart').includes(set[0].id), 'no longer owned');
  assert.ok(bustedParts(save, 'handcart').includes(set[0].id), 'now on the busted list');
});

test('a healthy run never busts a part; an empty rig never busts', () => {
  const save = defaultSave();
  save.upgrades.handcart = ['weighted-base'];
  assert.equal(maybeBustPart(save, 'handcart', false, 90, () => 0.01), null, 'healthy → no bust');
  const empty = defaultSave();
  assert.equal(maybeBustPart(empty, 'handcart', true, 0, () => 0.01), null, 'nothing fitted → nothing to bust');
});

test('re-fit costs a fraction of new and bolts the busted part back on', () => {
  const set = upgradesForVehicle('handcart');
  const u = set[0];
  assert.equal(refitCost(u), Math.round(u.price * REFIT_FACTOR));
  const save = defaultSave();
  save.busted.handcart = [u.id];
  save.wallet = refitCost(u);              // exactly enough
  assert.ok(refitPart(save, u, 'handcart', refitCost(u)), 're-fit succeeds when affordable');
  assert.equal(save.wallet, 0, 'wallet debited');
  assert.ok(ownedUpgrades(save, 'handcart').includes(u.id), 'owned again');
  assert.ok(!bustedParts(save, 'handcart').includes(u.id), 'cleared from busted');
});

test('re-fit fails when broke or when the part is not actually busted', () => {
  const set = upgradesForVehicle('handcart');
  const u = set[0];
  const broke = defaultSave(); broke.busted.handcart = [u.id]; broke.wallet = refitCost(u) - 1;
  assert.equal(refitPart(broke, u, 'handcart', refitCost(u)), false, 'cannot afford');
  const notBusted = defaultSave(); notBusted.wallet = 1e9;
  assert.equal(refitPart(notBusted, u, 'handcart', refitCost(u)), false, 'nothing busted to re-fit');
});
