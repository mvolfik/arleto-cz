<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Seznam objednávek | admin ARLETO s.r.o.</title>
</svelte:head>

<div class="header">
  <h3>Admin: seznam objednávek</h3>
  <a href="/admin/">&rarr; Úprava obsahu</a>
</div>
<div class="outer">
  <span class="header">ID</span>
  <span class="header">Obsah</span>
  <span class="header">Zákazník</span>
  <span class="header">Doprava, platba</span>
  <span class="header">Akce</span>

  {#each data.orders.sort((a, b) => b.id - a.id) as order (order.id)}
    {@const orderData = order.data}
    {@const date = new Date(order.order_time)}
    <div class="row-wrapper">
      <div>
        <span>č. {order.id}</span>
        <span>{date.getDate()}. {date.getMonth() + 1}. {date.getFullYear()}</span>
        <span>{date.getHours()}:{date.getMinutes()}</span>
      </div>
      <div>
        <span>{orderData[0].title}</span>
        <span>({orderData[0].price} Kč)</span>
        <span style:font-weight="bold">{orderData.reduce((x, y) => x + y.price, 0)} Kč</span>
      </div>
      <div>
        {#if orderData[1].storedData.name.trim()}
          <span>{orderData[1].storedData.name}</span>
        {/if}
        {#if orderData[1].storedData.company.trim()}
          <span>{orderData[1].storedData.company}</span>
        {/if}
        <span>{orderData[1].storedData.street}</span>
        <span>{orderData[1].storedData.city}</span>
        {#if orderData[1].storedData.note.trim()}
          <span class="note">Poznámka:</span>
          <span>{orderData[1].storedData.note}</span>
        {/if}
      </div>
      <div>
        <span>{orderData[2].title}</span>
        <span>{orderData[1].title}</span>
      </div>
      <div class="actions">
        <span>Todo</span>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "src/lib/utils";

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      @include utils.title;
      margin: 0.4rem 0;
    }

    a {
      @include utils.button;
      color: utils.$link;
    }
  }

  div.outer {
    display: grid;
    grid-template-columns: auto auto auto auto auto;

    & > span.header {
      @include utils.title;
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      justify-self: center;
      margin: 0 0.2rem;
      border-bottom: 2px solid #444;
    }

    .row-wrapper {
      display: contents;
      &:hover > * {
        background-color: #eaeaea;
      }
      & > div {
        border-bottom: 1px dotted #444;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.85rem;
        padding: 0.4rem;

        span.note {
          align-self: flex-start;
          @include utils.title;
          margin-top: 0.2rem;
          & + span {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
  .actions {
    a,
    button {
      font-size: 0.8rem;
      @include utils.button;
      color: utils.$link;
    }
  }
</style>
