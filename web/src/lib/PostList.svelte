<script lang="ts">
  import { onMount } from "svelte";
  export let urls: string[];
  export let callback: IntersectionObserverCallback;

  const observer = new IntersectionObserver(
    (...args) => {
      if (args[0][0].intersectionRatio === 0) return;
      callback(...args);
    },
    {
      root: document.querySelector("#post-list"),
    }
  );

  onMount(async () => {
    let target = document.querySelector("#post-list-end");
    observer.observe(target);
    return () => observer.unobserve(target);
  });
</script>

<div id="post-list" class="w-full px-4 overflow-y-scroll space-y-4">
  {#each urls as url}
    <div class="flex justify-center w-full mx-auto">
      <div
        class="flex items-center justify-center w-[500px] h-[500px] max-w-lg p-4 bg-gray-200"
      >
        <img class="object-contain h-full" src={url} alt={url} />
      </div>
    </div>
  {/each}
  <div id="post-list-end" />
</div>
