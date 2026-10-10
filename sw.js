/* Generated at build time by vite.config.ts — do not edit in dist. */
const CACHE = "music-shell-7d17facf27f1";
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
  "assets/index-BWZsQR2U.js",
  "assets/rolldown-runtime-CbXtAM7H.js",
  "assets/react-D3MgmOsQ.js",
  "assets/state-BriS5RKY.js",
  "assets/router-ZOD6_S3u.js",
  "assets/Modal-Bjh2Xu6F.js",
  "assets/useStableNavigate-Cu5TKxUq.js",
  "assets/ContextualMenu-DIdcB1Hf.js",
  "assets/useAccountState-CP_avsou.js",
  "assets/FavouriteIcon-gj4Rtgn1.js",
  "assets/PageStatus-Bss0o0_d.js",
  "assets/Track-Cq4brlp3.js",
  "assets/Modal-CWK1JsB0.css",
  "assets/ContextualMenu-Bx1sgt0h.css",
  "assets/FavouriteIcon-CQlVulA-.css",
  "assets/PageStatus-DP3AeeQe.css",
  "assets/Track-CQKkcbxd.css",
  "assets/index-H8RSZxBV.css"
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
  // A partial request (a media element's Range) is the network's alone: a
  // cached 206 is one fragment of the file, never the file.
  if (request.headers.has("range")) return;
  // Other origins — the catalogue API, the artwork CDN — are never cached.
  if (new URL(request.url).origin !== self.location.origin) return;

  // Any in-app route resolves to the one shell document, the same rule the
  // deployed 404.html implements for a cold load.
  if (request.mode === "navigate") {
    event.respondWith(
      // The current version's shell first: the previous cache (kept, above)
      // also holds an index.html, and caches.match would find that one first.
      // Never a rejection: one reached the browser as "the FetchEvent …
      // resulted in a network error response: the promise was rejected"
      // (storage unavailable, the cache gone): the network's own error instead.
      fetch(request)
        .catch(() =>
          caches
            .open(CACHE)
            .then((cache) => cache.match(INDEX, { ignoreVary: true }))
            .then((r) => r || caches.match(INDEX, { ignoreVary: true }))
            .then((r) => r || Response.error()),
        )
        .catch(() => Response.error()),
    );
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
