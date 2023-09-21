import { useCallback, useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { Post } from "@/components";
import { getPosts } from "@/hooks";
import { NewPost } from "@/types";
import { usePostsLoadedState } from "@/stores";

export async function loader(args: LoaderFunctionArgs) {
  const url = new URL(args.request.url);
  const pageParam = url.searchParams.get("pageParam");
  if (pageParam === null)
    return await getPosts({ imageSize: "WRPost", limit: 10 });
  return await getPosts({ imageSize: "WRPost", limit: 10, pageParam });
}

export const Feed = () => {
  const postsLoaded = usePostsLoadedState(
    (state) => Object.keys(state.postsLoaded).length
  );
  const postsList = usePostsLoadedState((state) => state.postsLoaded);
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

  return (
    <div className="pb-10">
      {posts.slice(0, -10).map((post) => {
        return <Post key={post.id} post={post} />;
      })}
      {posts.slice(-10).map((post) => {
        return (
          <div key={post.id} className={postsList[post.id] ? "" : "hidden"}>
            <Post post={post} />;
          </div>
        );
      })}
      {postsLoaded === posts.length && <div ref={ref} />}
      {postsLoaded !== posts.length && (
        <div className="text-center">Loading...</div>
      )}
    </div>
  );
};
