// Service Worker für die Hyrox-App.
// Strategie: App-Shell beim Install cachen, dann Stale-While-Revalidate –
// die App lädt sofort aus dem Cache (auch offline, z.B. im Gym ohne Netz) und
// aktualisiert sich im Hintergrund, wenn online.
//
// WICHTIG: Bei jedem Deploy mit geänderten Dateien die Versionsnummer erhöhen
// (hyrox-v1 -> hyrox-v2 ...), sonst sehen bereits installierte Nutzer die alte
// Version weiter. Beim Aktivieren werden alte Caches automatisch gelöscht.
const CACHE = 'hyrox-v1';

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
  // Nur eigene GET-Requests behandeln (keine POST, keine Fremd-Domains).
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached); // offline -> Cache-Version
      return cached || network;
    })
  );
});
