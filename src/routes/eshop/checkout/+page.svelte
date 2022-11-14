<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext, tick } from "svelte";

  import type { CartItems, CheckoutInfo, CheckoutStage } from "$lib/utils";
  import { calculateCartTotals } from "$lib/utils";
  import Recap from "$lib/checkout/Recap.svelte";
  import Payment from "$lib/checkout/Payment.svelte";
  import Shipping from "$lib/checkout/Shipping.svelte";
  import Final from "$lib/checkout/Final.svelte";
  import { fade } from "svelte/transition";
  import Sidebar from "$lib/checkout/Sidebar.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const cart: Writable<CartItems> = getContext("cart-store");

  let totalItems: number;

  $: ({ count: totalItems } = calculateCartTotals(data.shopItems, $cart));

  let stageN = 0;
  let prevN = 0;
  const stageClasses = [Recap, Payment, Shipping, Final];
  const stageComponents: Array<undefined | CheckoutStage> = Array(4).fill(undefined);
  const stageData: Array<undefined | CheckoutInfo> = Array(4).fill(undefined);

  let sending = false;

  function checkContinue(n: number) {
    if (n <= prevN) {
      prevN = n;
      return;
    }

    const checks = stageComponents
      .slice(prevN, n)
      .reduce((prev: true | [string, number], c, i): true | [string, number] => {
        if (prev !== true) {
          return prev;
        }
        const checkFn = c?.check;
        if (checkFn === undefined) {
          return true;
        }
        const check = checkFn(stageData);
        if (check === true) {
          return true;
        }
        return [check, i];
      }, true);
    if (checks === true) {
      if (n >= 4) {
        sendOrder();
        stageN = prevN = 3;
      } else {
        prevN = n;
      }
    } else {
      const [err, i] = checks;
      stageN = prevN = i + prevN;
      tick().then(() => {
        // this isn't enough in Chrome - alert apparently freezes animations
        alert(err);
      });
    }
  }

  async function sendOrder() {
    if (sending) return;
    sending = true;
    alert("Not implemented yet");
    await new Promise((r) => setTimeout(r, 1000));
    sending = false;
  }

  $: checkContinue(stageN);
</script>

<svelte:head>
  <title>e-shop | ARLETO s.r.o.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if totalItems === 0}
  <div class="cart-empty">
    <p>Váš košík je prázdný&hellip;</p>
    <p>
      <a href="/eshop/"><span class="material-icons">chevron_right</span> Přejít na výběr</a>
    </p>
  </div>
{:else}
  <div class="outer">
    {#key stageN}
      <span class="stage" transition:fade|local={{ duration: 300 }}
        >{stageComponents[stageN]?.title}</span
      >
    {/key}
    <div class="scroller">
      <div style="--i: {stageN}">
        {#each stageClasses as cls, i}
          <div>
            <svelte:component this={cls} bind:this={stageComponents[i]} bind:data={stageData[i]} />
          </div>
        {/each}
        <div>
          <p>
            Vaše objednávka byla úspěšně odeslána. Potvrzení objednávky a případné platební údaje
            Vám byly doručeny na zadanou e-mailovou adresu: {stageData[3]?.storedData?.email}
          </p>
        </div>
      </div>
    </div>
    <div class="buttons">
      <div>
        {#if 0 < stageN && stageN < 4}
          <button on:click={() => (stageN -= 1)} type="button">
            <span class="material-icons">navigate_before</span>
            Zpět
          </button>
        {/if}
      </div>
      <button on:click={() => (stageN += 1)} type="button" class:submit={stageN == 3}>
        {#if stageN < 3}
          Pokračovat
          <span class="material-icons">navigate_next</span>
        {:else}
          {#if sending}
            <span class="material-icons sending-marker">mail</span>
          {/if}
          Odeslat objednávku
          <span class="material-icons">send</span>
        {/if}</button
      >
    </div>
    {#if stageN === 3}
      <p class="conditions">
        Odesláním objednávky přijímáte naše <a href="/eshop/podminky/" target="_blank"
          >Všeobecné obchodní podmínky</a
        > včetně obsažených Zásad ochrany osobních údajů.
      </p>
    {/if}

    <aside>
      <Sidebar {stageData} bind:stageN />
    </aside>
  </div>
{/if}

<style lang="scss">
  @use "src/lib/utils";
  @use "sass:math";

  .cart-empty {
    text-align: center;

    a {
      @include utils.button;
    }
  }

  .outer {
    display: grid;
    grid-template-columns: minmax(0, 9fr) 2fr;
    grid-template-rows: 2rem minmax(25rem, calc(100vh - 28rem)) 3rem 1.5rem;
    grid-template-areas:
      "stage ."
      "main aside"
      "buttons ."
      "conditions conditions";
  }

  .stage {
    color: utils.$primary;
    grid-area: stage;
    padding-left: 1.1rem;
    font-size: 1.3rem;
    @include utils.title;
  }

  .scroller {
    // It should be clip, but that isn't supported by Safari.
    // This causes issues with programmatic scrolling which is triggered by tabbing.
    overflow: hidden;
    grid-area: main;
    // box-shadow: inset 5rem 0 1rem -2rem black;

    $gap: 5rem;

    & > div {
      display: flex;
      transition: transform 0.6s cubic-bezier(0.3, 0, 0.7, 1);
      transform: translate(calc(-1 * var(--i) * (100% + #{$gap * 2}) - #{$gap}));
      height: 100%;

      & > div {
        box-sizing: border-box;
        padding-left: 0.8rem;
        width: 100%;
        flex: auto 0 0;
        margin: 0 $gap;
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    grid-area: buttons;
    align-items: center;

    button {
      @include utils.button;
      color: utils.$link;
      font-size: 1.05rem;

      &.submit {
        color: utils.$primary;
      }
      // @include utils.title;
      // background-color: utils.$primary;
      // color: utils.$white;
      // padding: 0.4rem;
      // border: none;
      // border-radius: utils.$border-radius;
      // cursor: pointer;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  .conditions {
    @include utils.long-text;
    font-size: 0.75rem;
    grid-area: conditions;
  }

  aside {
    border-left: 2px solid utils.$main;
    padding: 0.4rem;
    font-size: 0.9rem;
    margin-left: 0.4rem;
    grid-area: aside;
  }

  @media screen and (max-width: utils.$max-width) {
    // TODO
  }

  @keyframes sending {
    0% {
      opacity: 0;
      transform: translateX(-0.4em);
    }
    50% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(0.4em);
    }
  }
  .sending-marker {
    animation: 2s infinite sending;
    margin: 0 0.2em 0 0.1em;
  }
</style>
