/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-e68c1085727b";
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
  "assets/index-CzCA4DPj.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-m0DTQTRU.js",
  "assets/router-ZOD6_S3u.js",
  "assets/modalControls-CF65Bql9.js",
  "assets/PageStatus-JbxBvADf.js",
  "assets/FavouriteIcon-D1kVR-G-.js",
  "assets/ContextualMenu-DFCpqL9v.js",
  "assets/Track-y1UuClcj.js",
  "assets/modalControls-BCOzultt.css",
  "assets/PageStatus-xlf6sCCF.css",
  "assets/FavouriteIcon-CQlVulA-.css",
  "assets/ContextualMenu-U1-H8l8a.css",
  "assets/Track-BLjhNi4S.css",
  "assets/index-CDObmALW.css"
].map((path) => new URL(path, SCOPE).href);
const INDEX = new URL("index.html", SCOPE).href;

// A navigation is always the app shell. Serving the installed shell first
// avoids GitHub Pages' deep-link 404 and means a transient navigation fetch
// cannot turn a perfectly usable installed app into a network error.
function navigationShell() {
  return caches
    .open(CACHE)
    .then((cache) => cache.match(INDEX, { ignoreVary: true }))
    .then((response) => response || caches.match(INDEX, { ignoreVary: true }))
    .then((response) => response || fetch(INDEX))
    // Cache storage can be unavailable (for example, a browser under storage
    // pressure). The index request is still worth trying independently.
    .catch(() => fetch(INDEX))
    // A Response with a status is renderable and diagnosable. Response.error()
    // instead becomes the browser's opaque FetchEvent network-error message.
    .catch(
      () => new Response("Music is unavailable while offline.", { status: 503, statusText: "Service Unavailable" }),
    );
}

self.addEventListener("install", (event) => {
  // Skip waiting so a deploy takes effect on the next load rather than once
  // every tab has been closed.
  self.skipWaiting();
  // `cache: "no-cache"` revalidates every file with the server: Pages serves
  // index.html with max-age=600, so a worker installed just after a deploy
  // could otherwise precache the PREVIOUS build's document, naming assets this
  // cache lacks. Not "reload": that re-downloaded all of them, 220 KB gzip per
  // install, though the hashed files the page had just loaded (and, after a
  // deploy, the unchanged vendor chunks) answer 304 from the HTTP cache.
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL.map((url) => new Request(url, { cache: "no-cache" })))),
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
  // A partial request (a media element's Range) is the network's alone: a
  // cached 206 is one fragment of the file, never the file.
  if (request.headers.has("range")) return;
  // Other origins — the catalogue API, the artwork CDN — are never cached.
  if (new URL(request.url).origin !== self.location.origin) return;

  // Any in-app route resolves to the one shell document, the same rule the
  // deployed 404.html implements for a cold load.
  if (request.mode === "navigate") {
    event.respondWith(navigationShell());
    return;
  }

  // Everything else is content-hashed and therefore immutable: a hit is served
  // without revalidating, a miss is cached for next time. `ignoreVary`: the
  // page asks for its module scripts in CORS mode, with an Origin header the
  // install's addAll never sent, so a server that answers `Vary: Origin` (Vite's
  // own preview server does) left every precached script unmatched — the
  // shell came back offline and nothing in it could load.
  // A fetch that fails (offline, a flaky connection, a deploy replacing the
  // files mid-load) answers as the network error it is: left to reject, it
  // surfaced as "Uncaught (in promise) TypeError: Failed to fetch" in the console.
  // This build's cache first, then any (the previous build's, kept for a tab
  // still on it): caches.match alone answers from the OLDEST cache, which served
  // an unhashed file (the manifest) one deploy late.
  event.respondWith(
    caches
      .open(CACHE)
      .then((cache) => cache.match(request, { ignoreVary: true }))
      .then((hit) => hit || caches.match(request, { ignoreVary: true }))
      .then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok && response.type === "basic") {
              const copy = response.clone();
              // A full disk is a cache miss next time, not an error now.
              caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return response;
          }, () => Response.error()),
      )
      .catch(() => Response.error()),
  );
});
