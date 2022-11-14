<script lang="ts">
  import { page } from "$app/stores";

  let open = false;
  let path: string;
  $: {
    path = $page.url.pathname;
    open = false;
  }
</script>

<header>
  <nav class:open>
    <a class:active={path === "/"} class="always" href="/">Úvod</a>

    <a class:active={path === "/cv/"} href="/cv/">CV</a>
    <a class:active={path.startsWith("/projekty/")} href="/projekty/">projekty</a>
    <a class:active={path.startsWith("/eshop/")} href="/eshop/">e-shop</a>
    <a class:active={path === "/kontakt/"} href="/kontakt/">kontakt</a>

    <button
      type="button"
      class="burger"
      class:open
      aria-label="menu"
      aria-expanded={open}
      tabindex="0"
      on:click={() => {
        open = !open;
      }}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  </nav>
</header>

<style lang="scss">
  @use "src/lib/utils";
  @use "sass:color";
  @use "sass:math";

  $size: 3rem;

  nav {
    min-height: $size;
    display: flex;
    padding: 0 utils.$content-inset;
    justify-content: space-between;
    position: relative;
    @include utils.title;

    @include utils.mobile {
      padding-right: utils.$content-inset + $size + 1rem;
      flex-direction: column;
      .burger {
        display: block !important;
        right: 0;
      }
      a.always {
        flex: 0 0 $size !important;
        box-sizing: border-box;
      }

      &:not(.open) {
        a:not(.always) {
          display: none;
        }
      }
    }

    &.open {
      box-shadow: 0 0.5rem 1rem -0.5rem utils.shade(10);
      margin-bottom: 1rem;
    }

    a,
    .burger {
      color: utils.$main;
      text-decoration: none;
      flex: 0 0 content;

      &:not(.burger) {
        padding: 0.5rem 1.1rem;
        display: flex;
        align-items: center;
      }
      &:hover,
      &.active {
        color: utils.$primary;
      }

      &.burger {
        $h: 0.3;
        $w: 0.5;
        padding: 0;
        border: none;
        background-color: unset;
        display: none;
        height: $size;
        position: absolute;
        width: $size;
        box-sizing: border-box;

        span {
          background-color: utils.$main;
          display: block;
          height: 1px;
          left: math.div($size * (1-$w), 2);
          position: absolute;
          transform-origin: center;
          transition-duration: 100ms;
          transition-property: all;
          transition-timing-function: ease-out;
          width: $size * $w;

          &:nth-child(1) {
            top: math.div($size * (1-$h), 2);
          }
          &:nth-child(2) {
            top: calc(50% - 0.5px);
          }
          &:nth-child(3) {
            bottom: math.div($size * (1-$h), 2);
          }
        }
        &.open span {
          $d: 1.2;
          width: $size * $h * $d;
          left: math.div($size * (1-$h * $d), 2);
          color: utils.$fade;

          &:nth-child(1) {
            transform: rotate(45deg);
            top: calc(50% - 0.5px);
          }
          &:nth-child(2) {
            opacity: 0;
          }
          &:nth-child(3) {
            transform: rotate(-45deg);
            bottom: calc(50% - 0.5px);
          }
        }
      }
    }
  }
</style>
