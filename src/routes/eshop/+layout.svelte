<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";

  import type { CartItems } from "$lib/utils";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import CartCorner from "$lib/CartCorner.svelte";

  $: path = $page.url.pathname;
  function bumpExpiry(): void {
    const d = new Date();
    d.setHours(d.getHours() + 48);
    localStorage.setItem("cart-expiry", d.toString());
  }

  function loadCart(): CartItems {
    const expiry = localStorage.getItem("cart-expiry");

    if (expiry !== null && new Date(expiry) > new Date()) {
      try {
        const storedCart = localStorage.getItem("cart-items");
        if (storedCart !== null) {
          return JSON.parse(storedCart);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // any fall-through case
    return {};
  }

  const cart: Writable<CartItems> = writable(browser ? loadCart() : {});
  setContext("cart-store", cart);

  $: {
    for (const [id, count] of Object.entries($cart)) {
      if (!Number.isInteger(count) || count === 0) {
        delete $cart[id];
      }
    }
    $cart = $cart; // to trigger update after `delete`, which isn't reactive

    if (browser) {
      localStorage.setItem("cart-items", JSON.stringify($cart));
      bumpExpiry();
    }
  }
</script>

<div class="eshop-bar">
  <div>
    {#if path !== "/eshop/" && !(path === "/eshop/checkout/" && Object.keys($cart).length === 0)}
      <a href="/eshop/" class="back">Zpět na výběr</a>
    {/if}
  </div>
  {#if path !== "/eshop/checkout/"}
    <div class="cart-corner">
      <CartCorner />
    </div>
  {/if}
</div>
<slot />

<style lang="scss">
  @use "src/lib/utils";

  .back {
    @include utils.button;
  }

  .eshop-bar {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0 2rem;
    padding: 0 utils.$content-inset;

    @include utils.mobile {
      flex-direction: column;
      align-items: center;
      & > :not(:last-child) {
        margin-bottom: 0.5rem;
      }
      & > :empty {
        display: none;
      }
    }
  }
</style>
