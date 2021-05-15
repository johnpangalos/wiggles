import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import type { Post } from "../types";

type GetPostsResponse = {
  data: Post[];
};

export async function getPosts(last?: string): Promise<Post[]> {
  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);
  if (auth.currentUser === null) throw new Error("Please login.");

  const token = await auth.currentUser.getIdToken();
  const res = await fetch(
    `${import.meta.env.VITE_API}/posts?limit=24${last ? `&last=${last}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok)
    throw new Error(`Response Error ${res.status}: ${res.statusText}`);

  const { data } = (await res.json()) as GetPostsResponse;
  return data;
}
