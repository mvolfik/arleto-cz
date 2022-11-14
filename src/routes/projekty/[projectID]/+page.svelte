<script lang="ts">
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.project.title} | Projekty | Eva Volfová</title>
</svelte:head>

<h1 style="margin-bottom: 0;">{data.project.title}</h1>
<p style="font-style: italic; margin-top: 0.2rem;">
  Realizováno v {[
    "lednu",
    "únoru",
    "březnu",
    "dubnu",
    "květnu",
    "červnu",
    "červenci",
    "srpnu",
    "září",
    "říjnu",
    "listopadu",
    "prosinci",
  ][data.project.month - 1]}
  {data.project.year}.
</p>
<Markdown t={data.project.body} />

{#if data.project.gallery}
  <div class="gallery">
    {#each data.project.gallery as { image } (image.id)}
      <div>
        <!-- bookmark: img -->
        <img
          src="https://c.evavolfova.cz/a/{image.id}/{Math.max(...image.sizes)}/webp"
          alt="fotografie"
          srcset={image.sizes
            .sort((a, b) => a - b)
            .map((size) => `https://c.evavolfova.cz/a/${image.id}/${size}/webp ${size}w`)
            .join(", ")}
          sizes="(max-width: 50rem) 100vw, 50rem"
        />
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "src/lib/utils";

  h1 {
    @include utils.title;
    font-size: 1.3rem;
  }
  .gallery {
    display: flex;
    flex-wrap: wrap;

    div {
      text-align: center;
      margin: 0.2rem;

      img {
        max-height: 10rem;
      }
    }
  }
</style>
