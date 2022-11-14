<script lang="ts">
  import type { CheckoutInfo } from "$lib/utils";
  import { crossfade, slide } from "svelte/transition";

  export let stageData: Array<undefined | CheckoutInfo>;
  export let stageN: number;

  const stageLabels = [
    ["Prázdný košík", "Košík"],
    ["Výběr způsobu platby", "Platba"],
    ["Výběr způsobu dopravy", "Doprava"],
    ["Odeslání objednávky", "bar"],
  ];

  function zip<T, U>(...arrays: [T[], U[]]): [T, U][] {
    const length = Math.min(...arrays.map((arr) => arr.length));
    // @ts-expect-error stfu, this works https://stackoverflow.com/a/41397368/7292139
    return Array.from({ length }, (_, index) => arrays.map((array) => array[index]));
  }

  $: total = stageData.reduce((s, x) => s + (x?.price ?? 0), 0);

  const [pointerSend, pointerReceive] = crossfade({});
</script>

<div class="outer">
  <div class="fulltitle"><p>Souhrn</p></div>

  <div class="col">
    {#each zip(stageData, stageLabels) as [data, [before, after]], i (before)}
      <div class:passed={stageN >= i}>
        {#if stageN === i}
          <span
            class="pointer material-icons"
            in:pointerReceive|local={{ key: "pointer" }}
            out:pointerSend|local={{ key: "pointer" }}>arrow_right</span
          >
        {/if}
        {#if i === 3 || data === undefined}
          <button
            class="progress"
            in:slide|local={{ delay: 300 }}
            out:slide|local={{ duration: 300 }}
            on:click={() => (stageN = i)}>{before}</button
          >
        {:else}
          <button
            class="title"
            in:slide|local={{ delay: 300 }}
            out:slide|local={{ duration: 300 }}
            on:click={() => (stageN = i)}>{after}</button
          >
          {#key data.title}
            <div>
              <span
                class="details"
                in:slide|local={{ delay: 300 }}
                out:slide|local={{ duration: 300 }}>{data.title}</span
              >
              <span
                class="price"
                class:free={data.price === 0}
                in:slide|local={{ delay: 300 }}
                out:slide|local={{ duration: 300 }}
                >{data.price === 0 ? "zdarma" : `${data.price} Kč`}</span
              >
            </div>
          {/key}
        {/if}
      </div>
    {/each}

    <div class="sum">
      <span class="title">Celkem</span>
      <span class="details">{total} Kč</span>
    </div>
  </div>
</div>

<style lang="scss">
  @use "src/lib/utils";

  .outer {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .fulltitle {
    @include utils.title;
    margin: 0 0 1rem 1.3em;

    p {
      font-size: 1rem;
      margin: 0;
    }
  }

  .col {
    flex-grow: 1;
    align-items: stretch;
    display: flex;
    flex-direction: column;
    cursor: default;

    .price {
      padding-top: 0.2rem;

      &.free {
        font-size: 0.85em;
      }
    }

    & > div {
      display: flex;
      padding-left: 1.3em;
      position: relative;
      flex-direction: column;
      margin-bottom: 1rem;

      & > div {
        display: flex;
        flex-direction: column;
      }

      button {
        padding: 0;
        background-color: unset;
        border: none;
        text-align: left;
      }

      &:not(.sum) .title,
      .progress {
        color: utils.$primary;
        text-decoration: none;

        &:hover {
          text-decoration: 1px dotted utils.$primary underline;
        }
      }

      .pointer {
        position: absolute;
        left: 0;
      }
    }

    .sum {
      margin-top: auto;
      margin-bottom: 0 !important;

      .title {
        color: utils.$primary;
      }
    }
  }
</style>
