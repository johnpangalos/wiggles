// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useQuery } from "@tanstack/react-query";
//
// import { Account, Post } from "@/types";
//
// async function getAccount(post: Post) {
//   const db = getFirestore();
//   const docRef = doc(db, "accounts", post.userId);
//   const docSnap = await getDoc(docRef);
//
//   return docSnap.data() as Account;
// }
//
// export function useAccount(post: Post) {
//   return useQuery(["account", post.userId], () => getAccount(post), {
//     staleTime: 5 * 60 * 1000,
//   });
// }
