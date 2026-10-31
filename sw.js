// EasyFood service worker (web version only - the Android app has its files
// built in). Generated into dist/sw.js at build time by vite.config.js, with
// the list of files and a version filled in.
//
// The whole app is stored on install, so after the first visit it opens
// and works without a connection. A new build has a new version: it's
// downloaded in the background and used from the next time the app opens.
const VERSION = "ed3980529437";
const PRECACHE = [
  "/apple-touch-icon.png",
  "/assets/geist-cyrillic-ext-wght-normal-DjL33-gN.woff2",
  "/assets/geist-cyrillic-wght-normal-BEAKL7Jp.woff2",
  "/assets/geist-latin-ext-wght-normal-DC-KSUi6.woff2",
  "/assets/geist-latin-wght-normal-BgDaEnEv.woff2",
  "/assets/geist-vietnamese-wght-normal-6IgcOCM7.woff2",
  "/assets/index-BHDs8vi2.css",
  "/assets/index-BVL3410p.js",
  "/assets/index-Czye3d3U.js",
  "/assets/index-DuCH9cZP.js",
  "/assets/index-NPP69x63.js",
  "/assets/index-tE5ccQkH.js",
  "/assets/offlineFoods-eugsDAPu.js",
  "/assets/ponyfill-BgO2iRT2.js",
  "/assets/web-BIXs6JJz.js",
  "/assets/web-CyaE7oKs.js",
  "/assets/web-DqtGA8At.js",
  "/assets/web-hXBC_Gec.js",
  "/assets/web-qeRaXUEK.js",
  "/favicon-32.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/index.html",
  "/iphone-setup.html",
  "/manifest.webmanifest",
  "/recipe-images/asian-wok-vegetables-pork.jpg",
  "/recipe-images/baked-salmon-vegetables.jpg",
  "/recipe-images/banana-peanut-butter-oatmeal.jpg",
  "/recipe-images/black-bean-burrito-bowls.jpg",
  "/recipe-images/butter-chicken.jpg",
  "/recipe-images/chicken-curry-rice.jpg",
  "/recipe-images/chicken-fajita-wraps.jpg",
  "/recipe-images/chicken-fajitas.jpg",
  "/recipe-images/chicken-quesadillas.jpg",
  "/recipe-images/chicken-shawarma-pitas.jpg",
  "/recipe-images/chickpea-avocado-salad.jpg",
  "/recipe-images/chilli-con-carne.jpg",
  "/recipe-images/chocolate-chip-cookies.jpg",
  "/recipe-images/courgette-bacon-quiche.jpg",
  "/recipe-images/couscous-smoked-sausage-vegetables.jpg",
  "/recipe-images/creamy-chorizo-pasta.jpg",
  "/recipe-images/egg-fried-rice.jpg",
  "/recipe-images/gamba-curry-rice.jpg",
  "/recipe-images/garlic-shrimp-spinach-pasta.jpg",
  "/recipe-images/gnocchi-butter-sage.jpg",
  "/recipe-images/greek-salad.jpg",
  "/recipe-images/grilled-chicken-rice-broccoli.jpg",
  "/recipe-images/gyudon.jpg",
  "/recipe-images/lasagne.jpg",
  "/recipe-images/miso-chicken-ramen.jpg",
  "/recipe-images/mushroom-risotto-bacon.jpg",
  "/recipe-images/noodles-with-vegetables.jpg",
  "/recipe-images/omelette-toast.jpg",
  "/recipe-images/oven-pangasius-potatoes.jpg",
  "/recipe-images/pho.jpg",
  "/recipe-images/pork-lomo-saltado.jpg",
  "/recipe-images/red-lentil-soup.jpg",
  "/recipe-images/shakshuka.jpg",
  "/recipe-images/sheet-pan-chicken-thighs-potatoes.jpg",
  "/recipe-images/shoyu-ramen-pork.jpg",
  "/recipe-images/spaghetti-bolognese.jpg",
  "/recipe-images/spinach-goat-cheese-quiche.jpg",
  "/recipe-images/tuna-pesto-pasta-salad.jpg",
  "/recipe-images/vegetable-stir-fry.jpg",
  "/recipe-images/yogurt-cocoa-breakfast-bowl.jpg"
];
const CACHE = `easyfood-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('easyfood-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Supabase, nutrition APIs, recipe sites: always live.
  if (url.origin !== self.location.origin) return;

  // Every page of the app is the same index.html (but a real page like
  // /iphone-setup.html is itself).
  if (request.mode === 'navigate' && !/\.html$/.test(url.pathname)) {
    event.respondWith(caches.match('/index.html').then((cached) => cached || fetch(request)));
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true, ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
