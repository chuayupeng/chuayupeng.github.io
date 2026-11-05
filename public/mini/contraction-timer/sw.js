const CACHE = "waves-static-v3";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./icon.svg", "./manifest.webmanifest"];
const SCOPE = new URL("./", self.location.href);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await Promise.all(ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset);
        if (response.ok && new URL(response.url).origin === self.location.origin) await cache.put(asset, response);
      } catch { /* A missing asset should not block the app from loading online. */ }
    }));
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("waves-static-") && key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && new URL(response.url).origin === self.location.origin) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match(request)) || (request.mode === "navigate" ? await caches.match("./index.html") : null) || Response.error();
    }
  })());
});
