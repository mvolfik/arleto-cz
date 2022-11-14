import type { ProjectsContent } from "$lib/mainContentStructureTypes";
import type { PartialProjectInfo } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
export const load: PageLoad = async ({ fetch }) => {
  const [contentResponse, listResponse] = await Promise.all(
    [
      "https://c.evavolfova.cz/content/main/projects",
      "https://c.evavolfova.cz/content/projects",
    ].map((url) =>
      fetch(url)
        .then((response) => response.json() as Promise<Record<string, unknown>>)
        .then((json) => ({ ok: true as const, json }))
        .catch((e) => {
          console.error(e);
          return {
            ok: false as const,
          };
        })
    )
  );
  if (!listResponse.ok || !contentResponse.ok) {
    throw error(500, "Nepodařilo se načíst projekty");
  }
  const { text, image } = contentResponse.json as ProjectsContent;
  const projects = listResponse.json as Record<string, PartialProjectInfo>;
  return { text, image, projects };
};
