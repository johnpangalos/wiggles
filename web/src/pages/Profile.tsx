import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { NewPost } from "@/types";
import { Button, Image, Modal, Post } from "@/components";
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
  const [showConfirm, setShowConfirm] = useState(false);
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
  usePendingPoll(posts, setPosts);

  const rowCount = Math.ceil(posts.length / 3);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rowCount + 1 : rowCount,
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

      if (lastItem.index >= rowCount - 1 && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hasNextPage,
      fetchNextPage,
      rowCount,
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
                      onClick={() => setShowConfirm(true)}
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
                  <Modal
                    open={showConfirm}
                    onClose={() => setShowConfirm(false)}
                  >
                    <p className="text-sm mb-3">
                      Delete{" "}
                      {Object.values(selectedOrderKeys).length === 1
                        ? "this photo"
                        : `these ${Object.values(selectedOrderKeys).length} photos`}
                      ? This cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowConfirm(false);
                          const formData = new FormData();
                          const keysToDelete = Object.keys(selectedOrderKeys);
                          keysToDelete.forEach((key) =>
                            formData.append("orderKey", key),
                          );
                          // Optimistic delete: remove posts from UI immediately
                          deletedKeysRef.current = new Set(keysToDelete);
                          setPosts((prev) =>
                            prev.filter(
                              (p) =>
                                selectedOrderKeys[p.orderKey] === undefined,
                            ),
                          );
                          setSelectedOrderKeys({});
                          setSelectMode(false);
                          fetcher.submit(formData, { method: "POST" });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Modal>
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
          {rowCount > 0 &&
            rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const rowPosts = posts.slice(
                virtualItem.index * 3,
                virtualItem.index * 3 + 3,
              );
              if (rowPosts.length === 0)
                return <Fragment key={virtualItem.key} />;

              return (
                <div
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                  className="absolute top-0 grid grid-cols-3 gap-x-3 md:max-w-xl w-full h-[150px] md:h-[200px]"
                  key={`${virtualItem.key}`}
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {rowPosts.map((post, index) => {
                    return (
                      <div
                        key={`${virtualItem.key}-${index}`}
                        className="h-full"
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
