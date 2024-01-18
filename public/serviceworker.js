const CACHE_NAME = "version-1"; //load things from cache instead of loading from server
const urlsToCache = ["index.html", "offline.html"]; //page to show when there is no internet connection

const self = this;

//Install SW
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		})
	);
});

//Listen for request
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then(() => {
			return fetch(event.request).catch(() => caches.match("offline.html"));
		})
	);
});

//Activate the SW
self.addEventListener("activate", (event) => {
	const cacheWhitelist = [];
	cacheWhitelist.push(CACHE_NAME);

	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});
