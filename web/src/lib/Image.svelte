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
  class="max-w-lg shadow rounded-lg flex items-center justify-center overflow-hidden"
>
  <div class="h-full w-full relative px-4 py-5 sm:p-6">
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
