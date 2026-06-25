import { DAMAGE } from './constants.js';

// vz = extra closing speed (world units/s) for traffic that overtakes the cart.
// gust = blows the cart sideways when it passes in a neighbouring lane.
export const HAZARD_TYPES = {
  pothole:  { damage: DAMAGE.pothole, collectible: false, depth: 3, color: '#1c1c1c', label: 'crater' },
  manhole:  { damage: DAMAGE.manhole, collectible: false, depth: 3, color: '#000000', label: 'open manhole' },
  coin:     { damage: 0,              collectible: true,  depth: 3, color: '#f0c020', label: 'coin' },
  goat:     { damage: DAMAGE.animal,  collectible: false, depth: 4, color: '#d8c7b0', label: 'goat' },
  taxi:     { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#c0382c', label: 'route taxi', vz: 420, gust: 'fromTaxi' },
  bus:      { damage: DAMAGE.traffic, collectible: false, depth: 7, color: '#e7c84a', label: 'JUTC bus', vz: 260, gust: 'fromBus' },
  coaster:  { damage: DAMAGE.traffic, collectible: false, depth: 6, color: '#eef0f2', label: 'coaster bus', vz: 320, gust: 'fromCoaster' },
  hustler:  { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#d06a30', label: 'hustler' },
  jaywalker:{ damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#3a6ea5', label: 'jaywalker' },
  stall:    { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#7a4a22', label: 'vendor stall' },
  slick:    { damage: DAMAGE.bump,    collectible: false, depth: 3, color: '#3a4a6a', label: 'wet slick' },
  bump:     { damage: DAMAGE.bump,    collectible: false, depth: 2, color: '#8a8a8a', label: 'sleeping policeman' },
  flood:    { damage: DAMAGE.bump,    collectible: false, depth: 4, color: '#5a705a', label: 'flooded patch' },
  dog:      { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#9a7a4a', label: 'street dog', vz: 120 },
  cat:      { damage: DAMAGE.animal,  collectible: false, depth: 2, color: '#5a5a5a', label: 'cat', vz: 160 },
  cattle:   { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#5a4636', label: 'stray cattle' },
  // soapy-can windscreen youth — only spawns when you're driving a car. Minor
  // scrape damage, but costs you coins (`coinLoss` handled in run.js).
  wiper:    { damage: DAMAGE.wiper,   collectible: false, depth: 3, color: '#5aa0c0', label: 'windscreen youth', coinLoss: true },
  // Power-up collectibles — fully heal, boost, or open a money window
  water:    { damage: 0, collectible: true, powerup: 'water',  depth: 3, color: '#8fd3ff', label: 'water' },
  tools:    { damage: 0, collectible: true, powerup: 'tools',  depth: 3, color: '#c9c9c9', label: 'hardware tools' },
  coffee:   { damage: 0, collectible: true, powerup: 'coffee', depth: 3, color: '#5b3a1a', label: 'Blue Mountain coffee' },
  // Drink collectibles — character-gated; routed to applyDrink via powerup:'drink'
  ting:       { damage: 0, collectible: true, powerup: 'drink', drink: 'ting',       depth: 3, color: '#7ec850', label: 'Ting' },
  boom:       { damage: 0, collectible: true, powerup: 'drink', drink: 'boom',       depth: 3, color: '#1f78d1', label: 'Boom' },
  redstripe:  { damage: 0, collectible: true, powerup: 'drink', drink: 'redstripe',  depth: 3, color: '#d12b1f', label: 'Red Stripe' },
  whiterum:   { damage: 0, collectible: true, powerup: 'drink', drink: 'whiterum',   depth: 3, color: '#eef2f5', label: 'White Rum' },
  spirulina:  { damage: 0, collectible: true, powerup: 'drink', drink: 'spirulina',  depth: 3, color: '#1f8a4c', label: 'Spirulina' },
  rootstonic: { damage: 0, collectible: true, powerup: 'drink', drink: 'rootstonic', depth: 3, color: '#7a4a22', label: 'Roots Tonic' },
};
export function hazardInfo(type) {
  return HAZARD_TYPES[type] ?? HAZARD_TYPES.pothole;
}
