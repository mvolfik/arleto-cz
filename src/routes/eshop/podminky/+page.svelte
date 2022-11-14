<script lang="ts">
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Obchodní podmínky | e-shop | Eva Volfová</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Markdown t={data.vop} />
