const CACHE = "captaup-v10";
const APP_SHELL = ["./index.html", "./manifest.webmanifest", "./icon.svg", "./app.js", "./data-latest.json", "./gifts.json"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const networkFirst = () => fetch(request,{cache:"no-store"}).then(response => {
    if(response.ok) caches.open(CACHE).then(c => c.put(request,response.clone()));
    return response;
  }).catch(() => caches.match(request).then(r => r || caches.match("./index.html")));
  if(request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html")){
    event.respondWith(networkFirst());
    return;
  }
  if(url.pathname.endsWith(".json") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".webmanifest")){
    event.respondWith(networkFirst());
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});