import React, { useEffect, useReducer } from "react";
import { Header, Thumbnails, SelectToolbar } from "./components";
import { initialState, reducer } from "./reducer";
import { imageByUserSub } from "./actions";
import { addPosts, addImages } from "../../actions";
import { useDispatch } from "redux-react-hook";
import { Constants } from "@/constants";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useAuth } from "@/hooks";

const firestoreToObject = ({ docs }: any) => {
  const obj: any = {};
  docs.forEach((doc: any) => {
    obj[doc.data().id as string] = doc.data();
  });
  return obj;
};

export const Profile = () => {
  const { user, signOut } = useAuth();
  const [{ loading, posts, selected, selectMode }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const dispatch2 = useDispatch();

  const handleClick = (id: string) => {
    if (!selectMode) return;
    if (!selected[id])
      // @ts-ignore
      return dispatch({ type: Constants.ADD_SELECTED, payload: id });
    // @ts-ignore
    return dispatch({ type: Constants.REMOVE_SELECTED, payload: id });
  };

  useEffect(() => {
    let didCancel = false;

    const fetchPosts = async () => {
      const collections = ["posts", "images"];
      const db = getFirestore();
      const [posts, images] = await Promise.all(
        collections.map((name) => getDocs(collection(db, name)))
      );
      if (!didCancel) {
        dispatch2(addPosts(firestoreToObject(posts)));
        dispatch2(addImages(firestoreToObject(images)));
      }
    };

    fetchPosts();
    return () => {
      didCancel = true;
    };
  }, [dispatch2]);

  useEffect(() => {
    if (!user?.uid) return;
    imageByUserSub(user.uid, (images) => {
      if (!images) return;
      // @ts-ignore
      dispatch({ type: Constants.ADD_POSTS, payload: images });
      // @ts-ignore
      dispatch({ type: Constants.NOT_LOADING });
    });

    return () => {};
  }, [user?.uid]);

  return (
    <div className="flex flex-col items-center h-full max-w-lg m-auto">
      <SelectToolbar
        selectMode={selectMode}
        selected={selected}
        // @ts-ignore
        dispatch={dispatch}
      />
      <div className="flex flex-grow flex-col h-full w-full p-4">
        <Header signOut={signOut} />
        <Thumbnails
          selectMode={selectMode}
          loading={loading}
          posts={posts}
          selected={selected}
          handleClick={handleClick}
          // @ts-ignore
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};
