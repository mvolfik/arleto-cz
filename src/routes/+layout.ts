import type { Theme } from "$lib/mainContentStructureTypes";
import type { LayoutLoad } from "./$types";
export const load: LayoutLoad = async ({ fetch }) => {
  const response = await fetch("https://c.evavolfova.cz/content/main/theme").catch((e) => {
    console.error(e);
    return {
      ok: false as const,
    };
  });
  if (!response.ok) {
    return { layoutError: response };
  }
  const theme = (await response.json()) as Theme;
  return { theme };
};
