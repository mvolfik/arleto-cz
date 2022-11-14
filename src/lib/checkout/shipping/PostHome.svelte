<script lang="ts">
  import type { Address } from "$lib/utils";
  import { slide } from "svelte/transition";
  import balikDoRuky from "$lib/assets/balik_do_ruky.png";
  import AddressFieldset from "$lib/AddressFieldset.svelte";

  export let chosen: string | undefined = undefined;

  export const title = "Balík do ruky";
  export const price = 130;
  export let storedData: typeof addr | null = null;

  let addr: Address;
  let valid: boolean;

  let usePaymentAddr = true;

  $: storedData = usePaymentAddr ? null : addr;

  export function check(): true | string {
    if (!usePaymentAddr && !valid) return "Vyplňte, prosím, adresu";
    return true;
  }
</script>

<div>
  <label for="posthome">
    <input id="posthome" type="radio" name="shipping" value="posthome" bind:group={chosen} />
    <img src={balikDoRuky} alt="logo" />
    Česká pošta – Balík do ruky (+ {price} Kč)
  </label>
  {#if chosen === "posthome"}
    <div class="details" transition:slide|local>
      <p>
        <input type="checkbox" id="use-payment-addr" bind:checked={usePaymentAddr} />
        <label for="use-payment-addr">Adresa pro doručení stejná jako fakturační </label>
      </p>
      {#if !usePaymentAddr}
        <div transition:slide|local>
          <AddressFieldset bind:addr bind:valid legend="Adresa pro doručení" />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "src/lib/shipping.scss";
</style>
