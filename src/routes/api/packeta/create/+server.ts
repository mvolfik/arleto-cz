import { env } from "$env/dynamic/private";
import { check } from "../../auth";
import type { RequestHandler } from "./$types";
import { create as createXML } from "xmlbuilder2";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const checkResult = await check(cookies);
  if (checkResult !== null) return checkResult;

  const { method, attributesObjectName, attributes } = (await request.json()) as {
    method: string;
    attributesObjectName: string;
    attributes: Record<string, string>;
  };

  const body = createXML({
    [method]: {
      apiPassword: env.TOKEN_PACKETA,
      [attributesObjectName]: attributes,
    },
  }).end();
  const response = await fetch(`https://www.zasilkovna.cz/api/rest`, {
    method: "POST",
    headers: {
      "User-Agent": "Evavolfova.cz/CMS (webmaster@evavolfova.cz)",
      "Content-Type": "application/xml",
    },
    body,
  });
  const responseJSON = createXML(await response.text()).end({ format: "json" });
  return new Response(responseJSON, { headers: { "Content-Type": "application/json" } });
};
