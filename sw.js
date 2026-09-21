/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-25-li-12ir";
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
  "assets/ArtistPage-CmQF23y7.js",
  "assets/ArtistPage-DRLHbfpY.css",
  "assets/DetailPage-BFymE3w0.js",
  "assets/DetailPage-CU7rT6LA.css",
  "assets/DetailPage-YpgR8h5B.css",
  "assets/DetailPage.module-C1D254Om.js",
  "assets/FavouritesPage-Do-G2WwK.js",
  "assets/NowPlaying-CHOOZ7CW.js",
  "assets/NowPlaying-zvQVNrvX.css",
  "assets/PauseIcon-BFE1b3WJ.js",
  "assets/PauseIcon-CWqJybro.css",
  "assets/SearchPage-4GMJJgA9.js",
  "assets/SearchPage-BEWLgy_C.css",
  "assets/UserPlaylistPage-DGW3zKRq.js",
  "assets/UserPlaylistPage-nD_kkc-N.css",
  "assets/index-CUAnqfeL.js",
  "assets/index-DXQDyd0D.css",
  "assets/react-D3MgmOsQ.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/router-CoGmKOLQ.js",
  "assets/state-D5uMKkKi.js",
  "assets/toDetailTrack-Fi4_gbyh.js",
  "assets/useFavourite-BQXRV21y.js",
  "assets/useFavourite-BlEC8g2D.css",
  "assets/useQueuePlayback-BKNci7bw.js"
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
