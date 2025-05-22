// This is the "Offline page" service worker

// Add this below content to your HTML page or add the link to importScripts
// e.g., <script src="sw.js"></script>

self.addEventListener('install', function () {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function () {
  console.log('[ServiceWorker] Activate');
});

// The Fetch event is fired every time the browser sends a request
self.addEventListener('fetch', function (e) {
  // Skip cross-origin requests, like those for Google Analytics
  if (e.request.url.startsWith(self.location.origin)) {
    // Respond with the cached resource if it exists, otherwise fetch from network
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});
