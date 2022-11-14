import type { PartialItem } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
export const load: LayoutLoad = async ({ fetch }) => {
  const response: Response | { ok: false } = await fetch(
    "https://c.evavolfova.cz/content/eshop"
  ).catch((e) => {
    console.error(e);
    return {
      ok: false,
    };
  });
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst položky eshopu");
  }
  const shopItems = (await response.json()) as Record<string, PartialItem>;
  return {
    shopItems,
  };
};
