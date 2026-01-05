const CACHE_NAME = "nurut-taqwa-v2";
const OFFLINE_URL = "/masjid-nurut-taqwa/index.html";

const FILES_TO_CACHE = [
  OFFLINE_URL,
  "/masjid-nurut-taqwa/manifest.json",
  "/masjid-nurut-taqwa/icon-192.jpg",
  "/masjid-nurut-taqwa/icon-512.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
