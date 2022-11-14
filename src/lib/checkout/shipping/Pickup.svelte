<script lang="ts">
  import type { CheckoutInfo } from "$lib/utils";
  import { slide } from "svelte/transition";

  export let chosen: string | undefined = undefined;

  export const title = "Osobní vyzvednutí";
  export const price = 0;
  export let storedData = undefined;

  export function check(data: Array<CheckoutInfo | undefined>): true | string {
    if (data[1]?.title === "Dobírka") {
      return "U osobního vyzvednutí nelze vybrat platbu dobírkou";
    }
    return true;
  }
</script>

<div>
  <label for="pickup">
    <input id="pickup" type="radio" name="shipping" value="pickup" bind:group={chosen} />
    <span class="material-icons" style="font-size: 1.5em;">store</span>
    Osobní vyzvednutí v Chotovinách
  </label>
  {#if chosen === "pickup"}
    <div class="details" transition:slide|local>
      <p>Adresa: Táborská 91, 391 37 Chotoviny</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "src/lib/shipping.scss";
</style>
