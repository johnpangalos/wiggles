import { Post as PostType } from "@/types";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";

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
      const account = await window.db
        .collection("accounts")
        .doc(post.userId)
        .get();
      if (!didCancel && account.data()) dispatch(addAccount(account.data()));
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
