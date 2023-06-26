const cacheName = 'Drawly';

// Cache all the files to make a PWA
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      // Our application only has two files here index.html and manifest.json
      // but you can add more such as style.css as your app grows
      return cache.addAll(["./",
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
]);
    })
  );
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});