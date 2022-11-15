<script lang="ts">
  import type { Content } from "mdast-util-from-markdown/lib";
  import PhrasingContent from "./PhrasingContent.svelte";
  import Image from "./Image.svelte";

  export let node: Content;
</script>

{#if node.type === "paragraph"}
  <p>
    {#each node.children as subnode}
      <PhrasingContent node={subnode} />
    {/each}
  </p>
{:else if node.type === "list"}
  <svelte:element this={node.ordered ? "ol" : "ul"} start={node.start}>
    {#each node.children as listitem}
      <li>
        {#each listitem.children as subnode}
          {#if subnode.type === "paragraph"}
            {#each subnode.children as subsubnode}
              <PhrasingContent node={subsubnode} />
            {/each}
          {:else}
            <svelte:self node={subnode} />
          {/if}
        {/each}
      </li>
    {/each}
  </svelte:element>
{:else if node.type === "heading"}
  <svelte:element this={`h${node.depth}`}>
    {#each node.children as subnode}
      <PhrasingContent node={subnode} />
    {/each}
  </svelte:element>
{:else if node.type === "leafDirective" && node.name === "img"}
  <p>
    <Image
      id={node.attributes?.id}
      sizes={node.attributes?.sizes.split(",").map((x) => parseInt(x))}
      formats={node.attributes?.formats.split(",")}
      maxWidth="100%"
    />
  </p>
{:else}
  <p>{JSON.stringify(node)}</p>
{/if}

<style lang="scss">
  @use "src/lib/utils";

  h1,
  h2,
  h3,
  h4,
  h5 {
    @include utils.title;
    font-size: 1.1rem;
    margin-top: 0.9rem;
    margin-bottom: 0.4rem;
    color: utils.$darker;
  }

  p {
    font-size: 0.9rem;
  }

  p,
  li {
    @include utils.long-text;
  }
</style>
