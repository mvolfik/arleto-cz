import type { ProjectInfo } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params: { projectID }, fetch }) => {
  const response = await fetch("https://c.evavolfova.cz/content/projects/" + projectID).catch(
    (e) => {
      console.error(e);
      return {
        ok: false as const,
        status: 500,
      };
    }
  );
  if (response.status === 404) {
    throw error(404, "Tento projekt neexistuje");
  }
  if (!response.ok) {
    throw error(500, "Nepodařilo se načíst projekt");
  }
  const project = (await response.json()) as ProjectInfo;
  return { project };
};
