import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { addPosts } from '~/actions';
import { PostWrapper } from './PostWrapper';

export const Feed = () => {
  const mapState = useCallback(
    state => ({
      posts: Object.values(state.posts).sort(
        (a, b) => (a.timestamp - b.timestamp) * -1
      )
    }),
    []
  );
  const dispatch = useDispatch();
  const { posts } = useMappedState(mapState);

  useEffect(() => {
    let didCancel = false;

    const fetchPosts = async () => {
      const posts = await window.db.collection('posts').get();
      if (!didCancel)
        dispatch(
          addPosts(
            posts.docs.reduce(
              (acc, curr) => ({ ...acc, [curr.data().id]: curr.data() }),
              {}
            )
          )
        );
    };

    fetchPosts();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div className="px-8 py-6 max-w-500 m-auto">
        {posts &&
          posts.length > 0 &&
          posts.map((post, index) => <PostWrapper key={post.id} post={post} />)}
      </div>
    </div>
  );
};
