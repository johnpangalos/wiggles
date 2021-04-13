<script lang="ts">
  import { darkMode } from "../stores";

  let isDarkMode = false;
  darkMode.subscribe((val) => (isDarkMode = val));

  function toggleDarkMode() {
    darkMode.set(!isDarkMode);
  }
</script>

<button
  class={`h-8 w-8 flex items-center justify-center col-start-1
    row-start-1 rounded-full focus:outline-none z-10 hover:bg-gray-600 hover:bg-opacity-10
    dark:hover:bg-gray-300 dark:hover:bg-opacity-10`}
  on:click={toggleDarkMode}
>
  {#if isDarkMode}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d={`M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4
          4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1
          1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1
          1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1
          0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414
          8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z`}
        clip-rule="evenodd"
      />
    </svg>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      />
    </svg>
  {/if}
</button>
