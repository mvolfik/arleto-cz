import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
import { SignJWT } from "jose";
import { signToken } from "../../auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const state = cookies.get("oauth_state");
  cookies.delete("oauth_state", { httpOnly: true, secure: true, path: "/api/oauth" });

  if (url.searchParams.get("error") !== null) {
    return { error: url.searchParams.get("error_description") };
  }
  if (state === undefined || state !== url.searchParams.get("state"))
    return { error: "malicious request?" };

  const response = await fetch("https://github.com/login/oauth/access_token", {
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: url.searchParams.get("code"),
    }),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
  });
  const { access_token } = (await response.json()) as { access_token?: string };
  if (access_token === undefined) return { error: "no access token" };

  const userRequest = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}`, Accept: "application/json" },
  });
  const user = (await userRequest.json()) as { id: number };
  if (!env.AUTHORIZED_USERS_GITHUB_IDS.split(",").includes(user.id.toString()))
    return { error: "user not authorized" };

  cookies.set(
    "token",
    await signToken(
      new SignJWT({ authorized: true })
        .setIssuedAt()
        .setExpirationTime("24h")
        .setProtectedHeader({ alg: "ES384" })
    ),
    { httpOnly: true, secure: true, path: "/" }
  );
  const go = cookies.get("oauth_go");
  cookies.delete("oauth_go", { httpOnly: true, secure: true, path: "/" });
  if (go === "orders") {
    throw redirect(302, "/admin/orders/");
  }
  return { access_token };
};
