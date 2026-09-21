/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-17-dx-12dj";
// Wherever this worker was registered from — the scope is the app's base,
// whatever path that turns out to be.
const SCOPE = self.registration.scope;
const SHELL = [
  "",
  "apple-touch-icon.png",
  "favicon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "icon.svg",
  "index.html",
  "manifest.webmanifest",
  "assets/ArtistPage-CaiL8x5i.js",
  "assets/ArtistPage-DRLHbfpY.css",
  "assets/DetailPage-BxrTxvgF.js",
  "assets/DetailPage-Ci5RoSgS.css",
  "assets/NowPlaying-CygFuzgh.js",
  "assets/NowPlaying-zvQVNrvX.css",
  "assets/PauseIcon-BZr2GNDL.js",
  "assets/PauseIcon-CWqJybro.css",
  "assets/SearchPage-BEWLgy_C.css",
  "assets/SearchPage-BtbsiZ35.js",
  "assets/index-C1z9mrxq.js",
  "assets/index-M15ptJUO.css",
  "assets/react-D3MgmOsQ.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/router-CoGmKOLQ.js",
  "assets/state-CEg7tEuT.js",
  "assets/useQueuePlayback-BRD8AHib.js"
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
