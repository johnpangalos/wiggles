<script lang="ts">
  import { onMount } from "svelte";
  import type { Post } from "../types";
  import { getPosts } from "../utils/api";
  import Image from "../lib/Image.svelte"
  import Loading from "../lib/Loading.svelte"

  let loading = true;
  let posts: Post[] = [];
  let lastPostId: string | undefined = undefined;
  let options = {
    root: document.getElementById("scrollArea"),
    rootMargin: "0px",
    threshold: 0.5,
  };
  let observer = new IntersectionObserver(handleIntersection, options);

  async function getNext() {
    const data = await getPosts(lastPostId);
    posts = [...posts, ...data];
    lastPostId = data.reverse()[data.length - 1].id;
    loading = false;
  }

  function handleIntersection(event: IntersectionObserverEntry[]): void {
    if (loading === true) return;
    const [entries] = event;
    loading = true;
    if (!entries.isIntersecting || !lastPostId) {
      loading = false;
      return;
    }
    getNext().catch((error) => {
      loading = false;
      console.error(error);
    });
  }

  onMount(async () => {
    try {
      const data = await getPosts();
      posts = [...posts, ...data];
      lastPostId = data[data.length - 1].id;
      observer.observe(document.querySelector("#end"));
      loading = false;
    } catch (error) {
      loading = false;
      console.error(error);
    }
  });
</script>

<section class="flex flex-col items-center justify-center w-full pt-6 px-2" id="scrollArea">
  <div class="font-bold text-2xl pb-6">Wiggle Room</div>
  <div class="space-y-3">
    {#each posts as post}
      <Image {post} />
    {/each}
  </div>
  <div id="end" />
</section>
