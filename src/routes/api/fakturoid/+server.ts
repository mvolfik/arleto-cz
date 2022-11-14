import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import { check } from "../auth";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const checkResult = await check(cookies);
  if (checkResult !== null) return checkResult;

  const { path, method, body } = (await request.json()) as {
    path: string[];
    method: string;
    body?: string;
  };
  if (path.some((x) => x.includes("/")))
    return json({ message: "Path cannot contain slashes" }, { status: 403 });
  const response = await fetch(
    `https://app.fakturoid.cz/api/v2/accounts/${env.FAKTUROID_ACCOUNT_SLUG}/${path.join("/")}`,
    {
      method,
      headers: {
        "User-Agent": "Evavolfova.cz/CMS (webmaster@evavolfova.cz)",
        Authorization: "Basic " + btoa(env.TOKEN_FAKTUROID),
        "Content-Type": "application/json",
      },
      body,
    }
  );
  return json(await response.json());
};
