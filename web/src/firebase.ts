import type { Post } from "@/types";
import { getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  limit,
  orderBy,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

type TFetchPostParams = {
  pageParam?: QueryDocumentSnapshot<Post>;
};

type TFetchPostResult = Promise<QueryDocumentSnapshot<Post>[]>;

export async function fetchPosts({
  pageParam,
}: TFetchPostParams): TFetchPostResult {
  const firebaseApp = getApp();
  const db = getFirestore(firebaseApp);

  let q = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  if (pageParam !== undefined)
    q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      startAfter(pageParam),
      limit(10)
    );

  const snapshot = await getDocs<Post>(q);
  return snapshot.docs;
}
