import React, { useReducer, useEffect } from 'react';
import { Post, Image } from '~/components';

const constants = {
  ADD_POSTS: 'add-posts',
  ADD_QUOTES: 'add-quotes',
  ADD_IMAGES: 'add-images',
  ADD_ACCOUNT: 'add-account'
};
const initialState = {
  images: {},
  accounts: {},
  posts: {},
  quotes: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case constants.ADD_POSTS: {
      return { ...state, posts: { ...action.payload } };
    }
    case constants.ADD_QUOTES: {
      return {
        ...state,
        quotes: { ...state.quotes, [action.payload.id]: action.payload }
      };
    }
    case constants.ADD_IMAGES: {
      return {
        ...state,
        images: { ...state.images, [action.payload.id]: action.payload }
      };
    }
    case constants.ADD_ACCOUNT: {
      return {
        ...state,
        accounts: { ...state.accounts, [action.payload.id]: action.payload }
      };
    }
    default: {
      return state;
    }
  }
};

export const Feed = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const callback = snapshot =>
    dispatch({ type: constants.ADD_POSTS, payload: snapshot.val() });

  useEffect(() => {
    const postsRef = window.firebase.database().ref('posts/');
    postsRef.on('value', callback);

    return () => {
      postsRef.off('value', callback);
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div className="px-8 py-6 max-w-500 m-auto">
        {Object.keys(state.posts).length > 0 &&
          Object.values(state.posts)
            .sort((a, b) => (a.timestamp - b.timestamp) * -1)
            .map((post, index) => (
              <PostWrapper
                state={state}
                dispatch={dispatch}
                key={post.id}
                post={post}
              />
            ))}
      </div>
    </div>
  );
};
const PostWrapper = ({ post, dispatch, state }) => {
  const callback = snap =>
    dispatch({ type: constants.ADD_ACCOUNT, payload: snap.val() });

  useEffect(() => {
    if (state.accounts[post.userId]) return;
    const accountRef = window.firebase
      .database()
      .ref(`accounts/${post.userId}`);
    accountRef.on('value', callback);
    return () => {
      accountRef.off('value', callback);
    };
  }, [post.refId]);

  return (
    !!state.accounts[post.userId] && (
      <div className="pb-4">
        <Post size="500" account={state.accounts[post.userId]}>
          {post.type === 'image' && (
            <ImageWrapper state={state} dispatch={dispatch} id={post.refId} />
          )}
          {post.type === 'quote' && (
            <QuoteWrapper state={state} dispatch={dispatch} id={post.refId} />
          )}
        </Post>
      </div>
    )
  );
};

const QuoteWrapper = ({ state, dispatch, id }) => {
  const callback = snap => {
    const val = snap.val();
    if (!val) return;
    dispatch({ type: constants.ADD_QUOTES, payload: val });
  };

  useEffect(() => {
    if (state.quotes[id]) return;
    const quoteRef = window.firebase.database().ref(`quotes/${id}`);
    quoteRef.on('value', callback);
    return () => {
      quoteRef.off('value', callback);
    };
  }, [id]);

  return (
    !!state.quotes[id] && (
      <div className="flex items-center justify-center hypens p-2 text-3xl h-full w-full overflow-y-auto">
        {state.quotes[id].text}
      </div>
    )
  );
};

const ImageWrapper = ({ state, dispatch, id }) => {
  const callback = snap => {
    const val = snap.val();
    if (!val) return;
    dispatch({ type: constants.ADD_IMAGES, payload: val });
  };

  useEffect(() => {
    if (state.images[id]) return;
    const imageRef = window.firebase.database().ref(`images/${id}`);
    imageRef.on('value', callback);

    return () => {
      imageRef.off('value', callback);
    };
  }, []);

  return !!state.images[id] && <Image url={state.images[id].web} />;
};
