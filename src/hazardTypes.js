import { DAMAGE } from './constants.js';
import { NEGATIVES } from './negatives.js';

// `category` lets a driver be immune to / take reduced damage from a whole class of
// hazard (the Politician is immune to police/pedestrian/animal — see characters.js).
// vz = extra closing speed (world units/s) for traffic that overtakes the cart.
// gust = blows the cart sideways when it passes in a neighbouring lane.
export const HAZARD_TYPES = {
  // `jolt` (0..1+) = how hard the ride bucks on impact (suspension bounce + screen shake
  //  + a sideways knock toward the shoulder). `splash` = throws a water plume (wet holes).
  pothole:  { damage: DAMAGE.pothole, collectible: false, depth: 3, color: '#1c1c1c', label: 'crater', category: 'road', jolt: 0.9 },
  manhole:  { damage: DAMAGE.manhole, collectible: false, depth: 3, color: '#000000', label: 'open manhole', category: 'road', jolt: 1.2 },
  coin:     { damage: 0,              collectible: true,  depth: 3, color: '#f0c020', label: 'coin' },
  goat:     { damage: DAMAGE.animal,  collectible: false, depth: 4, color: '#d8c7b0', label: 'goat', category: 'animal' },
  taxi:     { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#c0382c', label: 'route taxi', vz: 420, gust: 'fromTaxi', category: 'traffic' },
  bus:      { damage: DAMAGE.traffic, collectible: false, depth: 7, color: '#e7c84a', label: 'JUTC bus', vz: 260, gust: 'fromBus', category: 'traffic' },
  coaster:  { damage: DAMAGE.traffic, collectible: false, depth: 6, color: '#eef0f2', label: 'coaster bus', vz: 320, gust: 'fromCoaster', category: 'traffic', swerve: true },
  hustler:  { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#d06a30', label: 'hustler', category: 'pedestrian', walk: true },
  jaywalker:{ damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#3a6ea5', label: 'jaywalker', category: 'pedestrian', walk: true },
  // New Kingston street life — all WALK across the road (harder to time than a static obstacle)
  beggar:    { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#6a6356', label: 'wheelchair beggar', category: 'pedestrian', walk: true },
  vendor:    { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#c0392b', label: 'flower & fruit vendor', category: 'pedestrian', walk: true },
  peanutcart:{ damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#b5651d', label: 'peanut cart', category: 'pedestrian', walk: true },
  // Roadside broom-selling rasta — walks across the road like the other street vendors.
  broomman:  { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#3a6a3a', label: 'broom seller', category: 'pedestrian', walk: true },
  stall:    { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#7a4a22', label: 'vendor stall' },
  slick:    { damage: DAMAGE.bump,    collectible: false, depth: 3, color: '#3a4a6a', label: 'wet slick', jolt: 0.5, splash: true },
  bump:     { damage: DAMAGE.bump,    collectible: false, depth: 2, color: '#8a8a8a', label: 'sleeping policeman' },
  flood:    { damage: DAMAGE.bump,    collectible: false, depth: 4, color: '#5a705a', label: 'flooded patch', jolt: 0.6, splash: true },
  dog:      { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#9a7a4a', label: 'street dog', vz: 120, category: 'animal' },
  cat:      { damage: DAMAGE.animal,  collectible: false, depth: 2, color: '#5a5a5a', label: 'cat', vz: 160, category: 'animal' },
  cattle:   { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#5a4636', label: 'stray cattle', category: 'animal' },
  // Donkey coconut cart — a slow rural road-occupant (scrolls like a static obstacle, no vz).
  // Traffic-tier hit; rare and rural-only (only listed in the two country stages).
  coconutcart:{ damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#9a6a34', label: 'coconut cart', category: 'traffic' },
  // soapy-can windscreen youth — only spawns when you're driving a car. Minor
  // scrape damage, but costs you coins (`coinLoss` handled in run.js).
  wiper:    { damage: DAMAGE.wiper,   collectible: false, depth: 3, color: '#5aa0c0', label: 'windscreen youth', coinLoss: true, category: 'pedestrian' },
  // Police — urban-frequent road obstacle (weighted per stage). Traffic-tier damage
  // PLUS a cash fine on contact (run.js). The Politician is immune.
  police:   { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#27407a', label: 'police', category: 'police', fine: true },
  // ── Bog Walk Gorge RIVER MODE obstacles — float the Rio Cobre on a bamboo raft ──
  // Stylised floating LITTER (generic bottle, no brand) + a drifting plastic bag: light
  // knocks that splash. Crocodiles close in (vz) and bite. Burnt-out & floating car wrecks
  // are heavy. Limestone boulders jut from the water. River Mumma is the folklore siren you
  // must NOT touch — contact drags the raft under (near-wreck). All category 'river' unless
  // noted so no driver is immune to them.
  floatbottle: { damage: DAMAGE.bump,    collectible: false, depth: 3, color: '#7aa0b0', label: 'floating bottle', category: 'river', jolt: 0.4, splash: true },
  plasticbag:  { damage: DAMAGE.bump,    collectible: false, depth: 2, color: '#cfe0e6', label: 'plastic bag', category: 'river', jolt: 0.3, splash: true },
  croc:        { damage: DAMAGE.animal,  collectible: false, depth: 4, color: '#3a5a34', label: 'crocodile', category: 'animal', vz: 110, jolt: 0.6 },
  burntcar:    { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#2a2622', label: 'burnt-out car', category: 'river', jolt: 0.9, splash: true },
  floatcar:    { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#6a6f66', label: 'floating car', category: 'river', vz: 70, jolt: 0.8, splash: true },
  limerock:    { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#cbb98a', label: 'limestone rock', category: 'river', jolt: 1.0 },
  rivermumma:  { damage: 60,             collectible: false, depth: 6, color: '#2f7d7a', label: 'River Mumma', category: 'folklore', jolt: 1.1, splash: true },
  // Power-up collectibles — fully heal, boost, or open a money window
  water:    { damage: 0, collectible: true, powerup: 'water',  depth: 3, color: '#8fd3ff', label: 'water' },
  tools:    { damage: 0, collectible: true, powerup: 'tools',  depth: 3, color: '#c9c9c9', label: 'hardware tools' },
  coffee:   { damage: 0, collectible: true, powerup: 'coffee', depth: 3, color: '#5b3a1a', label: 'Blue Mountain coffee' },
  // Street-vendor fruit — a PAID pickup (any driver): costs a little cash, gives a quick
  // strength top-up (condition heal) + short dash. Routed to applyPowerup via powerup:'fruit'.
  fruit:    { damage: 0, collectible: true, powerup: 'fruit',  depth: 3, color: '#f4a020', label: 'Vendor Fruit' },
  // Jamaican street food (open to all; the Rasta gets the ital VEGGIE patty, not beef).
  // Ackee = national fruit: heal + steadiness. Patty = a dash + heal + pocket change.
  // Routed to applyPowerup via powerup:'food' → applyFood (see foods.js).
  ackee:       { damage: 0, collectible: true, powerup: 'food', food: 'ackee',       depth: 3, color: '#f2a33a', label: 'Ackee' },
  patty:       { damage: 0, collectible: true, powerup: 'food', food: 'patty',       depth: 3, color: '#e8b23a', label: 'Beef Patty' },
  veggiepatty: { damage: 0, collectible: true, powerup: 'food', food: 'veggiepatty', depth: 3, color: '#7bbf4a', label: 'Veggie Patty' },
  // Drink collectibles — character-gated; routed to applyDrink via powerup:'drink'
  ting:       { damage: 0, collectible: true, powerup: 'drink', drink: 'ting',       depth: 3, color: '#7ec850', label: 'Ting' },
  boom:       { damage: 0, collectible: true, powerup: 'drink', drink: 'boom',       depth: 3, color: '#141414', label: 'Boom' },
  redstripe:  { damage: 0, collectible: true, powerup: 'drink', drink: 'redstripe',  depth: 3, color: '#d12b1f', label: 'Red Stripe' },
  whiterum:   { damage: 0, collectible: true, powerup: 'drink', drink: 'whiterum',   depth: 3, color: '#eef2f5', label: 'White Rum' },
  spirulina:  { damage: 0, collectible: true, powerup: 'drink', drink: 'spirulina',  depth: 3, color: '#1f8a4c', label: 'Spirulina' },
  rootstonic: { damage: 0, collectible: true, powerup: 'drink', drink: 'rootstonic', depth: 3, color: '#7a4a22', label: 'Roots Tonic' },
  // Di Politician's top-shelf bottles (cognac + wines)
  henny:      { damage: 0, collectible: true, powerup: 'drink', drink: 'henny',      depth: 3, color: '#b5651d', label: 'Hennessy' },
  rose:       { damage: 0, collectible: true, powerup: 'drink', drink: 'rose',       depth: 3, color: '#e89aa6', label: 'Rosé' },
  whitewine:  { damage: 0, collectible: true, powerup: 'drink', drink: 'whitewine',  depth: 3, color: '#ece6b0', label: 'White Wine' },
  champagne:  { damage: 0, collectible: true, powerup: 'drink', drink: 'champagne',  depth: 3, color: '#f7d873', label: 'Champagne' },
  // (Conductor's cake soap / curry powder / toothpaste / sunlight are AVOID-hazards now —
  // generated below from negatives.js, not pickups.)
  // School-Yute-only wholesome items — steadiness / heal / refreshment dash
  // Politician perks — private-sector bribe (cash) + lady of di night (boost, drains cash)
  privatebribe: { damage: 0, collectible: true, powerup: 'charitem', item: 'privatebribe', depth: 3, color: '#1f9a4c', label: 'Private-Sector Bribe' },
  ladynight:    { damage: 0, collectible: true, powerup: 'charitem', item: 'ladynight',    depth: 3, color: '#c0306a', label: 'Lady of di Night' },
  books:      { damage: 0, collectible: true, powerup: 'charitem', item: 'books',      depth: 3, color: '#c0451f', label: 'Books' },
  stationery: { damage: 0, collectible: true, powerup: 'charitem', item: 'stationery', depth: 3, color: '#1f9ad9', label: 'Stationery' },
  bagjuice:   { damage: 0, collectible: true, powerup: 'charitem', item: 'bagjuice',   depth: 3, color: '#e23f7a', label: 'Bag Juice' },
  lasco:      { damage: 0, collectible: true, powerup: 'charitem', item: 'lasco',      depth: 3, color: '#f0d8a0', label: 'Lasco Shake' },
};
// Negatives (yute temptations / rasta avoidances / politician responsibilities) are
// non-collectible, character-gated road objects. Their bite (damage/drain/impair) is
// applied in run.js via applyNegative — here they carry only `negative:'<id>'`, zero
// generic damage, plus the colour/label kept in sync with the framework.
for (const n of Object.values(NEGATIVES)) {
  HAZARD_TYPES[n.id] = {
    damage: 0, collectible: false, depth: 3, color: n.color, label: n.label, negative: n.id,
  };
}

export function hazardInfo(type) {
  return HAZARD_TYPES[type] ?? HAZARD_TYPES.pothole;
}
