const CACHE = 'pothole-run-v2';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './src/main.js', './src/constants.js', './src/game.js', './src/road.js',
  './src/scenery.js', './src/cart.js', './src/cartSprite.js', './src/sprites.js', './src/entities.js',
  './src/run.js', './src/collision.js', './src/wreck.js', './src/spawner.js',
  './src/hazardTypes.js', './src/input.js', './src/hud.js', './src/audio.js',
  './src/characters.js', './src/stages.js', './src/save.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
