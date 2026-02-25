import type { Route } from "./+types/_main.feed";
import { Fragment, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Post, Image } from "~/components";
import { useInfinitePosts } from "~/hooks";
import { readPosts } from "~/lib/db/posts";

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);
  const origin = url.origin;

  const result = await readPosts(env.WIGGLES, origin, { limit: 10 });
  return { initialPosts: result };
}

export default function Feed({ loaderData }: Route.ComponentProps) {
  const parent = useRef<HTMLDivElement>(null);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePosts({
      initialData: {
        pages: [loaderData.initialPosts],
        pageParams: [undefined],
      },
    });
  const posts = data ? data.pages.flatMap(({ posts }) => posts) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 536,
    overscan: 5,
  });

  useEffect(
    () => {
      const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

      if (!lastItem) {
        return;
      }

      if (
        lastItem.index >= posts.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      )
        fetchNextPage();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hasNextPage,
      fetchNextPage,
      posts?.length,
      isFetchingNextPage,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(rowVirtualizer.getVirtualItems()),
    ],
  );

  return (
    <div ref={parent} className="h-full flex flex-col overflow-auto pt-4 px-6">
      <div
        className="w-full flex-grow relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {posts.length > 0 &&
          rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const post = posts[virtualItem.index];
            if (post === undefined) return <Fragment key={virtualItem.key} />;

            const isLoaderRow = virtualItem.index > posts.length - 1;
            if (isLoaderRow) return <>Loading more...</>;

            return (
              <div
                className="absolute top-0 w-full "
                key={virtualItem.key}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-4">
                  <Post
                    id={post.id}
                    account={post.account}
                    timestamp={post.timestamp}
                  >
                    <Image post={post} loading="eager" />
                  </Post>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
