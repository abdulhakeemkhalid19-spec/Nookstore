// NookStore 500 — Service Worker
// Enables basic PWA caching and offline access.

const CACHE_NAME = "nookstore-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

// Install service worker and cache essential files.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Remove old caches when the service worker updates.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  self.clients.claim();
});

// Serve cached files when offline; otherwise try the network.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestURL = new URL(event.request.url);

  // Do not cache requests to external services, such as Supabase.
  if (requestURL.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const responseCopy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // Show the cached homepage if a page cannot load offline.
        if (event.request.mode === "navigate") {
          const homepage = await caches.match("./index.html");

          if (homepage) {
            return homepage;
          }
        }

        return new Response("You are offline. Please reconnect and try again.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      })
  );
});
