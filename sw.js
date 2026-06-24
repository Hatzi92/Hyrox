// Service Worker für die Hyrox-App.
// Strategie:
//   - Navigation/HTML  -> Network-first (online = sofort neueste Version,
//                         offline = Fallback auf Cache). Löst das "alte
//                         Version nach Deploy"-Problem.
//   - Alles andere     -> Stale-While-Revalidate (sofort aus Cache, im
//                         Hintergrund aktualisiert). Schnell + offline-fähig.
//
// Versionsnummer nur erhöhen, wenn du den Cache hart purgen willst – für
// normale Datei-Updates ist das nicht mehr nötig.
const CACHE = 'hyrox-v6';

// Relative Pfade, damit es auch in einem GitHub-Pages-Unterordner funktioniert.
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // HTML-Navigation: Network-first. ignoreSearch, damit ?v=2 trotzdem den
  // gecachten index.html trifft, falls offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() =>
          caches.open(CACHE).then((c) =>
            c.match(req, { ignoreSearch: true }).then((m) => m || c.match('./index.html'))
          )
        )
    );
    return;
  }

  // Rest (app.js, Icons, manifest): Stale-While-Revalidate.
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
