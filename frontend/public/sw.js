self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);
  if (url.origin.includes("s3-external-1.amazonaws.com/media.twiliocdn.com")) {
    event.respondWith(
      (async function () {
        try {
          var res = await fetch(event.request);
          var cache = await caches.open("cache");
          cache.put(event.request.url, res.clone());
          return res;
        } catch (error) {
          return caches.match(event.request);
        }
      })()
    );
  }
});
