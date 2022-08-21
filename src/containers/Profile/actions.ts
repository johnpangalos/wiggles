import { useAuth } from "@/hooks";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

export const useAccountData = async () => {
  const { user } = useAuth();
  const db = getFirestore();
  if (user?.uid === undefined) return;
  const docRef = doc(db, "accounts", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const imageByUserSub = async (
  id: string,
  callback: (params: any) => void
) => {
  const db = getFirestore();
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", id));

  const querySnapshot = await getDocs(q);
  callback(
    querySnapshot.docs.reduce(
      (acc: any, curr: any) => ({ ...acc, [curr.data().id]: curr.data() }),
      {}
    )
  );
};

const deleteImage = (id: string) => {
  const db = getFirestore();
  return deleteDoc(doc(db, "posts", id));
};

export const deleteImages = (ids: string[]) =>
  Promise.all(ids.map((id) => deleteImage(id)));
