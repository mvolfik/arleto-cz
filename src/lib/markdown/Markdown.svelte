<script lang="ts">
  import { fromMarkdown } from "mdast-util-from-markdown";
  import { directive } from "micromark-extension-directive";
  import { directiveFromMarkdown } from "mdast-util-directive";
  import Content from "./Content.svelte";

  export let t: string;

  $: tree = fromMarkdown(t, {
    extensions: [directive()],
    mdastExtensions: [directiveFromMarkdown],
  });
</script>

{#each tree.children as node}
  <Content {node} />
{/each}
