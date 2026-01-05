const CACHE_NAME = "nurut-taqwa-v1";
const urlsToCache = [
  "/masjid-nurut-taqwa/",
  "/masjid-nurut-taqwa/index.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
