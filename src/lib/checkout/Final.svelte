<script lang="ts">
  import type { CheckoutInfo } from "$lib/utils";

  export let data: CheckoutInfo = { title: "", price: 0, storedData: { email: "", phone: "" } };

  export function check(): true | string {
    // TODO: use native field validation for email?
    // phone re: ^(?:|(?:\+420)?(?: ?[0-9]){9})$
    return (
      /^[^@]+@[^@]+\.[a-z0-9]{2,}$/.test(data.storedData.email) ||
      "Zadejte, prosím, emailovou adresu ve správném formátu"
    );
  }

  export const title = "Kontaktní údaje & odeslání objednávky";
</script>

<p>
  <label for="email">Emailová adresa</label>
  <input type="email" bind:value={data.storedData.email} id="email" />
</p>

<p>
  Věnujte, prosím, pozornost tomu, abyste zadali správnou emailovou adresu – budou vám na ni zaslány
  údaje pro platbu
</p>

<p>
  <label for="phone"
    >Telefonní číslo (nepovinné, pro rychlejší kontakt v případě problémů s objednávkou)</label
  >
  <input type="phone" bind:value={data.storedData.phone} id="phone" />
</p>
