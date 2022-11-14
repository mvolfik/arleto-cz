<script lang="ts">
  export let addr = { name: "", company: "", street: "", city: "", note: "" };

  export let legend: string;

  export let valid = false;
  $: valid =
    (addr.name.length >= 4 || addr.company.length > 0) &&
    addr.street.length > 0 &&
    addr.city.length >= 8;
</script>

<fieldset>
  <legend>{legend}</legend>
  <div>
    <label for="name" class="required">Jméno a příjmení</label>
    <input type="text" id="name" bind:value={addr.name} />
    <label for="company">Firma</label>
    <input type="text" id="company" bind:value={addr.company} />
    <label for="street" class="required">Ulice, č. p.</label>
    <input type="text" id="street" bind:value={addr.street} />
    <label for="city" class="required">PSČ, Obec</label>
    <input type="text" id="city" bind:value={addr.city} />
    <span>Stát</span>
    <span>Česká republika</span>
    <label for="note">Poznámka</label>
    <input type="text" id="note" bind:value={addr.note} />
  </div>
</fieldset>

<style lang="scss">
  @use "src/lib/utils";

  fieldset {
    @include utils.fieldset;

    div {
      display: grid;
      grid-template-columns: auto 1fr;
      row-gap: 0.3rem;

      :nth-child(2n + 1) {
        text-align: right;
        padding-right: 1rem;

        &.required::after {
          content: "*";
          color: utils.$primary;
          position: absolute;
          transform: translateX(0.2rem);
        }
      }
    }
  }
</style>
