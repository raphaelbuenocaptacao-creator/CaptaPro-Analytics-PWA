const CACHE = "captaup-v48-safe-pwa";
const APP_SHELL = ["./index.html","./manifest.webmanifest","./icon-192.svg","./icon-512.svg","./captaup.css","./captaup-auth.js","./captaup-admin.js","./captaup-auth-bridge.js","./captaup-data.js","./captaup-main.js","./ranking-controls.js","./ranking-page.js","./manager-insights.js","./active-professionals.js","./default-period.js","./captaup-pwa.js","./weekly-captain.js","./engagement.js"];

self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));

function shouldBypass(request,url){
  if(request.method!=="GET") return true;
  if(request.headers.has("authorization")) return true;
  if(url.origin!==self.location.origin) return true;
  const path=url.pathname.toLowerCase();
  if(path.includes("/api/")||path.includes("/auth")||path.includes("/admin")||path.includes("login")||path.includes("session")||path.includes("token")) return true;
  return false;
}

self.addEventListener("fetch",event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(shouldBypass(request,url)) return;

  const networkFirst=()=>fetch(request,{cache:"no-store"}).then(response=>{
    if(response.ok && response.type==="basic") caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
    return response;
  }).catch(()=>caches.match(request).then(cached=>cached||(request.mode==="navigate"?caches.match("./index.html"):undefined)));

  if(request.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith("/index.html")||url.pathname.endsWith("data-2026.json")||url.pathname.endsWith(".js")||url.pathname.endsWith(".css")||url.pathname.endsWith(".webmanifest")){
    event.respondWith(networkFirst());
    return;
  }

  if(["image","font"].includes(request.destination)){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
      if(response.ok && response.type==="basic") caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
      return response;
    })));
  }
});
