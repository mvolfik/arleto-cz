<script lang="ts">
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Projekty | Eva Volfová</title>
</svelte:head>

<!-- bookmark: img -->
<img
  style="height: auto; width: 100%;"
  src="https://c.evavolfova.cz/a/{data.image.id}/{Math.max(...data.image.sizes)}/webp"
  alt="Obrázek"
  srcset={data.image.sizes
    .sort((a, b) => a - b)
    .map((size) => `https://c.evavolfova.cz/a/${data.image.id}/${size}/webp ${size}w`)
    .join(", ")}
/>
<main>
  <Markdown t={data.text} />
  <h2>Projekty</h2>
  <div class="tiles">
    {#each Object.entries(data.projects).sort((a, b) => b[1].year * 12 + b[1].month - (a[1].year * 12 + a[1].month)) as [id, project] (id)}
      <a href="/projekty/{id}/" class="item">
        <!-- bookmark: img -->
        <img
          src="https://c.evavolfova.cz/a/{project.image.id}/{Math.max(...project.image.sizes)}/webp"
          alt="fotografie"
          srcset={project.image.sizes
            .sort((a, b) => a - b)
            .map((size) => `https://c.evavolfova.cz/a/${project.image.id}/${size}/webp ${size}w`)
            .join(", ")}
        />
        <h3>{project.title}</h3>
      </a>
    {/each}
  </div>
</main>

<style lang="scss">
  @use "src/lib/utils";
  $size: 16rem;

  main {
    padding: 0 utils.$content-inset;

    h2 {
      font-size: 1.3rem;
      color: utils.$primary;
      @include utils.title;
    }
  }

  .tiles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -0.8rem;

    & > a {
      width: $size;
      text-decoration: none;
      @include utils.hovershade;
      background-color: utils.$white;
      color: utils.$main;
      margin-bottom: 1rem;

      &:hover {
        color: utils.$primary;
      }

      & > img {
        width: $size - 3rem;
        height: $size - 8rem;
        margin: 1.5rem 1.5rem 0;
        object-fit: cover;
        object-position: top left;
      }

      h3 {
        @include utils.title;
        margin: 0.2rem 1.5rem 1rem;
        font-size: 1.1rem;
      }

      &.next {
        @include utils.title;
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;

        span {
          font-size: 1.6rem;
        }
      }
    }
  }
</style>
