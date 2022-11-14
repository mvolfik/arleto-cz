<script lang="ts">
  import CartNumberEditor from "$lib/CartNumberEditor.svelte";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { CartItems, Item } from "$lib/utils";
  import Markdown from "$lib/Markdown.svelte";
  import type { PageData } from "./$types";

  const cart: Writable<CartItems> = getContext("cart-store");

  export let data: PageData;
  $: item = data.item;
  $: itemID = data.itemID;
  $: inCart = Number.isInteger($cart[itemID]) && $cart[itemID] > 0;
</script>

<svelte:head>
  <title>{item.title} | e-shop | Eva Volfová</title>
</svelte:head>

<div class="layout">
  <h1>{item.title}</h1>
  <div class="image">
    <!-- bookmark: img -->
    <img
      src="https://c.evavolfova.cz/a/{item.image.id}/{Math.max(...item.image.sizes)}/webp"
      alt="fotografie"
      srcset={item.image.sizes
        .sort((a, b) => a - b)
        .map((size) => `https://c.evavolfova.cz/a/${item.image.id}/${size}/webp ${size}w`)
        .join(", ")}
      sizes="25rem"
    />
  </div>
  <div class="details">
    <p class="description">{item.description}</p>

    {#each item.props ?? [] as { key, value } (key)}
      <p class="key">{key}:</p>
      <p class="value">{value}</p>
    {/each}

    <p class="key">cena:</p>
    <p class="value">{item.price} Kč</p>

    <p class="key"><span class:hidden={!inCart}>v košíku:</span></p>
    <div class="value cart" class:not-in-cart={!inCart}>
      <CartNumberEditor bind:value={$cart[itemID]} max={item.stock} {itemID} />
    </div>
  </div>
  <div class="content">
    <Markdown t={item.body} />
  </div>
  {#if item.gallery}
    <div class="gallery">
      {#each item.gallery as { image } (image.id)}
        <div>
          <!-- bookmark: img -->
          <img
            src="https://c.evavolfova.cz/a/{image.id}/{Math.max(...image.sizes)}/webp"
            alt="fotografie"
            srcset={image.sizes
              .sort((a, b) => a - b)
              .map((size) => `https://c.evavolfova.cz/a/${image.id}/${size}/webp ${size}w`)
              .join(", ")}
            sizes="(max-width: 50rem) 100vw, 50rem"
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "src/lib/utils";
  .layout {
    display: grid;
    grid-template:
      "image title"
      "image details"
      "image ."
      "content content"
      "gallery gallery"
      / 25rem 1fr;

    @media screen and (max-width: 48rem) {
      display: flex;
      flex-direction: column;
      align-items: center;

      .details {
        margin-left: utils.$content-inset !important;
        margin-top: 2rem !important;
        grid-template-columns: 1fr !important;
        min-width: min(50vw, 20rem);

        .key {
          margin-bottom: 0 !important;
          border-bottom: none !important;
          text-align: left !important;

          span.hidden {
            display: none;
          }
        }
        .value {
          text-align: left;
        }

        .cart {
          justify-content: end;
        }
        .not-in-cart.cart {
          padding-bottom: 0.4rem;
        }
      }
    }

    h1 {
      grid-area: title;
      padding: 0 1.5rem;
      font-size: 1.3rem;
      @include utils.title;
    }

    .image {
      grid-area: image;

      img {
        width: 100%;
        max-width: 25rem;
      }
    }

    .details {
      grid-area: details;
      margin: 0 utils.$content-inset 0 1rem;
      display: grid;
      grid-template-columns: max-content 1fr;

      & > * {
        margin: 0 0 0.45rem;
        border-bottom: 2px solid utils.$main;
        padding: 0 0.5rem 0.3rem;
      }

      .key {
        text-align: left;
        @include utils.title;

        span.hidden {
          visibility: hidden;
        }
      }

      .description {
        grid-column: 1/-1;
        font-size: 0.93rem;
      }

      .cart {
        display: flex;
        padding-bottom: 0.15rem;
      }
    }

    .content {
      grid-area: content;
      padding: 0 utils.$content-inset;
    }

    .gallery {
      grid-area: gallery;
      display: flex;
      flex-wrap: wrap;

      div {
        text-align: center;
        margin: 0.2rem;
        max-width: 100%;

        img {
          max-height: 13rem;
          max-width: 100%;
        }
      }
    }
  }
</style>
