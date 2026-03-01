import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLoaderData, useFetcher, useRouteError } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { NewPost } from "@/types";
import { Button, Image, Modal, Post } from "@/components";
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

export function loader(): ProfilePostsResponse {
  // Auth tokens are client-side only; return empty on server.
  return { posts: [], cursor: undefined };
}

export async function clientLoader(): Promise<ProfilePostsResponse> {
  const email = getUserEmail();
  if (!email) return { posts: [], cursor: undefined };
  return await fetchProfilePosts(email);
}

clientLoader.hydrate = true as const;

export async function clientAction({
  request,
}: {
  request: Request;
}): Promise<unknown> {
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

export default function Profile() {
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
                          Object.keys(selectedOrderKeys).forEach((key) =>
                            formData.append("orderKey", key),
                          );
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

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <h1 className="text-xl font-bold text-red-600 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-800 mb-4">{error?.message ?? String(error)}</p>
      {error?.stack && (
        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
}
