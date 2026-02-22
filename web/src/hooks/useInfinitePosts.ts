import { useInfiniteQuery } from "@tanstack/react-query";

import { NewPost } from "@/types";
import { getAuthHeaders } from "@/utils";

export type UseInfinitePostsOptions = {
  limit?: number;
  email?: string;
  enabled?: boolean;
};

type GetPostsOptions = {
  pageParam?: string;
} & UseInfinitePostsOptions;

async function getPosts({
  pageParam,
  limit,
  email,
}: GetPostsOptions): Promise<{ posts: NewPost[]; cursor: string }> {
  const headers = await getAuthHeaders();
  return await fetch(
    `${import.meta.env.VITE_API_URL}/posts?limit=${limit}${
      pageParam ? `&cursor=${pageParam}` : ""
    }${email ? `&email=${email}` : ""}`,
    { headers },
  ).then((res) => res.json());
}

export function infinitePostsQueryKey({
  limit = 10,
  email,
}: UseInfinitePostsOptions) {
  return ["posts", "infinite", limit, email];
}
export function useInfinitePosts({
  limit = 10,
  email,
  enabled,
}: UseInfinitePostsOptions) {
  return useInfiniteQuery({
    queryKey: infinitePostsQueryKey({ limit, email }),
    queryFn: ({ pageParam }) => getPosts({ pageParam, limit, email }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { posts: NewPost[]; cursor: string }) =>
      lastPage.cursor || undefined,
    enabled,
  });
}
