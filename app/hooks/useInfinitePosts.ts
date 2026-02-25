import { useInfiniteQuery } from "@tanstack/react-query";

import type { NewPost } from "~/types";

type PostsPage = { posts: NewPost[]; cursor?: string };

export type UseInfinitePostsOptions = {
  limit?: number;
  email?: string;
  enabled?: boolean;
  initialData?: {
    pages: PostsPage[];
    pageParams: (string | undefined)[];
  };
};

type GetPostsOptions = {
  pageParam?: string;
  limit?: number;
  email?: string;
};

async function getPosts({
  pageParam,
  limit,
  email,
}: GetPostsOptions): Promise<PostsPage> {
  return await fetch(
    `/api/posts?limit=${limit}${
      pageParam ? `&cursor=${pageParam}` : ""
    }${email ? `&email=${email}` : ""}`,
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
  initialData,
}: UseInfinitePostsOptions) {
  return useInfiniteQuery({
    queryKey: infinitePostsQueryKey({ limit, email }),
    queryFn: ({ pageParam }) => getPosts({ pageParam, limit, email }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PostsPage) => lastPage.cursor || undefined,
    enabled,
    initialData,
  });
}
