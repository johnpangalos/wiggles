import { useInfiniteQuery } from "@tanstack/react-query";

import { NewPost } from "@/types";

type ImageSize = "WRPost" | "WRThumbnail";

type GetPostsOptions = {
  imageSize: ImageSize;
  pageParam?: string;
  limit: number;
};

type UseInfinitePostsOptions = {
  imageSize: ImageSize;
  limit?: number;
};

async function getPosts({
  imageSize,
  pageParam,
  limit,
}: GetPostsOptions): Promise<{ posts: NewPost[]; cursor: string }> {
  return await fetch(
    `https://dev.wiggle-room.xyz/api/posts?size=${imageSize}&limit=${limit}${
      pageParam ? `&cursor=${pageParam}` : ""
    }`
  ).then((res) => res.json());
}

export function infinitePostsQueryKey({
  imageSize,
  limit = 10,
}: UseInfinitePostsOptions) {
  return ["posts", "infinite", limit, imageSize];
}
export function useInfinitePosts({
  imageSize,
  limit = 10,
}: UseInfinitePostsOptions) {
  return useInfiniteQuery(
    infinitePostsQueryKey({ imageSize, limit }),
    ({ pageParam }) => getPosts({ imageSize, pageParam, limit }),
    {
      getNextPageParam: (lastPage: { posts: NewPost[]; cursor: string }) =>
        lastPage.cursor,
    }
  );
}
