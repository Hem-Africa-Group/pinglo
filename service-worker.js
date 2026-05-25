const CACHE_NAME = 'pinglo-v1-cache';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, try to return the cached page, 
      // or fall back to the offline page
      return caches.match(event.request).then((response) => {
        return response || caches.match(OFFLINE_URL);
      });
    })
  );
});