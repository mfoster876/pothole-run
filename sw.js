const CACHE = 'pothole-run-v28';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './src/main.js', './src/constants.js', './src/game.js', './src/road.js',
  './src/scenery.js', './src/cart.js', './src/cartSprite.js', './src/sprites.js', './src/entities.js',
  './src/run.js', './src/collision.js', './src/wreck.js', './src/spawner.js',
  './src/hazardTypes.js', './src/input.js', './src/hud.js', './src/audio.js',
  './src/characters.js', './src/stages.js', './src/vehicles.js', './src/money.js',
  './src/upgrades.js', './src/save.js',
  // Wave 1 additions: economy/power-ups/bounties/solvability + the screen modules
  './src/economy.js', './src/powerups.js', './src/bounties.js', './src/solvability.js',
  './src/screens/router.js', './src/screens/hub.js', './src/screens/mechshop.js',
  './src/screens/cardealer.js', './src/screens/aspirations.js', './src/screens/rotatePrompt.js',
  // Wave 2: ranks, aspirations data/logic, cash pot, ending + cashpot screens
  './src/ranks.js', './src/aspirations.js', './src/cashpot.js',
  './src/screens/ending.js', './src/screens/cashpot.js',
  './src/tapcode.js',   // Wave 3: title tap-code secret
  './src/drinks.js',    // Phase 2: per-character drink boosts
  './src/tithes.js', './src/screens/tithes.js',  // Phase 2: variable tithe blessing
  './src/portrait.js',  // Phase 2: front-facing driver portraits
  './src/usermusic.js', './src/screens/help.js',  // Phase 2.1: custom soundtracks + help screen
  './src/radio.js',     // live Jamaican internet radio (riddim option)
  './src/charitems.js',  // Phase 2.2: character-specific bleach / wholesome items
  './src/races.js', './src/screens/races.js',  // Phase 2.4: bank-gated street races
  // Phase 3: rebalance + negatives framework, police, politician mechanics, legend
  './src/negatives.js', './src/legend.js', './src/screens/legend.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network-first: always serve the latest when online (and refresh the cache),
// fall back to cache when offline. Avoids stale code during active development.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
