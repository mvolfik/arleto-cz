import type { VopContent } from "$lib/mainContentStructureTypes";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("https://c.evavolfova.cz/content/main/vop").catch((e) => {
    console.error(e);
    return {
      ok: false as const,
    };
  });
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst obsah");
  }
  const { vop } = (await response.json()) as VopContent;
  return { vop };
};
