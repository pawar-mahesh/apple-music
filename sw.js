/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-af5048e7e55c";
// Wherever this worker was registered from — the scope is the app's base,
// whatever path that turns out to be.
const SCOPE = self.registration.scope;
const SHELL = [
  "",
  "apple-touch-icon-ffc0ac73.png",
  "apple-touch-icon.png",
  "favicon-214c8360.ico",
  "favicon-afbc3f41.png",
  "favicon.ico",
  "icon-192-55e3c59e.png",
  "icon-512-41dd4af5.png",
  "icon-cf0c54da.svg",
  "icon-maskable-192-cf0efde8.png",
  "icon-maskable-512-dfcfd2eb.png",
  "index.html",
  "manifest.webmanifest",
  "assets/index-DC1w9Lg9.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-D5uMKkKi.js",
  "assets/router-CoGmKOLQ.js",
  "assets/PauseIcon-ln3i83w5.js",
  "assets/toPlayerSong-Bby8P7e_.js",
  "assets/PauseIcon-CWqJybro.css",
  "assets/toPlayerSong-leG772tO.css",
  "assets/index-nD-mtmB9.css"
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
