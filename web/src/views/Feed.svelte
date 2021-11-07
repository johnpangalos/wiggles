<script lang="ts">
  import { useInfiniteQuery } from "@sveltestack/svelte-query";
  import { fetchPosts } from "@/firebase";
  import Image from "@/lib/Image.svelte";
  import InfiniteScroll from "@/lib/InfiniteScroll.svelte";
  import Loading from "@/lib/Loading.svelte";

  let postSnapshots = useInfiniteQuery({
    queryKey: "posts",
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 10) return;
      return lastPage[lastPage.length - 1];
    },
  });

  function isLazy(pageIdx, docIdx): boolean {
    return pageIdx > 0 || (pageIdx === 0 && docIdx > 2);
  }
</script>

{#if $postSnapshots.status === "loading"}
  <div class="flex items-center justify-center h-full">
    <Loading />
  </div>
{:else if $postSnapshots.status === "error"}
  <div>Error</div>
{:else}
  <div class="space-y-3 px-2 md:px-0 h-full overflow-y-scroll">
    <InfiniteScroll
      id={"post-list-end"}
      callback={() => $postSnapshots.fetchNextPage()}
    >
      {#each $postSnapshots.data.pages as page, pageIdx}
        {#each page as doc, docIdx}
          {#await doc.data() then post}
            <Image {post} lazy={isLazy(pageIdx, docIdx)} />
          {/await}
        {/each}
      {/each}
    </InfiniteScroll>
  </div>
{/if}
