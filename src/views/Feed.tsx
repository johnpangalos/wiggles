import React, { useEffect, useRef, MutableRefObject } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import * as firebase from 'firebase/app';

import { posts, images, Image, Post } from '../reducers';

export const FeedRoute = () => {
  const match = useRouteMatch('/');
  if (!match.isExact) return <div />;
  return <Feed />;
};

const useInfiniteScroll = (callback: Function): MutableRefObject<any> => {
  const list = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const current: HTMLElement = list.current;
      const { offsetHeight, scrollTop, scrollHeight } = current;
      if (offsetHeight + scrollTop !== scrollHeight) return;
      callback();
    };

    const current: HTMLElement = list.current;
    current.addEventListener('scroll', handleScroll);
    return () => current.removeEventListener('scroll', handleScroll);
  }, [callback]);

  return list;
};

const Feed = () => {
  const dispatch = useDispatch();

  const { start, data } = useSelector(state => state.posts);
  const loading = useSelector(
    state => state.posts.loading || state.images.loading
  );

  const loadNext = (): void => {
    const next = Math.min(
      ...Object.values(data).map((item: any) => Number(item.timestamp))
    );
    dispatch(posts.actions.next(String(next)));
  };

  const list = useInfiniteScroll(loadNext);

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
        <div ref={list} className="h-full overflow-y-auto">
          <Posts />
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
    <div>
      {Object.values(postData).map((post: Post) => (
        <React.Fragment key={post.id}>
          {images[post.refId] && <ImageComponent image={images[post.refId]} />}
        </React.Fragment>
      ))}
    </div>
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
