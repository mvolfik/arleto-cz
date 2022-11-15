<script lang="ts">
  export let id: string | undefined;
  export let sizes: number[] | undefined;
  export let formats: string[] | undefined;

  export let maxWidth: string | undefined = undefined;
  export let maxHeight: string | undefined = undefined;
</script>

{#if id && sizes && formats}
  <img
    src="https://c.arleto.mvolfik.com/a/{id}/{Math.max(...sizes)}/webp"
    alt="foto"
    style:max-width={maxWidth}
    style:max-height={maxHeight}
    srcset={sizes
      .sort((a, b) => a - b)
      .map((size) => `https://c.arleto.mvolfik.com/a/${id}/${size}/webp ${size}w`)
      .join(", ")}
  />
{/if}
