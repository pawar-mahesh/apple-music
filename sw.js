/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-7e14c523ea94";
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
  "assets/index-BFfEkL6E.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-ttzPfvfD.js",
  "assets/router-Dm2nHIQG.js",
  "assets/PauseIcon-D5ZB1-9v.js",
  "assets/tapToPlay-C1CWQSyH.js",
  "assets/PauseIcon-Bo3-IQlm.css",
  "assets/tapToPlay-Cj73OYUT.css",
  "assets/index-DqFPCAV8.css"
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
      fetch(request).catch(() => caches.match(INDEX, { ignoreVary: true }).then((r) => r || Response.error())),
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
