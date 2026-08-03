import { error } from "@sveltejs/kit";
const GET = async ({ url, fetch }) => {
  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    throw error(400, "Missing url parameter");
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      throw error(response.status, "Failed to fetch media from source");
    }
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }
    return new Response(response.body, {
      status: 200,
      headers
    });
  } catch (err) {
    console.error("Proxy Error:", err);
    throw error(500, "Failed to proxy media");
  }
};
export {
  GET
};
