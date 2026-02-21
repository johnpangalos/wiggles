import { useInfiniteQuery } from "@tanstack/react-query";

import { NewPost } from "@/types";
import { getAuthHeaders } from "@/utils";

export type ImageSize = "WRPost" | "WRThumbnail";

export type UseInfinitePostsOptions = {
  imageSize: ImageSize;
  limit?: number;
  email?: string;
  enabled?: boolean;
};

type GetPostsOptions = {
  pageParam?: string;
} & UseInfinitePostsOptions;

async function getPosts({
  imageSize,
  pageParam,
  limit,
  email,
}: GetPostsOptions): Promise<{ posts: NewPost[]; cursor: string }> {
  const headers = await getAuthHeaders();
  return await fetch(
    `${import.meta.env.VITE_API_URL}/posts?size=${imageSize}&limit=${limit}${
      pageParam ? `&cursor=${pageParam}` : ""
    }${email ? `&email=${email}` : ""}`,
    { headers }
  ).then((res) => res.json());
}

export function infinitePostsQueryKey({
  imageSize,
  limit = 10,
  email,
}: UseInfinitePostsOptions) {
  return ["posts", "infinite", limit, imageSize, email];
}
export function useInfinitePosts({
  imageSize,
  limit = 10,
  email,
  enabled,
}: UseInfinitePostsOptions) {
  return useInfiniteQuery(
    infinitePostsQueryKey({ imageSize, limit, email }),
    ({ pageParam }) => getPosts({ imageSize, pageParam, limit, email }),
    {
      getNextPageParam: (lastPage: { posts: NewPost[]; cursor: string }) =>
        lastPage.cursor,
      enabled,
    }
  );
}
