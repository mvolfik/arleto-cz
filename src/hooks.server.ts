import type { Handle, HandleFetch } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const handle: Handle = ({ event, resolve }) => {
  if (event.url.pathname === "//") {
    return new Response("<a href='/'>Redirecting&hellip;</a>", {
      status: 301,
      headers: { Location: "/", "Content-Type": "text/html" },
    });
  }

  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  if (
    env.CONTENT_BYPASS_HOST !== undefined &&
    request.url.startsWith("https://c.arleto.mvolfik.com/content/")
  ) {
    const url = new URL(request.url);
    url.protocol = "http";
    url.host = env.CONTENT_BYPASS_HOST;
    request = new Request(url, request);
  }

  return fetch(request);
};
