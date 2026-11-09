// Network-first: online users always get the newest games; offline falls back to the saved copy.
const CACHE = "games-v9";
const PAGES = ["./", "grade2/", "grade6/", "math-adventure/", "words-adventure/", "words-adventure-2/", "words-adventure-3/", "science-adventure/", "smichut/",
  "words-b-animals/", "words-b-colors/", "words-b-food/", "words-b-home/", "words-b-body/", "shoresh-b/", "shoresh-b-2/",
  "manifest.webmanifest", "pwa.js", "site.js", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    Promise.race([fetch(r, { cache: "no-cache" }), new Promise((_, no) => setTimeout(no, 5000))])
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; })
      .catch(() => caches.match(r, { ignoreSearch: true }))
  );
});