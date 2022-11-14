import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { ContactContent } from "$lib/mainContentStructureTypes";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("https://c.evavolfova.cz/content/main/contact").catch((e) => {
    console.error(e);
    return {
      ok: false as const,
    };
  });
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst obsah");
  }
  const props = (await response.json()) as ContactContent;
  return props;
};

export const csr = false;
