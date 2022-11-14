<script lang="ts">
  import { marked } from "marked";
  export let t: string;
</script>

<div class="content">
  {@html marked(t)}
</div>

<style lang="scss">
  @use "src/lib/utils";
  .content {
    @include utils.long-text;
    :global(h1),
    :global(h2),
    :global(h3) {
      @include utils.title;
      font-size: 1.1rem;
      margin-top: 0.9rem;
      margin-bottom: 0.4rem;
    }
    :global(p) {
      font-size: 0.9rem;
    }
  }
</style>
