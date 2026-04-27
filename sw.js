const CACHE_NAME = "sikembang-cache-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./input.html",
  "./edukasi.html",
  "./grafik.html",
  "./pengingat.html",
  "./aktivitas.html",
  "./style.css",
  "./app.js",
  "./supabase.js",
  "./manifest.json",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg",
  "./assets/images/nutrition-guide.svg",
  "./assets/images/mpasi-guide.svg",
  "./assets/images/stunting-prevention.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || caches.match("./index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          const requestUrl = new URL(request.url);
          if (
            requestUrl.origin === self.location.origin ||
            requestUrl.hostname.includes("jsdelivr.net")
          ) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
