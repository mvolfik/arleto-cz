<script lang="ts">
  import type { PhrasingContent } from "mdast-util-from-markdown/lib";
  export let node: PhrasingContent;
</script>

{#if node.type === "text"}
  {node.value}
{:else if node.type === "strong"}
  <strong>
    {#each node.children as subnode}
      <svelte:self node={subnode} />
    {/each}
  </strong>
{:else if node.type === "link"}
  <a href={node.url}>
    {#each node.children as subnode}
      <svelte:self node={subnode} />
    {/each}
  </a>
{:else if node.type === "break"}
  <br />
{:else}
  <span>{JSON.stringify(node)}</span>
{/if}

<style lang="scss">
  @use "src/lib/utils";

  a {
    font-weight: 600;
  }
</style>
