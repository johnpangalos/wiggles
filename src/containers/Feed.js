import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Button } from '~/components';
import { addPosts, addImages, addQuotes } from '~/actions';
import { PostWrapper } from './PostWrapper';

const firestoreToObject = ({ docs }) => {
  const obj = {};
  docs.forEach(doc => {
    obj[doc.data().id] = doc.data();
  });
  return obj;
};

export const Feed = () => {
  const mapState = useCallback(
    state => ({
      posts: Object.values(state.posts).sort(
        (a, b) => (a.timestamp - b.timestamp) * -1
      ),
      images: state.images,
      quotes: state.quotes
    }),
    []
  );
  const dispatch = useDispatch();
  const { posts } = useMappedState(mapState);

  useEffect(() => {
    let didCancel = false;

    const fetchPosts = async () => {
      const collections = ['posts', 'quotes', 'images'];
      const [posts, quotes, images] = await Promise.all(
        collections.map(name => window.db.collection(name).get())
      );
      if (!didCancel) {
        dispatch(addPosts(firestoreToObject(posts)));
        dispatch(addImages(firestoreToObject(images)));
        dispatch(addQuotes(firestoreToObject(quotes)));
      }
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
          Refresh
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
