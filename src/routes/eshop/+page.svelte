<script lang="ts">
  import type { PartialItem } from "$lib/utils";
  import type { PageData } from "./$types";
  import { flip } from "svelte/animate";

  export let data: PageData;

  let selected: "alpha" | "expensive" | "cheap" = "alpha";
  const sortFns: Record<string, (a: [string, PartialItem], b: [string, PartialItem]) => number> = {
    alpha: (a, b) => new Intl.Collator("cs").compare(a[1].title, b[1].title),
    cheap: (a, b) => a[1].price - b[1].price,
    expensive: (a, b) => b[1].price - a[1].price,
  };
  $: sortedItems = Object.entries(data.shopItems).sort(sortFns[selected]);
</script>

<svelte:head>
  <title>Výběr produktů | e-shop | Eva Volfová</title>
</svelte:head>

<div class="filters">
  <div class="sort">
    Seřadit:
    <select bind:value={selected}>
      <option value="alpha">Abecedně</option>
      <option value="cheap">Od nejlevnějších</option>
      <option value="expensive">Od nejdražších</option>
    </select>
  </div>
</div>
<div class="tiles">
  {#each sortedItems as [id, item] (id)}
    <a animate:flip={{ duration: 500 }} href={"/eshop/" + id + "/"}>
      <!-- bookmark: img -->
      <img
        src="https://c.evavolfova.cz/a/{item.image.id}/{Math.max(...item.image.sizes)}/webp"
        alt="fotografie"
        srcset={item.image.sizes
          .sort((a, b) => a - b)
          .map((size) => `https://c.evavolfova.cz/a/${item.image.id}/${size}/webp ${size}w`)
          .join(", ")}
        sizes="17rem"
      />
      <p class="title">
        {item.title}
      </p>
      <p class="price">{item.price} Kč</p>
      <p class="desc">{item.description}</p>
    </a>
  {/each}
</div>

<style lang="scss">
  @use "sass:math";
  @use "src/lib/utils";

  .filters {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0 utils.$content-inset 0.2rem;

    .sort {
      grid-column: 2;

      select {
        border: 2px solid utils.$primary;
        border-radius: 5px;
        background-color: utils.$primary-light;
        color: utils.$darker;
        font-size: 0.9rem;
        padding: 0.1rem;
        cursor: pointer;
      }
    }
  }

  $column-gap: utils.$content-inset;
  $precise-size: math.div(utils.$max-width, 3) - (2 * $column-gap);
  $size: math.div(math.floor(($precise-size - 0.005rem) * 1000), 1000);

  .tiles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;

    a {
      $br: utils.$border-radius;

      flex: $size 0 0;
      text-decoration: none;
      color: utils.$main;
      margin: 0.5rem $column-gap;
      border-radius: $br;
      padding-bottom: 0.8rem;
      overflow: clip;
      background-color: utils.$white;

      @include utils.hovershade;

      p {
        margin: 0.5rem 0.5rem 0 0.7rem;
      }

      .title {
        color: utils.$primary;
        @include utils.title;
      }

      .desc {
        @include utils.long-text;
        font-size: 0.9rem;
      }

      img {
        width: $size;
        height: $size;
        object-fit: cover;
      }
    }
  }
</style>
