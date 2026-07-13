const cacheName = "questforge-fitness-alpha-v46";
const assets = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data/workouts.tsv",
  "./data/class-mixes.tsv",
  "./data/class-preferences.tsv",
  "./docs/workout-generation-requirements.md",
  "./docs/feature-backlog.md",
  "./manifest.json",
  "./assets/questforge-app-icon.png",
  "./assets/questforge-icon-180.png",
  "./assets/questforge-icon-192.png",
  "./assets/questforge-icon-512.png",
  "./assets/questforge-icon-maskable-512.png",
  "./assets/questforge-logo-black-bg.png",
  "./assets/questforge-logo-transparent-color.png",
  "./assets/questforge-logo-transparent-black.png",
  "./assets/reroll-die.png",
  "./assets/barbarian-class.png",
  "./assets/box-breathing.png",
  "./assets/brisk-walk.png",
  "./assets/monk-class.png",
  "./assets/goblet-squat.png",
  "./assets/dumbbell-floor-press.png",
  "./assets/dumbbell-split-squat.png",
  "./assets/farmers-carry.png",
  "./assets/hammer-curl.png",
  "./assets/sun-salutation-flow.png",
  "./assets/single-leg-reach.png",
  "./assets/ranger-class.png",
  "./assets/paladin-class.png",
  "./assets/rogue-class.png",
  "./assets/druid-class.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(cacheName).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
