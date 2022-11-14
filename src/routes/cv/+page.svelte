<script lang="ts">
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>CV | Eva Volfová</title>
</svelte:head>

<!-- bookmark: img -->
<img
  src="https://c.evavolfova.cz/a/{data.image.id}/{Math.max(...data.image.sizes)}/webp"
  alt="foto"
  srcset={data.image.sizes
    .sort((a, b) => a - b)
    .map((size) => `https://c.evavolfova.cz/a/${data.image.id}/${size}/webp ${size}w`)
    .join(", ")}
/>
<div class="content">
  <Markdown t={data.text} />
</div>

<style lang="scss">
  @use "src/lib/utils";
  img {
    height: auto;
    width: 100%;
  }
  .content {
    margin: 0 10px;
  }
</style>
