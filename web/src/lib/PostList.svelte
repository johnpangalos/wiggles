<script lang="ts">
  import { getApp } from "firebase/app";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";
  import { onMount } from "svelte";
  import type { Post } from "@/types";
  export let posts: Post[];
  export let callback: IntersectionObserverCallback;

  const firebaseApp = getApp();
  const storage = getStorage(firebaseApp);

  const observer = new IntersectionObserver(
    (...args) => {
      if (args[0][0].intersectionRatio === 0) return;
      callback(...args);
    },
    {
      root: document.querySelector("#post-list"),
      threshold: 0.5,
    }
  );

  onMount(async () => {
    let target = document.querySelector("#post-list-end");
    observer.observe(target);
    return () => observer.unobserve(target);
  });
</script>

<div id="post-list" class="w-full px-4 overflow-y-scroll space-y-4">
  {#each posts as post}
    <div class="flex justify-center w-full mx-auto">
      <div
        class="flex items-center justify-center w-[500px] h-[500px] max-w-lg p-4 bg-gray-200"
      >
        {#await getDownloadURL(ref(storage, post.media.web)) then url}
          <img
            class="object-contain h-full"
            src={url}
            loading="lazy"
            alt={url}
          />
        {/await}
      </div>
    </div>
  {/each}
  <div id="post-list-end" />
</div>
