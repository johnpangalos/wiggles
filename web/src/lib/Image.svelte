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

<div
  class="h-72 w-72 border border-gray-700 flex items-center justify-center p-4 bg-white"
>
  <div class="h-full w-full relative">
    <div
      class={clsx("h-full w-full absolute", {
        "opacity-100 animate-pulse": !loaded,
        "opacity-0": loaded,
      })}
    />
    <img
      bind:this={imgRef}
      class={clsx("h-full w-full object-contain relative", {
        "opacity-0": !loaded,
        "opacity-100": loaded,
      })}
      loading="lazy"
      src={post.media.webUrl}
      alt={`cat-${post.id}`}
    />
  </div>
</div>
