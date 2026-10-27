// Service worker minimal : rend l'appli installable. Ne met rien en cache (les données viennent toujours de Google).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
