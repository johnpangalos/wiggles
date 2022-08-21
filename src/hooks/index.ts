import { useState, useEffect } from "react";
import { useDispatch } from "redux-react-hook";

import {
  getAuth,
  onIdTokenChanged,
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const distpatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, (res) => {
      setUser(res);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [distpatch]);

  const signOutLocal = () => {
    const auth = getAuth();
    signOut(auth);
    setUser(null);
  };

  function signIn() {
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  }

  return { user, loading, signOut: signOutLocal, signIn };
}
