<script lang="ts">
  import { SunIcon, MoonIcon } from "svelte-feather-icons";
  let darkMode = false;

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode.toString());
  }
</script>

<button class="focus:outline-none" on:click={toggleDarkMode}>
  {#if darkMode}
    <MoonIcon class="h-8 w-8" />
  {:else}
    <SunIcon class="h-8 w-8" />
  {/if}
</button>
