import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

import { Account } from "@/types";

import {
  getAuth,
  onIdTokenChanged,
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

async function getAccount(email: string | null | undefined) {
  const db = getFirestore();
  const q = query(collection(db, "accounts"), where("email", "==", email));
  const { docs } = await getDocs(q);

  return docs[0].data() as Account;
}

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const { data: account } = useQuery(
    ["account", user?.email],
    () => getAccount(user?.email),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, (res) => {
      setUser(res);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOutLocal = () => {
    const auth = getAuth();
    signOut(auth);
    setUser(null);
  };

  function signIn() {
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  }

  return { user, loading, signOut: signOutLocal, signIn, account };
}

export * from "./useInfinitePosts";
export { useAccount } from "./useAccount";
export * from "./useBreakpoint";
