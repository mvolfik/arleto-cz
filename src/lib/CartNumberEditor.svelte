<script lang="ts">
  import { tracker } from "$lib/tracker";
  export let value: number;
  export let max: number;
  export let itemID: string;

  let input: HTMLInputElement;

  function updateVal(newVal: number) {
    if (newVal === 0) {
      if (!confirm("Odebrat z košíku?")) {
        input.value = value.toString();
        return;
      }
    }
    if (!value) tracker.trackEvent("addToCart", { props: { itemID } });

    value = newVal;
  }
  function handleConfirm() {
    const parsed = parseInt(input.value);
    updateVal(isNaN(parsed) ? 0 : parsed);
  }

  $: {
    if (value === undefined || value === null) break $;

    if (!Number.isInteger(value) || value < 0) {
      value = 0;
    } else if (value > max) {
      value = max;
    }
  }
</script>

<div>
  {#if value > 0}
    <button type="button" on:click={() => updateVal(value - 1)} disabled={value <= 0}>
      <svg viewBox="0 0 10 10"><title>Odebrat 1</title><path d="M 1,5 L 9,5" /></svg>
    </button>
    <input
      type="number"
      bind:this={input}
      {value}
      min="0"
      {max}
      step="1"
      on:blur={handleConfirm}
      on:keyup={(e) => {
        if (e.key === "Enter") input.blur();
      }}
      on:change={function () {
        // value is only passed top-down - this ensures updating when pressing the small arrows in Firefox, which changes value without focusing
        if (document.activeElement !== input) handleConfirm();
      }}
    />
    <button type="button" on:click={() => updateVal(value + 1)} disabled={value >= max}>
      <svg viewBox="0 0 10 10"><title>Přidat 1</title><path d="M 5,1 L 5,9 M 1,5 L 9,5" /></svg>
    </button>
  {:else}
    <button type="button" class="add" on:click={() => updateVal(1)}>Přidat do košíku</button>
  {/if}
</div>

<style lang="scss">
  @use "src/lib/utils";

  $fg: utils.$primary;
  input,
  button {
    padding: 0.1rem 0.2rem;
    border: none;
    background-color: utils.$primary-light;
    color: $fg;
    box-sizing: content-box;
    height: 1.2rem;
    border-radius: 0.2rem;
    @include utils.main;
  }

  div {
    display: flex;
    align-items: stretch;
  }

  input {
    margin: 0 0.25rem;
    width: 4rem;
    padding-left: 0.6rem !important;
  }

  button {
    @include utils.hovershade;

    &:not(.add) {
      width: 2rem;
      display: flex;
      justify-content: center;
    }

    svg {
      height: 100%;
      path {
        stroke-width: 0.9;
        stroke: $fg;
        stroke-linecap: round !important;
      }
    }

    &:disabled {
      filter: brightness(0.9) grayscale(1) opacity(0.4);
    }
  }
</style>
