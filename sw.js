const CACHE = "fluxohub-v4";
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.pathname.endsWith("/data.json")) {
    event.respondWith(fetch(request, {cache:"no-store"}).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request)));
    return;
  }

  const isAppCode = url.pathname.endsWith("/index.html") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".webmanifest");
  if (isAppCode) {
    event.respondWith(fetch(request, {cache:"no-store"}).then(response => {
      if (response.ok && !url.pathname.endsWith("/index.html")) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
