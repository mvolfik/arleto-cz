<script lang="ts">
  import { browser } from "$app/environment";
  import { env } from "$env/dynamic/public";
  import zasilkovnaSq from "$lib/assets/zasilkovna_sq.png";

  import type { PacketaAPI, ZasilkovnaInfo } from "$lib/utils";
  import { slide } from "svelte/transition";

  export let chosen: string | undefined = undefined;

  export const title = "Zásilkovna";
  export const price = 70;
  export let storedData: ZasilkovnaInfo | null = null;

  export function check(): string | true {
    if (storedData === null) return "Nebyla vybrána pobočka Zásilkovny pro doručení";
    return true;
  }

  function chooseZasilkovna() {
    if (!browser) return;
    ((<any>window) as { Packeta: PacketaAPI }).Packeta.Widget.pick(
      env.PUBLIC_PACKETA_APIKEY,
      (info: null | ZasilkovnaInfo) => (storedData = info),
      { language: "cs" }
    );
  }
</script>

<svelte:head>
  <script async src="https://widget.packeta.com/v6/www/js/library.js"></script>
</svelte:head>
<div>
  <label for="zasilkovna">
    <input
      id="zasilkovna"
      type="radio"
      name="shipping"
      value="zasilkovna"
      bind:group={chosen}
      on:change={() => {
        if (storedData === null) chooseZasilkovna();
      }}
    />
    <img src={zasilkovnaSq} alt="logo" />
    Zásilkovna (+ {price} Kč)
  </label>
  {#if chosen === "zasilkovna"}
    <div class="details" transition:slide|local>
      {#if storedData === null}
        <button on:click={chooseZasilkovna}>Vybrat pobočku</button>
      {:else}
        <p>Vybraná pobočka: {storedData.name}</p>
        <button on:click={chooseZasilkovna}>Vybrat jinou pobočku</button>
        <!--TODO: show required metadata-->
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "src/lib/shipping.scss";
</style>
