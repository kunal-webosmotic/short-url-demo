addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const shortCode = url.pathname.slice(1); //remove leading '/'
  return Response.redirect("http://localhost:3000/" + shortCode, 301); // Permanent redirect
}
