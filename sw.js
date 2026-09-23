/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-119d2557c649";
// Wherever this worker was registered from — the scope is the app's base,
// whatever path that turns out to be.
const SCOPE = self.registration.scope;
const SHELL = [
  "",
  "apple-touch-icon-d47a9e70.png",
  "apple-touch-icon.png",
  "favicon-1abbf1db.png",
  "favicon-2b6befc5.ico",
  "favicon.ico",
  "icon-1024-154eaf65.png",
  "icon-192-5be1e524.png",
  "icon-512-554c2571.png",
  "icon-706c8c9f.svg",
  "icon-maskable-192-2b319507.png",
  "icon-maskable-512-2751871c.png",
  "index.html",
  "manifest.webmanifest",
  "assets/index-DYWsBhgt.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-D5uMKkKi.js",
  "assets/router-CoGmKOLQ.js",
  "assets/PauseIcon-BItuhPw1.js",
  "assets/toPlayerSong-Cxw7PB_q.js",
  "assets/PauseIcon-B6Zt7LMB.css",
  "assets/toPlayerSong-CbtUf2FD.css",
  "assets/index-BDfPS-mh.css"
].map((path) => new URL(path, SCOPE).href);
const INDEX = new URL("index.html", SCOPE).href;

self.addEventListener("install", (event) => {
  // Skip waiting so a deploy takes effect on the next load rather than once
  // every tab has been closed.
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // Other origins — the catalogue API, the artwork CDN — are never cached.
  if (new URL(request.url).origin !== self.location.origin) return;

  // Any in-app route resolves to the one shell document, the same rule the
  // deployed 404.html implements for a cold load.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(INDEX).then((r) => r || Response.error())),
    );
    return;
  }

  // Everything else is content-hashed and therefore immutable: a hit is served
  // without revalidating, a miss is cached for next time.
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
