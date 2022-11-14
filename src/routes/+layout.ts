import type { SectionItem, Theme } from "$lib/mainContentStructureTypes";
import type { LayoutLoad } from "./$types";
export const load: LayoutLoad = async ({ fetch }) => {
  const [themeResp, sectionsResp] = await Promise.all([
    fetch("https://c.arleto.mvolfik.com/content/main/theme")
      .then((r) => r.json() as Promise<Theme>)
      .then((theme) => ({ ok: true as const, theme }))
      .catch((e) => {
        console.error(e);
        return {
          ok: false as const,
        };
      }),
    fetch("https://c.arleto.mvolfik.com/content/sections/")
      .then((r) => r.json() as Promise<Record<string, Pick<SectionItem, "order" | "title">>>)
      .then((sections) => ({ ok: true as const, sections }))
      .catch((e) => {
        console.error(e);
        return {
          ok: false as const,
        };
      }),
  ]);
  if (!themeResp.ok) {
    return { layoutError: themeResp };
  }
  if (!sectionsResp.ok) {
    return { layoutError: sectionsResp };
  }
  const { theme } = themeResp;
  const { sections } = sectionsResp;
  return { theme, sections };
};
