import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { posts } from '../reducers';
import { Button } from '../lib';

export const FeedRoute = () => {
  const match = useRouteMatch('/');
  if (!match.isExact) return <div />;
  return <Feed />;
};

const Feed = () => {
  const dispatch = useDispatch();

  const { start, loading } = useSelector(state => state.posts);
  useEffect(() => {
    dispatch(posts.actions.fetchPosts());
  }, [dispatch, start]);

  const error = null;
  return (
    <div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {!loading && !error && <Posts />}
    </div>
  );
};

const Posts = () => {
  const data = useSelector(state => state.posts.data);
  const dispatch = useDispatch();
  const next = Math.min(
    ...Object.values(data).map((item: any) => Number(item.timestamp))
  );
  return (
    <>
      <div>Some Posts</div>
      {Object.keys(data).map(id => (
        <div key={id}>{id}</div>
      ))}
      <Button
        onClick={(): null => {
          dispatch(posts.actions.next(next));
          return;
        }}
      >
        Next
      </Button>
    </>
  );
};
