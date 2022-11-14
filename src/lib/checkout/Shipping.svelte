<script lang="ts">
  import type { CheckoutInfo, ShippingOption } from "$lib/utils";
  import Zasilkovna from "./shipping/Zasilkovna.svelte";
  import Pickup from "./shipping/Pickup.svelte";
  import PostHome from "./shipping/PostHome.svelte";

  let chosen: string | undefined = undefined;

  const options: Record<string, { component: ShippingOption | undefined; storedData: any }> = {
    zasilkovna: { component: undefined, storedData: undefined },
    pickup: { component: undefined, storedData: undefined },
    posthome: { component: undefined, storedData: undefined },
    postpost: { component: undefined, storedData: undefined },
  };

  export let data: CheckoutInfo | undefined = undefined;

  export function check(data: Array<CheckoutInfo | undefined>) {
    if (chosen === undefined) {
      return "Nebyl vybrán způsob doručení";
    }

    return (
      options[chosen]?.component?.check(data) ??
      "Nastala neočekávaná chyba. Zkuste znovu načíst stránku"
    );
  }

  export const title = "Výběr způsobu dopravy";

  $: {
    const x = options[chosen ?? ""];
    if (x === undefined || x.component === undefined) {
      data = undefined;
    } else {
      data = {
        title: x.component.title,
        price: x.component.price,
        storedData: { chosen, data: x.storedData },
      };
    }
  }
</script>

<Zasilkovna
  bind:this={options.zasilkovna.component}
  bind:chosen
  bind:storedData={options.zasilkovna.storedData}
/>
<Pickup
  bind:this={options.pickup.component}
  bind:chosen
  bind:storedData={options.pickup.storedData}
/>

<PostHome
  bind:this={options.posthome.component}
  bind:chosen
  bind:storedData={options.posthome.storedData}
/>
