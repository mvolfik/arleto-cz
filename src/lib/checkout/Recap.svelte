<script lang="ts">
  import { calculateCartTotals, type PartialItem } from "$lib/utils";
  import type { CartItems, CheckoutInfo } from "$lib/utils";
  import type { Writable } from "svelte/store";
  import { getContext, onMount } from "svelte";
  import CartNumberEditor from "$lib/CartNumberEditor.svelte";
  import { page } from "$app/stores";

  const cart: Writable<CartItems> = getContext("cart-store");
  export function check(): true {
    return true;
  }
  export const title = "Obsah košíku";
  export let data: CheckoutInfo | undefined = undefined;
  $: shopItems = $page.data.shopItems as Record<string, PartialItem>;
  $: {
    const d = calculateCartTotals(shopItems, $cart);
    data = {
      title:
        d.count === 1
          ? `${d.count} položka`
          : d.count < 5
          ? `${d.count} položky`
          : `${d.count} položek`,
      price: d.sum,
      storedData: { cart: $cart, shopItems },
    };
  }

  let scroller: HTMLDivElement;
  const scrollThreshold = 10;

  let canScrollUp = false;
  let canScrollDown = true;

  function updateScroll() {
    canScrollUp = scroller.scrollTop > scrollThreshold;
    canScrollDown =
      scroller.scrollTop + scroller.clientHeight + scrollThreshold < scroller.scrollHeight;
  }
  onMount(() => {
    updateScroll();
    const resizeObserver = new ResizeObserver(updateScroll);
    resizeObserver.observe(scroller);
    const interval = setInterval(updateScroll, 1000); // probably necessary durin
    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  });
</script>

<div class="scroller" bind:this={scroller} on:scroll={updateScroll}>
  <div
    class="shadow"
    class:shadow-top={canScrollUp && !canScrollDown}
    class:shadow-both={canScrollUp && canScrollDown}
    class:shadow-bottom={canScrollDown && !canScrollUp}
  />
  <div class="grid">
    {#each Object.entries($cart) as [id, count] (id)}
      {@const item = shopItems[id]}
      <a href="/eshop/{id}" class="title">{item.title}</a>
      <span class="img"
        ><img
          src="https://c.evavolfova.cz/a/{item.image.id}/{Math.max(...item.image.sizes)}/webp"
          alt="fotografie"
          srcset={item.image.sizes
            .sort((a, b) => a - b)
            .map((size) => `https://c.evavolfova.cz/a/${item.image.id}/${size}/webp ${size}w`)
            .join(", ")}
          sizes="(min-width: 50rem) 15rem, 30vw"
        /></span
      >
      <div class="inner">
        <div class="number-editor">
          <CartNumberEditor bind:value={$cart[id]} max={item.stock} itemID={id} />
        </div>
        <span class="unit-price">&times; {item.price} Kč</span>
        <span class="total-price">= {item.price * count} Kč</span>
        <button
          class="remove"
          on:click={() => {
            if (confirm("Odebrat z košíku?")) {
              delete $cart[id];
              $cart = $cart;
            }
          }}>Odebrat</button
        >
        <span class="item-desc">{item.description}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "src/lib/utils";

  div.scroller {
    overflow-y: auto;
    height: 100%;

    .shadow {
      position: absolute;
      pointer-events: none;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      transition: box-shadow 0.1s linear;
      $shadowSize: 1rem;
      $shadowOff: $shadowSize * 0.7;

      &.shadow-top {
        box-shadow: inset 0 $shadowOff $shadowSize (-$shadowSize), inset 0 0 0 0;
      }
      &.shadow-bottom {
        box-shadow: inset 0 0 0 0, inset 0 (-$shadowOff) $shadowSize (-$shadowSize);
      }
      &.shadow-both {
        box-shadow: inset 0 $shadowOff $shadowSize (-$shadowSize),
          inset 0 (-$shadowOff) $shadowSize (-$shadowSize);
      }
    }
  }
  div.grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.2rem;

    .title {
      @include utils.title;

      grid-column: 1/-1;
      margin: 1rem 0 0.2rem 0.3rem;
      font-size: 1.1rem;
      text-decoration: none;
      color: utils.$main;

      &:hover {
        color: utils.$link;
      }
    }

    .img {
      grid-column: 1;
      grid-row: span 2;
      display: flex;
      align-items: flex-start;
      margin-right: 0.3rem;

      img {
        max-width: 100%;
      }
    }

    .inner {
      grid-column: 2;
      display: grid;
      grid-template-columns: auto 1fr 1fr auto;
      align-items: center;
      justify-items: center;

      button.remove {
        @include utils.button;
        padding: 0.4rem;
        color: utils.$primary;
        font-size: 1em;
        margin-right: 0.6rem;
      }

      .item-desc {
        grid-column: 1/-1;
        justify-self: baseline;
        align-self: baseline;
        margin: 1rem 0;
      }
    }
  }
</style>
