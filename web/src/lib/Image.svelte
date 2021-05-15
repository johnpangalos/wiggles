<script lang="ts">
  import { onMount } from "svelte";
  import clsx from "clsx";
  import type { Post } from "../types";
  export let post: Post;
  let imgRef: HTMLImageElement;
  let loaded = false;
  onMount(() => {
    imgRef.onload = () => {
      loaded = true;
    };
  });
</script>

<div class="shadow rounded-lg  px-4 py-5 sm:p-6">
  <div class={clsx("h-72 w-72 sm:h-[30rem] sm:w-[30rem] relative", {
    "overflow-hidden": !loaded
  })}>
    <div
      class={clsx("h-full w-full absolute bg-gray-200", {
        "opacity-100 animate-pulse": !loaded,
        "opacity-0": loaded,
      })}
    />
    <img
      bind:this={imgRef}
      class={clsx("h-full w-full object-contain relative bg-gray-200", {
        "opacity-0": !loaded,
        "opacity-100": loaded,
      })}
      loading="lazy"
      src={post.media.webUrl}
      alt={`cat-${post.id}`}
    />
  </div>

</div>