<script lang="ts">
  import { tracker } from "$lib/tracker";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  onMount(() => {
    const info: Record<string, string> = {
      code: $page.status.toString(),
      url: $page.url.href,
      referrer: document.referrer,
    };
    if ($page.error?.message) {
      info.message = $page.error?.message;
    }
    tracker.trackEvent("errorPage", {
      props: info,
    });
  });

  export let data: PageData;
</script>

<svelte:head>
  <title>Chyba | Eva Volfová</title>
</svelte:head>

<p>
  <!-- bookmark: img -->
  <img
    src="https://c.evavolfova.cz/a/{data.theme?.error_image.id}/{Math.max(
      ...(data.theme?.error_image.sizes ?? [])
    )}/webp"
    alt="fotografie"
    srcset={data.theme?.error_image.sizes
      .sort((a, b) => a - b)
      .map(
        (size) => `https://c.evavolfova.cz/a/${data.theme?.error_image.id}/${size}/webp ${size}w`
      )
      .join(", ")}
  />
</p>
<h1>
  {#if $page.status === 404}Nenalezeno (chyba 404){:else}Chyba {$page.status}{/if}
</h1>
{#if $page.status === 404}
  <p>Tak tuhle stránku tu bohužel nemám&hellip;</p>
{:else}
  {@const error = $page.error?.message}
  <p>Nastala neznámá chyba&hellip;</p>
  {#if error}
    <p>Chyba: <code>{error}</code></p>
  {/if}
{/if}
<p>
  <a
    data-sveltekit-prefetch={$page.status === 404 ? "" : null}
    href="/"
    class="href"
    rel={$page.status !== 404 ? "external" : ""}>Přejít na úvodní stránku</a
  >
</p>

<style lang="scss">
  img {
    max-width: 100%;
  }

  h1 {
    font-size: 1.2rem;
  }
</style>
