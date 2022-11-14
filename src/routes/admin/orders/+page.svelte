<script lang="ts">
  import type { DBOrder } from "src/routes/api/orders/db";
  import type { PageData } from "./$types";

  export let data: PageData;

  let creatingFacturoid = new Set();
  let creatingPacketa = new Set();
  async function createInvoice(order: DBOrder) {
    creatingFacturoid.add(order.id);
    creatingFacturoid = creatingFacturoid;
    try {
      const contactResponse = await fetch("/api/fakturoid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: ["subjects.json"],
          method: "POST",
          body: JSON.stringify({
            name: order.data[1].storedData.name,
            street: order.data[1].storedData.street,
            city: order.data[1].storedData.city,
            country: "CZ",
          }),
        }),
      });
      const contactData = (await contactResponse.json()) as { id: number };
      const dateString = new Date(order.order_time).toISOString().slice(0, 10);
      const lines: { name: string; quantity: number; unit_price: number; unit?: string }[] =
        Object.entries(order.data[0].storedData.cart).map(([item, number]) => ({
          name: order.data[0].storedData.shopItems[item].title,
          quantity: number,
          unit_price: order.data[0].storedData.shopItems[item].price,
          unit: "ks",
        }));
      lines.push({
        name: "Způsob platby: " + order.data[1].title,
        unit_price: order.data[1].price,
        quantity: 1,
      });
      lines.push({
        name: "Způsob dopravy: " + order.data[2].title,
        unit_price: order.data[2].price,
        quantity: 1,
      });
      const invoiceResponse = await fetch("/api/fakturoid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: ["invoices.json"],
          method: "POST",
          body: JSON.stringify({
            subject_id: contactData.id,
            number_format_id: 435109,
            variable_symbol: order.id,
            currency: "CZK",
            payment_method: order.data[1].title === "Dobírka" ? "cod" : "bank",
            due: 7,
            issued_on: dateString,
            taxable_fulfillment_due: dateString,
            lines,
          }),
        }),
      });
      const invoiceData = (await invoiceResponse.json()) as { id: number };
      const updateResponse = await fetch("/api/orders/update-fakturoid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          fakturoid_id: invoiceData.id,
        }),
      })
        .then((x) => x.json())
        .catch((e) => {
          console.error(e);
          return { ok: false as const };
        });
      if (!updateResponse.ok)
        alert(
          "The invoice was created, but failed saving it to the database. Find it in the Fakturoid app."
        );

      order.fakturoid_id = invoiceData.id;
      data.orders = data.orders;
    } catch (e) {
      console.error(e);
    }
    creatingFacturoid.delete(order.id);
    creatingFacturoid = creatingFacturoid;
  }

  async function createPacketa(order: DBOrder) {}
</script>

<svelte:head>
  <title>Seznam objednávek | admin Eva Volfová</title>
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
        {#if order.id < 50}
          <span>Faktura mimo Fakturoid</span>
        {:else if creatingFacturoid.has(order.id)}
          <button disabled style:color="rgb(132, 114, 0)">Vytvářím fakturu...</button>
        {:else if order.fakturoid_id === null}
          <button style:color="rgb(132, 114, 0)" on:click={() => createInvoice(order)}>
            Vytvořit fakturu
          </button>
        {:else}
          <span>
            <button
              style:color="rgb(0, 53, 178)"
              on:click={async () => {
                const response = await fetch("/api/fakturoid", {
                  method: "POST",
                  body: JSON.stringify({
                    path: ["invoices", `${order.fakturoid_id}.json`],
                    method: "GET",
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) alert("Opening failed, please try again");
                else window.open((await response.json()).public_html_url);
              }}>Zobrazit fakturu</button
            >
          </span>
        {/if}
        {#if orderData[2].title === "Zásilkovna"}
          {#if creatingPacketa.has(order.id)}
            <button disabled style:color="rgb(132, 114, 0)">Generuji štítek...</button>
          {:else if order.packeta_id === null}
            <button style:color="rgb(132,114,0)" on:click={() => createPacketa(order)}>
              Vygenerovat štítek
            </button>
          {:else}
            <span>Todo</span>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "src/lib/utils";

  // :global(div.wrapper) {
  //   max-width: none !important;
  // }
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
