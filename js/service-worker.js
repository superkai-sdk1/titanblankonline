const CACHE_NAME = 'mafia-reffere-v1';
const urlsToCache = [
    '/',
    '/css/mafia.css',
    '/css/styles.css'

    // добавьте другие важные ресурсы
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});