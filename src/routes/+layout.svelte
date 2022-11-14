<script lang="ts">
  import Header from "$lib/Header.svelte";
  import "$lib/global.scss";
  import { page } from "$app/stores";
  import { setup as setupTracker } from "$lib/tracker";
  import { browser } from "$app/environment";
  import type { PageData } from "./$types";

  export let data: PageData;

  if (browser) setupTracker();
</script>

<div class="banner">
  <!-- bookmark: img -->
  <img
    src="https://c.evavolfova.cz/a/{data.theme?.banner.id}/{Math.max(
      ...(data.theme?.banner.sizes ?? [])
    )}/webp"
    alt="banner"
    srcset={data.theme?.banner.sizes
      .sort((a, b) => a - b)
      .map((size) => `https://c.evavolfova.cz/a/${data.theme?.banner.id}/${size}/webp ${size}w`)
      .join(", ")}
    sizes="(min-width: 600px) 100vw, 600px"
  />
</div>
<div class="wrapper">
  <Header />

  <slot />

  <footer>
    <p>
      Copyright © 2021 Eva Volfová (<a class="hovershade" href="mailto:eva@evavolfova.cz"
        >eva@evavolfova.cz</a
      >)
    </p>
    <p>
      <span title="Code">&lt;/&gt;</span> by
      <a class="hovershade" href="https://mvolfik.github.io">Matěj Volf</a>
      (<a class="hovershade" href="mailto:webmaster@evavolfova.cz">webmaster@evavolfova.cz</a>)
    </p>
    {#if $page.url.pathname.startsWith("/eshop/")}
      <p><a href="/eshop/podminky">Obchodní podmínky</a></p>
    {/if}
  </footer>
</div>

<style lang="scss">
  @use "src/lib/utils";

  .banner {
    height: 4rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
    }
  }

  .wrapper {
    padding: 0 1rem;
    margin: 0 auto;
    max-width: utils.$max-width;
  }

  footer {
    @include utils.main;
    border-top: 2px solid utils.$fade;
    padding: 0.3rem utils.$content-inset 0;
    margin: 3rem 0 2rem;
    font-size: 0.8rem;
    color: #555;

    p {
      margin: 0 0 0.3rem;
    }
  }
</style>
