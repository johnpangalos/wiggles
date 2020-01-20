import React, { useEffect, useCallback, memo } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Button } from '~/components';
import { addPosts, addImages, addQuotes } from '~/actions';
import { PostWrapper } from './PostWrapper';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const firestoreToObject = ({ docs }) => {
  const obj = {};
  docs.forEach(doc => {
    obj[doc.data().id] = doc.data();
  });
  return obj;
};

const ListItem = memo(({ data, index, style }) => {
  const post = data[index];
  return (
    <div style={style}>
      <PostWrapper key={post.id} post={post} />
    </div>
  );
});

const convertRemToPixels = rem => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
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
    <div className="h-full w-full flex flex-col">
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

      <div className="pt-2 w-full flex-grow">
        {posts && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                itemData={posts}
                height={height}
                width={width}
                itemCount={posts.length}
                itemSize={() => {
                  if (window.screen.width > 500) return 530;
                  if (window.screen.width > 383 && window.screen.width <= 500)
                    return window.screen.width + convertRemToPixels(1);
                  if (window.screen.width > 340 && window.screen.width <= 383)
                    return window.screen.width + convertRemToPixels(2.5);
                  return window.screen.width + convertRemToPixels(1.5);
                }}
                overscanCount={3}
              >
                {ListItem}
              </List>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};
