import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import * as firebase from 'firebase/app';

import { posts, images, Image, Post } from '../reducers';
import { Button } from '../lib';

export const FeedRoute = () => {
  const match = useRouteMatch('/');
  if (!match.isExact) return <div />;
  return <Feed />;
};

const Feed = () => {
  const dispatch = useDispatch();

  const { start, data } = useSelector(state => state.posts);
  const loading = useSelector(
    state => state.posts.loading || state.images.loading
  );
  useEffect(() => {
    dispatch(posts.actions.fetchPosts());
  }, [dispatch, start]);

  useEffect(() => {
    dispatch(images.actions.fetchImages());
  }, [dispatch, data]);

  const error = null;

  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {!error && (
        <div className="h-full">
          <Posts />
          {!loading && <LoadNext />}
        </div>
      )}
      {loading && <span>Loading...</span>}
    </>
  );
};

const Posts = () => {
  const { postData, images } = useSelector(state => ({
    postData: state.posts.data,
    images: state.images.data
  }));

  return (
    <>
      {Object.values(postData).map((post: Post) => (
        <React.Fragment key={post.id}>
          {images[post.refId] && <ImageComponent image={images[post.refId]} />}
        </React.Fragment>
      ))}
    </>
  );
};

const LoadNext = () => {
  const postData = useSelector(state => state.posts.data);
  const dispatch = useDispatch();
  const next = Math.min(
    ...Object.values(postData).map((item: any) => Number(item.timestamp))
  );
  return (
    <Button
      onClick={(): null => {
        dispatch(posts.actions.next(String(next)));
        return;
      }}
    >
      Next
    </Button>
  );
};

type ImageProps = {
  image: Image;
};

const ImageComponent = (props: ImageProps) => {
  const [value, loading, error] = useDownloadURL(
    firebase.storage().ref(props.image.web)
  );

  return (
    <div className="h-64 w-64 bg-gray-400">
      {error && <strong>Error: {error}</strong>}
      {loading && <span>Loading...</span>}
      {!loading && value && (
        <img className="h-64 w-full object-contain" alt={value} src={value} />
      )}
    </div>
  );
};
