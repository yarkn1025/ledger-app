const CACHE_NAME = 'ledger-app-v3';
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(e.request).then(function(res) {
        if (e.request.method === 'GET' && res.status === 200) {
          cache.put(e.request, res.clone());
        }
        return res;
      }).catch(function() {
        return cache.match(e.request).then(function(c) {
          return c || new Response('Offline', {status: 503});
        });
      });
    })
  );
});
