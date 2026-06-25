export const STAGES = [
  {
    id: 'fern-gully', name: 'Fern Gully', locked: false, musicId: 'fern', scenery: 'fern',
    // a shaded, damp gorge — muted misty light, deep fern greens (not bright tropics)
    palette: { sky: '#a7bcae', hill: '#123417', ground: '#27592c', road: '#474b50', rumble: '#3f5836' },
    hazardWeights: [
      { type: 'pothole', weight: 5 }, { type: 'coin', weight: 4 },
      { type: 'slick', weight: 2 }, { type: 'stall', weight: 2 }, { type: 'manhole', weight: 1 },
      { type: 'taxi', weight: 3 }, { type: 'dog', weight: 2 },
      { type: 'jaywalker', weight: 2 }, { type: 'goat', weight: 2 },
      { type: 'police', weight: 1 },                            // rural — police only now and then
      { type: 'tools', weight: 3 }, { type: 'water', weight: 1 }
    ]
  },
  {
    id: 'holland-bamboo', name: 'Holland Bamboo', locked: true, musicId: 'bamboo', scenery: 'bamboo',
    palette: { sky: '#e7f3c8', hill: '#6b7a1e', ground: '#7c8a2a', road: '#5a5044', rumble: '#7a6a44' },
    // livestock (goat/cattle) is rural-only — kept out of new-kingston/negril
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'goat', weight: 3 }, { type: 'cattle', weight: 2 }, { type: 'bump', weight: 2 },
      { type: 'taxi', weight: 3 }, { type: 'coaster', weight: 2 }, { type: 'dog', weight: 2 },
      { type: 'cat', weight: 1 }, { type: 'jaywalker', weight: 2 },
      { type: 'police', weight: 1 },                            // rural — police only now and then
      { type: 'tools', weight: 3 }, { type: 'water', weight: 1 }
    ]
  },
  {
    id: 'negril', name: 'Negril 7-Mile', locked: true, musicId: 'negril', scenery: 'palm',
    palette: { sky: '#ffd9a0', hill: '#caa45a', ground: '#e8c98a', road: '#6b6b72', rumble: '#b9a06a' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'taxi', weight: 4 }, { type: 'hustler', weight: 2 }, { type: 'manhole', weight: 1 },
      { type: 'coaster', weight: 3 }, { type: 'jaywalker', weight: 2 },
      { type: 'dog', weight: 2 }, { type: 'cat', weight: 1 },
      { type: 'police', weight: 2 },                            // tourist strip — a fair police presence
      { type: 'tools', weight: 3 }, { type: 'water', weight: 1 }
    ]
  },
  {
    // Kingston — the only place the big yellow JUTC buses run.
    id: 'new-kingston', name: 'New Kingston', locked: true, musicId: 'kingston', scenery: 'zinc',
    palette: { sky: '#b7c2cc', hill: '#4a5560', ground: '#6a6f74', road: '#4c4f56', rumble: '#5a5048' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'bus', weight: 4 }, { type: 'taxi', weight: 4 }, { type: 'coaster', weight: 2 },
      { type: 'manhole', weight: 1 }, { type: 'jaywalker', weight: 3 }, { type: 'stall', weight: 2 },
      { type: 'dog', weight: 1 },
      { type: 'police', weight: 3 },                            // urban — police out in force
      { type: 'tools', weight: 3 }, { type: 'water', weight: 1 }
    ]
  }
];
export function getStage(id) {
  return STAGES.find(s => s.id === id) ?? STAGES[0];
}
