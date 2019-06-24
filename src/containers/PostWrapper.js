import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { addAccount } from '~/actions';
import { Post } from '~/components';
import { QuoteWrapper } from './QuoteWrapper';
import { ImageWrapper } from './ImageWrapper';

export const PostWrapper = ({ post }) => {
  const mapState = useCallback(
    state => ({
      account: state.accounts[post.userId]
    }),
    []
  );

  const dispatch = useDispatch();

  const { account } = useMappedState(mapState);

  useEffect(() => {
    if (account) return;
    let didCancel = false;

    const fetchAccount = async () => {
      const account = await window.db
        .collection('accounts')
        .doc(post.userId)
        .get();
      if (!didCancel) dispatch(addAccount(account.data()));
    };

    fetchAccount();
    return () => {
      didCancel = true;
    };
  }, [post.userId]);

  return (
    !!account && (
      <div className="pb-4">
        <Post size="500" account={account} timestamp={post.timestamp}>
          {post.type === 'image' && <ImageWrapper id={post.refId} />}
          {post.type === 'quote' && <QuoteWrapper id={post.refId} />}
        </Post>
      </div>
    )
  );
};
