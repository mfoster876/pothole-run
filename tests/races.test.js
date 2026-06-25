// tests/races.test.js — bank-gated head-to-head street races
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RACE_TIERS, tierById, availableTiers, canEnter, makeRivals,
  enterRace, tickRival, placement, settleRace,
} from '../src/races.js';
import { BILLS } from '../src/money.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const saveWith = (bank, wallet) => ({ lifetimeEarned: bank, wallet });

// ---- tiers & gating ----

test('all buy-ins and purses are strict bills / bill-multiples', () => {
  for (const t of RACE_TIERS) {
    assert.ok(BILLS.includes(t.buyIn), `${t.id} buyIn ${t.buyIn} is a strict bill`);
    assert.equal(t.purse % 100, 0, `${t.id} purse is a clean amount`);
  }
});

test('bank gates which tiers are available', () => {
  assert.deepEqual(availableTiers(saveWith(0, 0)).map(t => t.id), ['corner']);
  assert.deepEqual(availableTiers(saveWith(5000, 0)).map(t => t.id), ['corner', 'crosstown']);
  assert.equal(availableTiers(saveWith(100000, 0)).length, 3);
});

test('canEnter needs BOTH the bank unlock and the buy-in in the wallet', () => {
  const champ = tierById('championship');
  assert.equal(canEnter(saveWith(100000, 100), champ), false, 'unlocked but cannot afford');
  assert.equal(canEnter(saveWith(50000, 5000), champ), false, 'affordable but not unlocked');
  assert.ok(canEnter(saveWith(100000, 5000), champ));
});

// ---- entry deducts the buy-in ----

test('enterRace deducts the buy-in and builds 3 rivals', () => {
  const save = saveWith(0, 1000);
  const race = enterRace(save, tierById('corner'), mulberry32(1));
  assert.ok(race);
  assert.equal(save.wallet, 900, 'buy-in deducted');
  assert.equal(race.rivals.length, 3);
  assert.equal(race.finish, tierById('corner').distance);
});

test('enterRace refuses (returns null, no charge) when you cannot enter', () => {
  const save = saveWith(0, 50);
  assert.equal(enterRace(save, tierById('corner')), null);
  assert.equal(save.wallet, 50, 'no charge on a refused entry');
});

// ---- rivals & placement ----

test('a rival advances, and a stumble slows it', () => {
  const r = makeRivals(tierById('corner'), mulberry32(2))[0];
  const before = r.dist;
  tickRival(r, 0.1, 100, () => 1);      // rng=1 → never triggers a new stumble
  assert.ok(r.dist > before, 'rival moves forward');
  r.stumble = 0.6;
  const d0 = r.dist; tickRival(r, 0.1, 100, () => 1);
  const slowGain = r.dist - d0;
  r.stumble = 0; const d1 = r.dist; tickRival(r, 0.1, 100, () => 1);
  assert.ok((r.dist - d1) > slowGain, 'stumbling rival gains less ground than a clean one');
});

test('placement = 1 when leading, grows as rivals get ahead', () => {
  const rivals = [{ dist: 50 }, { dist: 120 }, { dist: 30 }];
  assert.equal(placement(200, rivals), 1, 'player ahead of all → 1st');
  assert.equal(placement(100, rivals), 2, 'one rival ahead → 2nd');
  assert.equal(placement(10, rivals), 4, 'all three ahead → 4th');
});

// ---- payouts ----

test('1st banks the full purse to wallet AND lifetime', () => {
  const save = saveWith(0, 0);
  const res = settleRace(save, tierById('crosstown'), 1);
  assert.equal(res.winnings, 5000);
  assert.equal(save.wallet, 5000);
  assert.equal(save.lifetimeEarned, 5000, 'a win lifts career bank/rank too');
});

test('2nd returns the buy-in (a push), 4th wins nothing', () => {
  const a = saveWith(0, 0); settleRace(a, tierById('corner'), 2);
  assert.equal(a.wallet, 100, '2nd = buy-in back');
  const b = saveWith(0, 0); const r = settleRace(b, tierById('corner'), 4);
  assert.equal(r.winnings, 0);
  assert.equal(b.wallet, 0, '4th banks nothing');
});

test('a full corner race: buy in, race to the line, settle a win nets the purse minus buy-in', () => {
  const save = saveWith(0, 1000);
  const tier = tierById('corner');
  const race = enterRace(save, tier, mulberry32(7));        // -100 → wallet 900
  // drive the player to the line while rivals tick at a slower reference speed
  let playerDist = 0;
  for (let i = 0; i < 2000 && playerDist < race.finish; i++) {
    playerDist += 100 * (1 / 60);
    for (const r of race.rivals) tickRival(r, 1 / 60, 70, () => 0.99);
  }
  const place = placement(playerDist, race.rivals);
  const res = settleRace(save, tier, place);
  assert.equal(place, 1, 'a clean fast line beats the slower rivals');
  assert.equal(save.wallet, 900 + tier.purse, 'net = purse minus the buy-in already paid');
  assert.equal(res.winnings, tier.purse);
});
