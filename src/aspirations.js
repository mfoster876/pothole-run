// src/aspirations.js
// The nine social-mobility "outs" — data module used by both the screen and
// logic layer. Spending wallet never touches lifetimeEarned (ranks stay honest).
import { spend, canAfford } from './economy.js';

export const ASPIRATIONS = [
  { id: 'tithes',   name: 'Tithes & Offerings', price: 1500000,   blurb: 'Give faithful, build community.' },
  { id: 'school',   name: 'Education',          price: 3000000,   blurb: 'A degree — the long road up.' },
  { id: 'artist',   name: 'Visual Artist',      price: 4000000,   blurb: 'Studio, materials, first show.' },
  { id: 'business', name: 'Open a Business',     price: 5000000,   blurb: 'Yuh own likkle shop.' },
  { id: 'music',    name: 'Musician / Studio',   price: 6000000,   blurb: 'Book the studio, cut the riddim.' },
  { id: 'migrate',  name: 'Migrate / Fly Weh',   price: 7000000,   blurb: 'Visa, ticket, a new start farin.' },
  { id: 'farm',     name: 'Agriculture',         price: 10000000,  blurb: 'Land, seed, and sweat.' },
  { id: 'hills',    name: 'House inna di Hills',  price: 50000000,  blurb: 'Uptown, gate and all.' },
  { id: 'hotel',    name: 'Hotel / Beachfront',  price: 250000000, blurb: 'Sea in front, yours.' }
];

export function getAspiration(id) { return ASPIRATIONS.find(a => a.id === id); }

export function isAchieved(save, id) {
  return save.aspirations.achieved.includes(id);
}

export function canBuy(save, id) {
  const a = getAspiration(id);
  return !!a && !isAchieved(save, id) && canAfford(save, a.price);
}

export function purchaseAspiration(save, id) {
  if (!canBuy(save, id)) return false;
  spend(save, getAspiration(id).price);
  save.aspirations.achieved.push(id);
  return true;
}
