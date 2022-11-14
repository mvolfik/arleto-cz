import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { SectionItem } from "$lib/mainContentStructureTypes";

export const load: PageLoad = async ({ params: { sectionID }, fetch, parent }) => {
  const [response] = await Promise.all([
    fetch("https://c.arleto.mvolfik.com/content/sections/" + sectionID)
      .then((r) => r.json() as Promise<SectionItem>)
      .then((sectionData) => ({ ok: true as const, sectionData }))
      .catch((e) => {
        console.error(e);
        return {
          ok: false as const,
        };
      }),
    parent().then((parentData) => {
      if (!Object.keys(parentData.sections ?? {}).includes(sectionID)) {
        throw error(404, "Tato položka neexistuje");
      }
    }),
  ]);
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst položku");
  }
  const { sectionData } = response;
  return { sectionData, sectionID };
};

export const csr = false;
