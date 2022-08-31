import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Post } from "@/types";
import { useAuth } from ".";
import { User } from "firebase/auth";

type ImageSize = "web" | "thumbnail";

type GetPostsOptions = {
  imageSize: ImageSize;
  pageParam?: string;
  queryLimit: number;
  scopeMyUser: boolean;
  user: User | null | undefined;
};

type UseInfinitePostsOptions = {
  imageSize: ImageSize;
  queryLimit?: number;
  scopeMyUser?: boolean;
};

async function getPosts({
  imageSize,
  pageParam,
  queryLimit,
  scopeMyUser,
  user,
}: GetPostsOptions): Promise<Post[]> {
  const db = getFirestore();
  let q;

  if (user === null || user === undefined) return [];
  if (scopeMyUser && pageParam === undefined) {
    q = query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(queryLimit)
    );
  } else if (scopeMyUser) {
    q = query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      startAfter(pageParam),
      limit(queryLimit)
    );
  } else if (pageParam === undefined) {
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(queryLimit)
    );
  } else {
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      startAfter(pageParam),
      limit(queryLimit)
    );
  }

  const docs = await getDocs(q);

  const posts = docs.docs.map((doc) => doc.data() as Post);

  const urlPromises = [];
  for (const post of posts) {
    const storage = getStorage();
    if (post.media[imageSize] === null) continue;
    const storageRef = ref(storage, post.media[imageSize]);
    urlPromises.push(getDownloadURL(storageRef));
  }
  const urls = await Promise.all(urlPromises);
  urls.forEach((url, index) => (posts[index].media[`${imageSize}Url`] = url));
  return posts;
}

export function infinitePostsQueryKey({
  imageSize,
  queryLimit = 10,
  scopeMyUser = false,
}: UseInfinitePostsOptions) {
  return ["posts", "infinite", queryLimit, imageSize, scopeMyUser];
}
export function useInfinitePosts({
  imageSize,
  queryLimit = 10,
  scopeMyUser = false,
}: UseInfinitePostsOptions) {
  const { user } = useAuth();
  return useInfiniteQuery(
    infinitePostsQueryKey({ imageSize, queryLimit, scopeMyUser }),
    ({ pageParam }) =>
      getPosts({ imageSize, pageParam, queryLimit, scopeMyUser, user }),
    {
      getNextPageParam: (lastPage: Post[]) =>
        lastPage[lastPage.length - 1]?.timestamp,
      enabled: !!user?.uid,
    }
  );
}
