/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-cf03ae6ba680";
// Wherever this worker was registered from — the scope is the app's base,
// whatever path that turns out to be.
const SCOPE = self.registration.scope;
const SHELL = [
  "index.html",
  "favicon-2b6befc5.ico",
  "icon-706c8c9f.svg",
  "favicon-1abbf1db.png",
  "apple-touch-icon-d47a9e70.png",
  "manifest.webmanifest",
  "assets/index-DwalqJC0.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-BriS5RKY.js",
  "assets/router-ZOD6_S3u.js",
  "assets/FavouriteIcon-DM0qBoFO.js",
  "assets/Track-_aSrUZYI.js",
  "assets/useCoarsePointer-U4v0znxr.js",
  "assets/TileGrid-BcEzsqWk.js",
  "assets/FavouriteIcon-azvJxc9R.css",
  "assets/Track-akkoPfkB.css",
  "assets/TileGrid-S3lvtZIv.css",
  "assets/index-MjFue8QK.css"
].map((path) => new URL(path, SCOPE).href);
const INDEX = new URL("index.html", SCOPE).href;

self.addEventListener("install", (event) => {
  // Skip waiting so a deploy takes effect on the next load rather than once
  // every tab has been closed.
  self.skipWaiting();
  // `cache: "reload"` bypasses the HTTP cache: Pages serves index.html with
  // max-age=600, so a worker installed just after a deploy could otherwise
  // precache the PREVIOUS build's document, naming assets this cache lacks.
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL.map((url) => new Request(url, { cache: "reload" })))),
  );
});

self.addEventListener("activate", (event) => {
  // The previous version's cache is KEPT (only older ones go): a tab still
  // running the old build names old lazy chunks that the new deploy no longer
  // serves, and every match below searches all caches, so it keeps finding
  // the ones it had already opened. caches.keys() is in creation order.
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        const older = keys.filter((k) => k !== CACHE);
        return Promise.all(older.slice(0, -1).map((k) => caches.delete(k)));
      })
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
      // The current version's shell first: the previous cache (kept, above)
      // also holds an index.html, and caches.match would find that one first.
      fetch(request).catch(() =>
        caches
          .open(CACHE)
          .then((cache) => cache.match(INDEX, { ignoreVary: true }))
          .then((r) => r || caches.match(INDEX, { ignoreVary: true }))
          .then((r) => r || Response.error()),
      ),
    );
    return;
  }

  // Everything else is content-hashed and therefore immutable: a hit is served
  // without revalidating, a miss is cached for next time. `ignoreVary`: the
  // page asks for its module scripts in CORS mode, with an Origin header the
  // install's addAll never sent, so a server that answers `Vary: Origin` (Vite's
  // own preview server does) left every precached script unmatched — the
  // shell came back offline and nothing in it could load.
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
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
