import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLoaderData, useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { NewPost } from "@/types";
import { Button, Image, Post } from "@/components";
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

  // After the action completes, React Router revalidates the loader automatically.
  // Sync the fresh loader data into local state and reset selection.
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setPosts(initialData.posts);
      setCursor(initialData.cursor);
      setSelectedOrderKeys({});
      setSelectMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

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
    <div className="h-full flex flex-col">
      <div>
        <div className="m-auto py-4 h-16">
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
                        Object.keys(selectedOrderKeys).forEach((key) =>
                          formData.append("orderKey", key),
                        );
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
          className="pt-2 w-full flex-grow relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowCount > 0 &&
            rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const isLoaderRow = virtualItem.index > rowCount - 1;
              if (isLoaderRow)
                return (
                  <Fragment key={virtualItem.key}>Loading more...</Fragment>
                );

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
                  className="absolute top-0 w-full grid grid-cols-3 gap-3"
                  key={`${virtualItem.key}`}
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {rowPosts.map((post, index) => {
                    return (
                      <div
                        key={`${virtualItem.key}-${index}`}
                        className="aspect-square"
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
