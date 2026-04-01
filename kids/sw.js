const CACHE_NAME = 'frydent-kids-v1';
const ASSETS = [
  '/kids/',
  '/kids/index.html',
  '/kids/manifest.json',
  '/kids/icon-192.svg',
  '/kids/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
