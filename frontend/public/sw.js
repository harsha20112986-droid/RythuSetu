// RythuSetu High-Reliability PWA Service Worker
const CACHE_VERSION = "rythusetu-v1.0.4";
const PRECACHE_ASSETS = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
  "/data/state_hierarchy.json"
];

// 1. Install: Precache shell assets (never lock down index.html into permanent cache)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Precache asset warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate: Instantly delete all stale caches from previous builds
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            console.log("[SW] Deleting obsolete cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for explicit update/skip-waiting signals
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 3. Fetch Interceptor
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore requests to other origins
  if (url.origin !== self.location.origin) return;

  // A. Backend API calls: network-first with offline fallback response
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline mode: reconnect to internet for live data." }),
          { headers: { "Content-Type": "application/json" }, status: 503 }
        );
      })
    );
    return;
  }

  // B. HTML Navigation Requests (/, /index.html): ALWAYS NETWORK-FIRST
  // This guarantees the browser always loads the newest build with fresh bundle hashes.
  if (event.request.mode === "navigate" || url.pathname === "/" || url.pathname === "/index.html") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve cached index.html
          return caches.match("/index.html").then((cached) => {
            return cached || caches.match("/");
          });
        })
    );
    return;
  }

  // C. Static compiled bundles (/assets/): cache-first, but NEVER cache text/html for scripts!
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const contentType = networkResponse.headers.get("content-type") || "";
            // Reject HTML error pages disguised as JS/CSS
            if (!contentType.includes("text/html")) {
              const copy = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
            }
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // D. Other static resources (icons, manifest): Cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const copy = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });
    })
  );
});
