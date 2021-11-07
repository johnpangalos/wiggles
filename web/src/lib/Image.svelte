<script lang="ts">
  import { onMount } from "svelte";
  import { getApp } from "firebase/app";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";
  import { useQuery } from "@sveltestack/svelte-query";

  import type { Post } from "@/types";
  import { observer } from "@/utils/lazy-loader";

  export let post: Post;
  export let lazy: boolean = false;

  const firebaseApp = getApp();
  const storage = getStorage(firebaseApp);

  const thumbnailResult = useQuery(["thumbnail-url", post.id], () =>
    getDownloadURL(ref(storage, post.media.web))
  );
  const urlResult = useQuery(["image-url", post.id], () =>
    getDownloadURL(ref(storage, post.media.web))
  );

  onMount(() => {
    if (!lazy) return;
    let target = document.querySelector(`#post-${post.id}`);
    observer.observe(target);
    return () => observer.unobserve(target);
  });
</script>

<div class="flex justify-center w-full mx-auto">
  <div
    class="flex items-center justify-center min-w-[500px] min-h-[500px] max-w-lg"
  >
    {#if lazy}
      <img
        id={`post-${post.id}`}
        class="lazy object-contain h-full"
        data-src={$urlResult.data}
        alt={$urlResult.data}
      />
    {:else}
      <img
        class="object-contain h-full"
        src={$urlResult.data}
        alt={$urlResult.data}
      />
    {/if}
  </div>
</div>
