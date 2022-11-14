<script lang="ts">
  import { getContext } from "svelte";
  import type { Readable } from "svelte/store";

  import { calculateCartTotals } from "$lib/utils";
  import type { CartItems } from "$lib/utils";
  import { page } from "$app/stores";

  const cart: Readable<CartItems> = getContext("cart-store");

  let cartItemsCount: number;
  let cartTotal: number;

  $: ({ count: cartItemsCount, sum: cartTotal } = calculateCartTotals($page.data.shopItems, $cart));
</script>

<a href="/eshop/checkout/">
  <span class="material-icons">shopping_basket</span>
  Košík ({#if cartItemsCount === 0}prázdný{:else}{cartItemsCount}
    {#if cartItemsCount === 1}položka{:else if cartItemsCount <= 4}položky{:else}položek{/if}
    –
    {cartTotal} Kč{/if})</a
>

<style lang="scss">
  @use "src/lib/utils";
  a {
    @include utils.button;
    color: utils.$primary;
  }
  .material-icons {
    font-size: 1.1em !important;
  }
</style>
