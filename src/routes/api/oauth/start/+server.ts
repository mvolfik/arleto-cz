import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies, url }) => {
  const state = crypto.randomUUID();
  cookies.set("oauth_state", state, { httpOnly: true, secure: true, path: "/api/oauth" });
  throw redirect(
    302,
    "https://github.com/login/oauth/authorize?" +
      new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: new URL("/api/oauth/callback/", url.origin).href,
        scope: "repo,user:email",
        state,
        allow_signup: "false",
      }).toString()
  );
};
