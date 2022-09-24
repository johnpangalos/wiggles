import { useInfiniteQuery } from "@tanstack/react-query";

import { NewPost } from "@/types";

export type ImageSize = "WRPost" | "WRThumbnail";

export type UseInfinitePostsOptions = {
  imageSize: ImageSize;
  limit?: number;
  myPosts?: boolean;
};

type GetPostsOptions = {
  pageParam?: string;
  myPosts: boolean;
} & UseInfinitePostsOptions;

async function getPosts({
  imageSize,
  pageParam,
  limit,
  myPosts,
}: GetPostsOptions): Promise<{ posts: NewPost[]; cursor: string }> {
  return await fetch(
    `${import.meta.env.VITE_API_URL}/posts?size=${imageSize}&limit=${limit}${
      pageParam ? `&cursor=${pageParam}` : ""
    }${myPosts ? `&myPosts=true` : ""}`
  ).then((res) => res.json());
}

export function infinitePostsQueryKey({
  imageSize,
  limit = 10,
  myPosts = false,
}: UseInfinitePostsOptions) {
  return ["posts", "infinite", limit, imageSize, myPosts];
}
export function useInfinitePosts({
  imageSize,
  limit = 10,
  myPosts = false,
}: UseInfinitePostsOptions) {
  return useInfiniteQuery(
    infinitePostsQueryKey({ imageSize, limit, myPosts }),
    ({ pageParam }) => getPosts({ imageSize, pageParam, limit, myPosts }),
    {
      getNextPageParam: (lastPage: { posts: NewPost[]; cursor: string }) =>
        lastPage.cursor,
    }
  );
}
