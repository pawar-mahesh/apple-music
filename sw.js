/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-f54f298011af";
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
  "assets/index-C0Ahv1Ao.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-m0DTQTRU.js",
  "assets/router-ZOD6_S3u.js",
  "assets/modalControls-9EKMS7ZE.js",
  "assets/Modal-C4pHm5CR.js",
  "assets/ContextualMenu-l7js-IJa.js",
  "assets/useAccountState-CjW7JjnR.js",
  "assets/FavouriteIcon-Dc59WAV_.js",
  "assets/PageStatus-BM86OvAQ.js",
  "assets/Track-Cz9hd7DH.js",
  "assets/modalControls-Cy6euEVx.css",
  "assets/Modal-DCS7fpO0.css",
  "assets/ContextualMenu-Bx1sgt0h.css",
  "assets/FavouriteIcon-CQlVulA-.css",
  "assets/PageStatus-DP3AeeQe.css",
  "assets/Track-Bszqq76U.css",
  "assets/index-BvpQj24Y.css"
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
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
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
    ).catch(() => Response.error()),
  );
});
