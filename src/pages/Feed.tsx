import { Fragment, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Post as PostType } from "@/types";
import { Loading, Post } from "@/components";
import { Image } from "@/components";
import { useInfinitePosts, useAccount } from "@/hooks";

export const PostItem = ({ post }: { post: PostType }) => {
  const { data, status } = useAccount(post);

  if (status === "loading") return <></>;

  return (
    <div className="pb-4">
      <Post id={post.refId} account={data} timestamp={post.timestamp}>
        {post && <Image post={post} loading="lazy" />}
      </Post>
    </div>
  );
};

export const Feed = () => {
  const parent = useRef<HTMLDivElement>(null);

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePosts({ imageSize: "web" });
  const posts = data ? data.pages.flatMap((posts) => posts) : [];

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
    ]
  );

  if (status === "loading") return <Loading />;
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
                <PostItem post={post} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
