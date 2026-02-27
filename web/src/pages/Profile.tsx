import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLoaderData, useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { NewPost } from "@/types";
import { Button, Image, Post } from "@/components";
import { usePendingPoll } from "@/hooks";
import { getAuthHeaders, getUserEmail } from "@/utils";
import { useAuth0 } from "@auth0/auth0-react";

export type ProfilePostsResponse = { posts: NewPost[]; cursor?: string };

async function fetchProfilePosts(
  email: string,
  cursor?: string,
  limit = 30,
): Promise<ProfilePostsResponse> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  params.set("email", email);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts?${params}`, {
    headers,
  });
  if (!res.ok) return { posts: [], cursor: undefined };
  return res.json();
}

export async function profileLoader(): Promise<ProfilePostsResponse> {
  const email = getUserEmail();
  if (!email) return { posts: [], cursor: undefined };
  return await fetchProfilePosts(email);
}

export async function profileAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const orderKeys = formData.getAll("orderKey") as string[];

  const res = await fetch(`${import.meta.env.VITE_API_URL}/bulk-delete`, {
    method: "POST",
    body: JSON.stringify(orderKeys),
    headers: { ...(await getAuthHeaders()) },
  });
  if (res.status > 300) throw new Error("delete failed");
  return await res.json();
}

export function Profile() {
  const { logout, user } = useAuth0();
  const initialData = useLoaderData() as ProfilePostsResponse;
  const [posts, setPosts] = useState<NewPost[]>(initialData.posts);
  const [cursor, setCursor] = useState<string | undefined>(initialData.cursor);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const fetchingRef = useRef(false);
  const hasNextPage = !!cursor;

  const [selectMode, setSelectMode] = useState(false);
  const [selectedOrderKeys, setSelectedOrderKeys] = useState<
    Record<string, NewPost>
  >({});
  const deletedKeysRef = useRef<Set<string>>(new Set());
  const signOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin + "/login" } });
  };
  const parent = useRef<HTMLDivElement>(null);

  const fetchNextPage = useCallback(async () => {
    if (fetchingRef.current || !cursor || !user?.email) return;
    fetchingRef.current = true;
    setIsFetchingNextPage(true);
    try {
      const data = await fetchProfilePosts(user.email, cursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.cursor);
    } finally {
      fetchingRef.current = false;
      setIsFetchingNextPage(false);
    }
  }, [cursor, user?.email]);

  const fetcher = useFetcher();

  // Sync fresh loader data into local state after revalidation completes.
  // Filter out any posts that were optimistically deleted in case KV list
  // hasn't fully propagated the deletion yet.
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const deleted = deletedKeysRef.current;
      const freshPosts =
        deleted.size > 0
          ? initialData.posts.filter((p) => !deleted.has(p.orderKey))
          : initialData.posts;
      setPosts(freshPosts);
      setCursor(initialData.cursor);
      deletedKeysRef.current = new Set();
    }
  }, [fetcher.state, fetcher.data, initialData]);

  // Poll with backoff when any visible post is still pending (image uploading).
  const refetchProfile = useMemo(
    () => async () => {
      const email = user?.email;
      if (!email) return posts;
      const data = await fetchProfilePosts(email);
      return data.posts;
    },
    [user?.email, posts],
  );
  const onProfilePollUpdate = useCallback((fresh: NewPost[]) => {
    setPosts(fresh);
  }, []);
  usePendingPoll(posts, refetchProfile, onProfilePollUpdate);

  const postRows = posts.reduce<NewPost[][]>((acc, curr, index) => {
    if (index % 3 === 0) {
      acc.push([curr]);
      return acc;
    }
    acc[acc.length - 1].push(curr);
    return acc;
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? postRows.length + 1 : postRows.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  useEffect(() => {
    function handleResize() {
      rowVirtualizer.measure();
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

      if (!lastItem) {
        return;
      }

      if (
        lastItem.index >= postRows.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      )
        fetchNextPage();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hasNextPage,
      fetchNextPage,
      postRows?.length,
      isFetchingNextPage,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(rowVirtualizer.getVirtualItems()),
    ],
  );

  return (
    <div className="h-full px-6 flex flex-col">
      <div>
        <div className="m-auto md:max-w-xl py-4 h-16">
          {selectMode ? (
            <>
              {fetcher.state !== "idle" ? (
                "Loading..."
              ) : (
                <div className="flex items-center">
                  <div className="flex-1 font-bold text-lg">
                    <>
                      Delete {Object.values(selectedOrderKeys).length}{" "}
                      {Object.values(selectedOrderKeys).length === 1
                        ? "photo"
                        : "photos"}
                    </>
                  </div>

                  <div className="space-x-2">
                    <Button
                      onClick={() => {
                        const formData = new FormData();
                        const keysToDelete = Object.keys(selectedOrderKeys);
                        keysToDelete.forEach((key) =>
                          formData.append("orderKey", key),
                        );
                        // Optimistic delete: remove posts from UI immediately
                        deletedKeysRef.current = new Set(keysToDelete);
                        setPosts((prev) =>
                          prev.filter(
                            (p) => selectedOrderKeys[p.orderKey] === undefined,
                          ),
                        );
                        setSelectedOrderKeys({});
                        setSelectMode(false);
                        fetcher.submit(formData, { method: "POST" });
                      }}
                      variant="primary"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectMode(false);
                        setSelectedOrderKeys({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-end items-center">
              <Button onClick={() => setSelectMode(true)} variant="link">
                Select
              </Button>
              <Button onClick={signOut} variant="link">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
      <div ref={parent} className="overflow-auto">
        <div
          className="flex justify-center pt-2 w-full flex-grow relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {postRows.length > 0 &&
            rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = postRows[virtualItem.index];
              if (row === undefined) return <Fragment key={virtualItem.key} />;

              const isLoaderRow = virtualItem.index > postRows.length - 1;
              if (isLoaderRow) return <>Loading more...</>;

              return (
                <div
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                  className="absolute top-0 space-x-3 flex md:max-w-xl w-full h-[150px] md:h-[200px]"
                  key={`${virtualItem.key}`}
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {row.map((post, index) => {
                    return (
                      <div
                        key={`${virtualItem.key}-${index}`}
                        className="w-1/3 h-full"
                      >
                        <Post
                          id={post.id}
                          timestamp={post.timestamp}
                          thumbnail={true}
                          selectable={selectMode}
                          handleClick={() => {
                            if (
                              selectedOrderKeys[post.orderKey] !== undefined
                            ) {
                              const cloneSelectedIds = { ...selectedOrderKeys };
                              delete cloneSelectedIds[post.orderKey];
                              setSelectedOrderKeys(cloneSelectedIds);
                              return;
                            }
                            setSelectedOrderKeys({
                              ...selectedOrderKeys,
                              [post.orderKey]: post,
                            });
                          }}
                          selected={
                            selectedOrderKeys[post.orderKey] !== undefined
                          }
                        >
                          <Image post={post} thumbnail={true} />
                        </Post>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
