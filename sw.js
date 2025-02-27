const cacheName = 'drawly-pwa-cache-v1.0.3';
const assetsToCache = [
  "./",
  "./assets/ERASER.png",
  "./assets/ERASER.svg",
  "./assets/MEDIUM.png",
  "./assets/MEDIUM.svg",
  "./assets/THICK.png",
  "./assets/THICK.svg",
  "./assets/THIN.png",
  "./assets/THIN.svg",
  "./assets/cleartext.svg",
  "./assets/download.svg",
  "./assets/draw.svg",
  "./assets/logo.ico",
  "./assets/logo.jpeg",
  "./assets/logo.png",
  "./assets/trash.svg",
  "./assets/undo.svg",
  "./index.html",
  "./index.js",
  "./manifest.json",
  "./modules/Controller/Controller.js",
  "./modules/Event/Changes.js",
  "./modules/Model/Mark.js",
  "./modules/Model/Mode.js",
  "./modules/Model/Model.js",
  "./modules/Model/Types.js",
  "./modules/Service/Save/Save.js",
  "./modules/Service/Storage/InflateDeflate.js",
  "./modules/Service/Storage/JsonServerStorageService.js",
  "./modules/Service/Storage/LocalStorageService.js",
  "./modules/Service/Translate/TypeTranslator.js",
  "./modules/View/Animation/AnimationConfig.js",
  "./modules/View/Animation/InAndOut.js",
  "./modules/View/Component/CanvasComponent.js",
  "./modules/View/Component/ColorTableComponent.js",
  "./modules/View/Component/ConfirmClearDialog.js",
  "./modules/View/Component/MenuComponent.js",
  "./modules/View/Resize/ResizeListener.js",
  "./modules/View/ShortCut/MacShortCutInterpreter.js",
  "./modules/View/ShortCut/ShortCutManager.js",
  "./modules/View/ShortCut/ShortCuts.js",
  "./modules/View/ShortCut/WindowsShortCutInterpreter.js",
  "./modules/View/View.js",
  "./pwa/x128.png",
  "./pwa/x192.png",
  "./pwa/x384.png",
  "./pwa/x48.png",
  "./pwa/x512.png",
  "./pwa/x72.png",
  "./pwa/x96.png",
  "./styles.css"
];

// Install event - cache assets
self.addEventListener('install', event => {
  // Use waitUntil to prevent the service worker from terminating before caching is complete
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(assetsToCache);
      })
      .then(() => {
        // Skip waiting forces a service worker to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up only our own old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          // Only delete caches that belong to this application
          if (key !== cacheName && key.startsWith('Drawly')) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
    .then(() => {
      // Claim control immediately rather than waiting for reload
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  console.log('Fetch event for:', event.request.url);
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            // Add the new resource to the cache
            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return a fallback response
            console.log('Fetch failed - network and cache unavailable');
            
            // Check if the request is for an HTML page
            if (event.request.headers.get('accept').includes('text/html')) {
              // Return the cached index.html as a fallback
              return caches.match('./index.html');
            }
            
            // For other resources, return a simple error response
            return new Response('Network error occurred', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});