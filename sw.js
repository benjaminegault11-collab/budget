// Service worker de la coquille (v2). Garde seulement la coquille elle-même (quelques Ko) pour qu'elle s'ouvre
// tout de suite et soit installable. Le budget, lui, vient toujours de Google : rien de Google n'est mis en cache.
const CACHE = 'coquille-v2';
const FICHIERS = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;   // Google : pas touché
  // Copie locale tout de suite (ouverture instantanée), mise à jour en arrière-plan pour la fois suivante
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(local => {
    const reseau = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    if (local) { e.waitUntil(reseau.catch(() => {})); return local; }
    return reseau.catch(() => c.match('index.html'));
  })));
});
