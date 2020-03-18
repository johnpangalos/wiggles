import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase/app';

import { useInfiniteScroll } from '~/lib';
import { posts, images, Image, Post } from '~/reducers';

export const FeedRoute = () => {
  const match = useRouteMatch('/');
  if (!match.isExact) return <div />;
  return <Feed />;
};

const usePromise = promise => {
  const [res, setRes] = useState();
  useEffect(() => {
    if (res) return;
    const temp = async () => {
      const response = await promise();
      setRes(response);
    };
    temp();
  }, [promise, res]);
  return res;
};

const getDocs = res => res.docs.map(doc => doc.data());

const Feed = () => {
  const db = firebase.firestore();
  const posts = usePromise(() =>
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get()
      .then(getDocs)
  );
  const images = usePromise(async () => {
    if (!posts) return;
    return await db
      .collection('images')
      .where(
        'id',
        'in',
        posts.map(item => item.refId)
      )
      .get()
      .then(getDocs);
  });
  console.log(posts, images);
  // const [values, loading, error] = useCollectionDataOnce<Post>( db
  // .collection('posts')
  // .orderBy('timestamp', 'desc')
  // .limit(10)
  // );

  // const [imgValues, imgLoading, imgError] = useCollectionDataOnce<Image>(
  // db
  // .collection('images')
  // .where('id', 'in', values ? values.map(item => item.id) : [''])
  // );
  // console.log(values && values.map(item => item.id), imgValues);

  // const dispatch = useDispatch();

  // const { start, data } = useSelector(state => state.posts);
  // const loading = useSelector(
  // state => state.posts.loading || state.images.loading
  // );

  // const loadNext = (): void => {
  // const next = Math.min(
  // ...Object.values(data).map((item: any) => Number(item.timestamp))
  // );
  // dispatch(posts.actions.next(String(next)));
  // };

  // const list = useInfiniteScroll(loadNext);

  // useEffect(() => {
  // dispatch(posts.actions.fetchPosts());
  // }, [dispatch, start]);

  // useEffect(() => {
  // dispatch(images.actions.fetchImages());
  // }, [dispatch, data]);

  // const error = null;

  return <>Temp</>;
};

// {error && <strong>Error: {JSON.stringify(error)}</strong>}
// {!error && (
// <div
// ref={list}
// className="h-full overflow-y-auto flex flex-col items-center"
// >
// <Posts />
// </div>
// )}
// {loading && <span>Loading...</span>}

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

type ImageProps = {
  image: Image;
};

const ImageComponent = (props: ImageProps) => {
  const [value, loading, error] = useDownloadURL(
    firebase.storage().ref(props.image.web)
  );

  return (
    <div className="h-500 w-500 bg-gray-400">
      {error && <strong>Error: {error}</strong>}
      {loading && <span>Loading...</span>}
      {!loading && value && (
        <img className="h-500 w-full object-contain" alt={value} src={value} />
      )}
    </div>
  );
};
