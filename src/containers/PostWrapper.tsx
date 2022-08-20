import { Account, Post as PostType } from "@/types";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { addAccount } from "../actions";
import { Post } from "../components";
import { ImageWrapper } from "./ImageWrapper";

export const PostWrapper = ({ post }: { post: PostType }) => {
  const mapState = useCallback(
    (state) => ({
      account: state.accounts[post.userId],
    }),
    [post]
  );

  const dispatch = useDispatch();

  const { account } = useMappedState(mapState);

  useEffect(() => {
    if (account) return;
    let didCancel = false;

    const fetchAccount = async () => {
      const db = getFirestore();
      const docRef = doc(db, "accounts", post.userId);
      const docSnap = await getDoc(docRef);

      if (didCancel) return;
      const account: Account = docSnap.data() as Account;
      dispatch(addAccount(account));
    };

    fetchAccount();
    return () => {
      didCancel = true;
    };
  }, [account, dispatch, post.userId]);

  if (!account) return <></>;
  return (
    <div className="h-full px-6 pb-4">
      <Post id={post.refId} account={account} timestamp={post.timestamp}>
        {post.type === "image" && <ImageWrapper id={post.refId} />}
      </Post>
    </div>
  );
};
