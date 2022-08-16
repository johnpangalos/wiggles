import React, { useEffect, useReducer } from "react";
import { Header, Thumbnails, SelectToolbar } from "./components";
import { initialState, reducer, constants } from "./reducer";
import { accountData, imageByUserSub } from "./actions";
import { addPosts, addImages } from "../../actions";
import { useDispatch } from "redux-react-hook";

const firestoreToObject = ({ docs }) => {
  const obj = {};
  docs.forEach((doc) => {
    obj[doc.data().id] = doc.data();
  });
  return obj;
};

export const Profile = ({ signOut, user }) => {
  const [{ account, loading, posts, selected, selectMode }, dispatch] =
    useReducer(reducer, initialState);
  const dispatch2 = useDispatch();

  const handleClick = (id) => {
    if (!selectMode) return;
    if (!selected[id])
      return dispatch({ type: constants.ADD_SELECTED, payload: id });
    return dispatch({ type: constants.REMOVE_SELECTED, payload: id });
  };

  useEffect(() => {
    let didCancel = false;
    dispatch({ type: constants.LOADING });

    const loadAccount = async () => {
      const account = await accountData(user);
      if (!didCancel)
        dispatch({ type: constants.ADD_ACCOUNT, payload: account });
    };

    loadAccount();
    return () => {
      didCancel = true;
    };
  }, [user]);

  useEffect(() => {
    let didCancel = false;

    const fetchPosts = async () => {
      const collections = ["posts", "images"];
      const [posts, images] = await Promise.all(
        collections.map((name) => window.db.collection(name).get())
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
    if (!account.id) return;
    imageByUserSub(account.id, (images) => {
      if (!images) return;
      dispatch({ type: constants.ADD_POSTS, payload: images });
      dispatch({ type: constants.NOT_LOADING });
    });

    return () => {};
  }, [account.id]);

  return (
    <div className="flex flex-col items-center h-full max-w-lg m-auto">
      <SelectToolbar
        selectMode={selectMode}
        selected={selected}
        dispatch={dispatch}
      />
      <div className="flex flex-grow flex-col h-full w-full p-4">
        <Header account={account} signOut={signOut} />
        <Thumbnails
          selectMode={selectMode}
          loading={loading}
          posts={posts}
          selected={selected}
          handleClick={handleClick}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};
