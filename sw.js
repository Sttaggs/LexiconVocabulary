const CACHE = "lexicon-shell-v1";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./vocabulary-data.js", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("lexicon-shell-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=="GET"||url.origin!==self.location.origin)return;
 if(request.mode==="navigate"){event.respondWith(fetch(request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));}return res;}).catch(()=>caches.match("./index.html")));return;}
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
