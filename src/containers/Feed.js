import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Button } from '~/components';
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
  }, [dispatch]);

  return (
    <div className="h-full w-full">
      <div className="w-full flex p-2">
        <div className="flex-grow" />
        <Button
          dark
          className=""
          color="primary"
          onClick={e => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          Refesh
        </Button>
      </div>

      <div className="px-8 pt-2 pb-6 max-w-500 m-auto">
        {posts &&
          posts.length > 0 &&
          posts.map((post, index) => <PostWrapper key={post.id} post={post} />)}
      </div>
    </div>
  );
};
