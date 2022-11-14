<script lang="ts">
  import AddressFieldset from "$lib/AddressFieldset.svelte";
  import type { Address, CheckoutInfo } from "$lib/utils";

  let chosen: string | undefined = undefined;

  const options: Record<string, { data: CheckoutInfo; desc: string; icon: string }> = {
    prevod: {
      data: {
        title: "Bankovní převod",
        price: 0,
      },
      desc: "Převodem na účet (zdarma, zboží bude odesláno po přijetí platby)",
      icon: "account_balance",
    },
    dobirka: {
      data: {
        title: "Dobírka",
        price: 30,
      },
      desc: "Dobírkou při převzetí (+ 30 Kč, ale zboží může být odesláno hned)",
      icon: "payments",
    },
  };

  export let data: CheckoutInfo | undefined = undefined;

  export function check(): true | string {
    if (data === undefined) return "Nebyl vybrán způsob platby";
    else if (!valid) return "Vyplňte, prosím, povinné údaje";
    return true;
  }

  export const title = "Výběr způsobu platby";

  let storedData: Address;
  let valid: boolean;

  $: data = chosen === undefined ? undefined : { storedData, ...options[chosen]?.data };
</script>

{#each Object.entries(options) as [id, opt] (id)}
  <p>
    <input {id} type="radio" bind:group={chosen} name="payment" value={id} />
    <label for={id}><span class="material-icons">{opt.icon}</span> {opt.desc}</label>
  </p>
{/each}
<AddressFieldset bind:addr={storedData} bind:valid legend="Fakturační adresa" />
