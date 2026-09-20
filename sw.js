/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-17-dx-102o";
const SHELL = [
  "/apple-music/",
  "/apple-music/apple-touch-icon.png",
  "/apple-music/favicon.png",
  "/apple-music/icon-192.png",
  "/apple-music/icon-512.png",
  "/apple-music/icon-maskable-512.png",
  "/apple-music/icon.svg",
  "/apple-music/index.html",
  "/apple-music/manifest.webmanifest",
  "/apple-music/assets/ArtistPage-DRl3xBhZ.js",
  "/apple-music/assets/ArtistPage-DszuJYDr.css",
  "/apple-music/assets/DetailPage-CQ0Fzp_c.css",
  "/apple-music/assets/DetailPage-CU_ozuhB.js",
  "/apple-music/assets/NowPlaying-Db5MFzSG.js",
  "/apple-music/assets/NowPlaying-zvQVNrvX.css",
  "/apple-music/assets/PauseIcon-CStf2O_7.css",
  "/apple-music/assets/PauseIcon-Cu_gnS8r.js",
  "/apple-music/assets/SearchPage-BEWLgy_C.css",
  "/apple-music/assets/SearchPage-DkcxNy7W.js",
  "/apple-music/assets/index-C6SRpBpl.css",
  "/apple-music/assets/index-kpPZ808u.js",
  "/apple-music/assets/react-DHuv2Nup.js",
  "/apple-music/assets/rolldown-runtime-CbXtAM7H.js",
  "/apple-music/assets/router-Bl14Wiy8.js",
  "/apple-music/assets/state-DKzB0zcm.js",
  "/apple-music/assets/useQueuePlayback-iYoAE4Hu.js"
];
const INDEX = "/apple-music/index.html";

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
