import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Post } from "@/components";
import { Image } from "@/components";
import { NewPost } from "@/types";
import { getAuthHeaders } from "@/utils";

export type PostsResponse = { posts: NewPost[]; cursor?: string };

async function fetchPosts(cursor?: string, limit = 10): Promise<PostsResponse> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts?${params}`, {
    headers,
  });
  if (!res.ok) return { posts: [], cursor: undefined };
  return res.json();
}

export async function feedLoader(): Promise<PostsResponse> {
  try {
    return await fetchPosts();
  } catch {
    return { posts: [], cursor: undefined };
  }
}

export const Feed = () => {
  const initialData = useLoaderData() as PostsResponse;
  const [posts, setPosts] = useState<NewPost[]>(initialData.posts);
  const [cursor, setCursor] = useState<string | undefined>(initialData.cursor);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const fetchingRef = useRef(false);
  const hasNextPage = !!cursor;
  const parent = useRef<HTMLDivElement>(null);

  // Re-fetch if loader returned empty (e.g., auth wasn't ready during loader)
  useEffect(() => {
    if (initialData.posts.length === 0) {
      fetchPosts().then((data) => {
        setPosts(data.posts);
        setCursor(data.cursor);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (fetchingRef.current || !cursor) return;
    fetchingRef.current = true;
    setIsFetchingNextPage(true);
    try {
      const data = await fetchPosts(cursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.cursor);
    } finally {
      fetchingRef.current = false;
      setIsFetchingNextPage(false);
    }
  }, [cursor]);

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
};
