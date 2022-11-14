<script lang="ts">
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>ARLETO s.r.o.</title>
</svelte:head>

<!-- bookmark: img -->
<img
  src="https://c.arleto.mvolfik.com/a/{data.image.id}/{Math.max(...data.image.sizes)}/webp"
  alt="foto"
  srcset={data.image.sizes
    .sort((a, b) => a - b)
    .map((size) => `https://c.arleto.mvolfik.com/a/${data.image.id}/${size}/webp ${size}w`)
    .join(", ")}
/>
<div class="intro">
  <h1>ARLETO</h1>
  <p class="social">
    <a href="https://www.facebook.com/arletosro" target="_blank" rel="noopener" class="hovershade">
      <svg viewBox="0 0 14222 14222">
        <path
          d="M9879 9168 l315-2056H8222V5778c0-562 275-1111 1159-1111h897V2917s-814-139-1592-139c-1624 0-2686 984-2686 2767v1567H4194v2056h1806v4969 v0v0 a7111 7111 0 1 1 2222 0 v-1111a6000 6000 0 1 0 -2222 0 v1111 v0v0 c362 57 733 86 1111 86s749-30 1111-86V9168z"
        />
      </svg>
      ARLETO s.r.o.
    </a>
  </p>
  <Markdown t={data.text} />
</div>

<style lang="scss">
  @use "src/lib/utils";
  img {
    height: auto;
    width: 100%;
  }
  .intro {
    margin: 0 10px;

    p.social {
      margin: 0.2rem 0;

      a {
        text-decoration: none;
        color: inherit;
      }

      svg {
        height: 1.3em;
        width: 1.3em;
        vertical-align: text-top;
        fill: utils.$primary;
      }
    }
  }
</style>
