export const STAGES = [
  {
    id: 'fern-gully', name: 'Fern Gully', locked: false, musicId: 'fern', scenery: 'fern',
    palette: { sky: '#cdeef0', hill: '#1e5e2a', ground: '#3a8f44', road: '#54585e', rumble: '#3f6b3f' },
    hazardWeights: [
      { type: 'pothole', weight: 5 }, { type: 'coin', weight: 4 },
      { type: 'slick', weight: 2 }, { type: 'stall', weight: 2 }, { type: 'manhole', weight: 1 },
      { type: 'taxi', weight: 3 }, { type: 'bus', weight: 2 }, { type: 'dog', weight: 2 },
      { type: 'jaywalker', weight: 2 }, { type: 'goat', weight: 2 }
    ]
  },
  {
    id: 'holland-bamboo', name: 'Holland Bamboo', locked: true, musicId: 'bamboo', scenery: 'bamboo',
    palette: { sky: '#e7f3c8', hill: '#6b7a1e', ground: '#7c8a2a', road: '#5a5044', rumble: '#7a6a44' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'goat', weight: 3 }, { type: 'bus', weight: 2 }, { type: 'bump', weight: 2 },
      { type: 'taxi', weight: 3 }, { type: 'coaster', weight: 2 }, { type: 'dog', weight: 2 },
      { type: 'cat', weight: 1 }, { type: 'jaywalker', weight: 2 }
    ]
  },
  {
    id: 'negril', name: 'Negril 7-Mile', locked: true, musicId: 'negril', scenery: 'palm',
    palette: { sky: '#ffd9a0', hill: '#caa45a', ground: '#e8c98a', road: '#6b6b72', rumble: '#b9a06a' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'taxi', weight: 4 }, { type: 'hustler', weight: 2 }, { type: 'manhole', weight: 1 },
      { type: 'coaster', weight: 3 }, { type: 'bus', weight: 2 }, { type: 'jaywalker', weight: 2 },
      { type: 'dog', weight: 2 }, { type: 'cat', weight: 1 }
    ]
  }
];
export function getStage(id) {
  return STAGES.find(s => s.id === id) ?? STAGES[0];
}
