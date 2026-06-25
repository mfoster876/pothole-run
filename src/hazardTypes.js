import { DAMAGE } from './constants.js';

export const HAZARD_TYPES = {
  pothole:  { damage: DAMAGE.pothole, collectible: false, depth: 3, color: '#1c1c1c', label: 'crater' },
  manhole:  { damage: DAMAGE.manhole, collectible: false, depth: 3, color: '#000000', label: 'open manhole' },
  coin:     { damage: 0,              collectible: true,  depth: 3, color: '#f0c020', label: 'coin' },
  goat:     { damage: DAMAGE.animal,  collectible: false, depth: 4, color: '#d8c7b0', label: 'goat' },
  taxi:     { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#c0382c', label: 'route taxi' },
  bus:      { damage: DAMAGE.traffic, collectible: false, depth: 6, color: '#e7c84a', label: 'JUTC bus' },
  hustler:  { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#d06a30', label: 'hustler' },
  stall:    { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#7a4a22', label: 'vendor stall' },
  slick:    { damage: DAMAGE.bump,    collectible: false, depth: 3, color: '#3a4a6a', label: 'wet slick' },
  bump:     { damage: DAMAGE.bump,    collectible: false, depth: 2, color: '#8a8a8a', label: 'sleeping policeman' },
  flood:    { damage: DAMAGE.bump,    collectible: false, depth: 4, color: '#5a705a', label: 'flooded patch' },
  dog:      { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#9a7a4a', label: 'street dog' },
  cattle:   { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#5a4636', label: 'stray cattle' }
};
export function hazardInfo(type) {
  return HAZARD_TYPES[type] ?? HAZARD_TYPES.pothole;
}
