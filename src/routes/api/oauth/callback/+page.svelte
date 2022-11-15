<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types";

  export let data: PageData;

  let state = 0;
  function recieveMessage(e: MessageEvent<string>) {
    if (e.data !== "authorizing:github") {
      return;
    }

    if (e.origin === window.origin) {
      state = 1;
      const msg =
        data.error !== undefined
          ? `authorization:github:error:${data.error}`
          : "authorization:github:success:" +
            JSON.stringify({
              provider: "github",
              token: data.access_token,
            });
      window.opener.postMessage(msg, e.origin);
    }
  }
  if (browser) {
    if (window.opener !== null) {
      window.addEventListener("message", recieveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    } else {
      window.location.replace("/");
    }
  }
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if data.error}
  <p>
    Authorization failed ({data.error}).
    {#if browser && window.opener !== null}
      <button on:click={() => window.close()}>Close this window</button>
    {:else}
      <a href="/admin/">Try again</a>?
    {/if}
  </p>
{:else if state === 0}
  <p>Authorizing...</p>
{:else if state === 1}
  <p>Authorization successful</p>
  <p>You can now close this window.</p>
{/if}
