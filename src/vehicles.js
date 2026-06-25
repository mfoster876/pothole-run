// The vehicle ladder you climb by banking coins. Stats MULTIPLY the driver's own
// personality stats (see cart.js), and are centred so the handcart ≈ 1.0 — the
// game's signature ride and the free default. `isCar` flags a windscreen worth
// wiping, which is what summons the soapy-can windscreen youths (see game.js).
//   speed     — top-speed multiplier
//   handling  — lane-change snappiness (higher = quicker, twitchier)
//   toughness — damage resistance (higher = survives more)
//   sprite    — which body to draw (see cartSprite.js)
// Prices are deliberately brutal: a car is hundreds of thousands, the premium
// marques are millions. Buying your way up should feel as out-of-reach as it does
// in real life — the grind (deep runs for paper money) or the races are how you
// actually close the gap.
// `stability` = how steady the ride is out of the box (higher = less wobble/wander).
// The handcart is deliberately low — wobbly and hard to control until you buy rig
// upgrades (see upgrades.js); cars are inherently steadier.
export const VEHICLES = [
  { id: 'bicycle',   name: 'Bicycle',         price: 8000,      speed: 0.78, handling: 1.35, toughness: 0.55, stability: 0.62, isCar: false, sprite: 'bicycle',   body: '#2b6cb0' },
  { id: 'handcart',  name: 'Sound-System Cart', price: 0,       speed: 1.00, handling: 1.00, toughness: 1.00, stability: 0.70, isCar: false, sprite: 'handcart',  body: '#7a4a22' },
  { id: 'probox',    name: 'White Probox',    price: 350000,    speed: 1.15, handling: 1.02, toughness: 1.08, stability: 1.05, isCar: true,  sprite: 'probox',    body: '#eef0f2' },
  { id: 'yengyeng',  name: 'Yeng Yeng Bike',  price: 220000,    speed: 1.38, handling: 1.30, toughness: 0.52, stability: 0.80, isCar: false, sprite: 'yengyeng',  body: '#c0392b' },
  { id: 'swift',     name: 'Suzuki Swift',    price: 900000,    speed: 1.26, handling: 1.12, toughness: 1.00, stability: 1.10, isCar: true,  sprite: 'swift',     body: '#5a7d9a' },
  { id: 'x6',        name: 'BMW X6 (White)',  price: 6500000,   speed: 1.46, handling: 1.04, toughness: 1.32, stability: 1.20, isCar: true,  sprite: 'x6',        body: '#f4f4f6' },
  { id: 'audi',      name: 'Audi',            price: 5500000,   speed: 1.56, handling: 1.16, toughness: 1.16, stability: 1.20, isCar: true,  sprite: 'audi',      body: '#2c2f34' },
  { id: 'porsche',   name: 'Porsche',         price: 12000000,  speed: 1.82, handling: 1.44, toughness: 0.96, stability: 1.25, isCar: true,  sprite: 'porsche',   body: '#d8b020' },
  { id: 'pickup',    name: 'Pickup Truck',    price: 2200000,   speed: 1.32, handling: 0.80, toughness: 1.62, stability: 1.15, isCar: true,  sprite: 'pickup',    body: '#3a5a3a' },
  { id: 'jetour',    name: 'Jetour EV',       price: 9000000,   speed: 1.72, handling: 1.22, toughness: 1.34, stability: 1.30, isCar: true,  sprite: 'jetour',    body: '#1f6f6f' },
  // Heavy stainless wedge: brick-fast & tanky, but the clumsiest thing to thread a gap with.
  { id: 'cybertruck',name: 'Cybertruck',      price: 22000000,  speed: 1.94, handling: 0.84, toughness: 2.05, stability: 1.40, isCar: true,  sprite: 'cybertruck',body: '#9aa0a6' }
];

export function getVehicle(id) {
  return VEHICLES.find(v => v.id === id) ?? VEHICLES[1]; // default: handcart
}
// Index in the ladder (for ordering the shop and "next to unlock" hints).
export function vehicleRank(id) {
  const i = VEHICLES.findIndex(v => v.id === id);
  return i < 0 ? 1 : i;
}
