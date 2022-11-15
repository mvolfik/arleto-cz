<script lang="ts">
  import Markdown from "$lib/markdown/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Obchodní podmínky | e-shop | ARLETO s.r.o.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Markdown t={data.vop} />
