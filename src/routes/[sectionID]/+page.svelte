<script lang="ts">
  import Markdown from "$lib/markdown/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.sectionData.title} | ARLETO s.r.o.</title>
</svelte:head>

<Markdown t={data.sectionData.body} />
