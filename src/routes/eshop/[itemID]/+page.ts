import type { Item } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
export const load: PageLoad = async ({ params: { itemID }, fetch, parent }) => {
  const response = await fetch("https://c.evavolfova.cz/content/eshop/" + itemID)
    .then((r) => r.json() as Promise<Item>)
    .then((item) => ({ ok: true as const, item }))
    .catch((e) => {
      console.error(e);
      return {
        ok: false as const,
      };
    });
  if (!Object.keys((await parent()).shopItems ?? {}).includes(itemID)) {
    throw error(404, "Tato položka neexistuje");
  }
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst položku");
  }
  const { item } = response;
  return { item, itemID };
};
