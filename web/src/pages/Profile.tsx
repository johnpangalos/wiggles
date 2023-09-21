import React, { useCallback, useEffect, useState } from "react";
import { NewPost } from "@/types";
import { Button, Post } from "@/components";
import {
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { getPosts } from "@/hooks";
import { usePostsLoadedState } from "@/stores";
import { useInView } from "react-intersection-observer";

export async function profileLoader(args: LoaderFunctionArgs) {
  const url = new URL(args.request.url);
  const pageParam = url.searchParams.get("pageParam");
  if (pageParam === null)
    return await getPosts({ imageSize: "WRThumbnail", limit: 50 });
  return await getPosts({ imageSize: "WRThumbnail", limit: 50, pageParam });
}

const deleteImages = async (orderKeys: string[]) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/bulk-delete`, {
    method: "POST",
    body: JSON.stringify(orderKeys),
  });
  if (res.status > 300) throw new Error("delete failed");
  return await res.json();
};

// const queryKeyConfig = (email?: string): UseInfinitePostsOptions => ({
//   imageSize: "WRThumbnail",
//   limit: 30,
//   email,
//   enabled: !!email,
// });

export const generateLogoutURL = ({ domain }: { domain: string }) =>
  new URL(`/cdn-cgi/access/logout`, domain).toString();

const url = generateLogoutURL({
  domain: "https://johnpangalos.cloudflareaccess.com",
});

export function Profile() {
  const postsLoaded = usePostsLoadedState(
    (state) => Object.keys(state.postsLoaded).length
  );
  const data = useLoaderData() as { posts: NewPost[]; cursor: string };
  const fetcher = useFetcher<{ posts: NewPost[]; cursor: string }>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [posts, setPosts] = useState<NewPost[]>(data.posts);

  useEffect(() => {
    fetcher.data ? setCursor(fetcher.data.cursor) : setCursor(data.cursor);
  }, [data.cursor, fetcher.data]);

  const callback = useCallback(
    function (inView: boolean) {
      if (inView === false) return;
      fetcher.load(`?pageParam=${cursor}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor]
  );

  const [ref] = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 1,
    onChange: callback,
  });

  useEffect(() => {
    if (fetcher.data === undefined) return;
    setPosts([...posts, ...fetcher.data.posts]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);
  // const { data: profileData } = useQuery(["me"], () =>
  //   fetch(`${import.meta.env.VITE_API_URL}/me`).then((res) => res.json())
  // );
  const [selectMode, setSelectMode] = useState(false);
  const [selectedOrderKeys, setSelectedOrderKeys] = useState<
    Record<string, NewPost>
  >({});
  const signOut = () => {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.replace(url);
  };

  return (
    <div className="h-full px-6 flex flex-col">
      <div>
        <div className="m-auto md:max-w-xl py-4 h-16">
          {selectMode ? (
            <>
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
                  <Button onClick={() => {}} variant="primary">
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
      <div className="grid grid-cols-3 md:grid-cols-5 max-w-4xl mx-auto gap-3">
        {posts.slice(0, -50).map((post) => {
          return <Post key={post.id} post={post} thumbnail={true} />;
        })}
        {posts.slice(-50).map((post) => {
          return (
            <div
              key={post.id}
              className={postsLoaded === posts.length ? "" : "hidden"}
            >
              <Post post={post} thumbnail={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
