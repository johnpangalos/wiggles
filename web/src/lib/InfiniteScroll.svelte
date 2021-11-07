<script lang="ts">
  import { onMount } from "svelte";
  export let callback: IntersectionObserverCallback;
  export let id: string;

  const observer = new IntersectionObserver(
    (...args) => {
      if (args[0][0].intersectionRatio === 0) return;
      callback(...args);
    },
    {
      threshold: 1.0,
    }
  );

  onMount(() => {
    let target = document.querySelector(`#${id}`);
    observer.observe(target);
    return () => observer.unobserve(target);
  });
</script>

<slot />
<div {id} />
