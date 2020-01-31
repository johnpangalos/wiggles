import { createSlice } from '@reduxjs/toolkit';
import * as firebase from 'firebase/app';
import { normalize, schema } from 'normalizr';

const postSchema = new schema.Entity('posts');

const pageSize = 10;

const postSlice = createSlice({
  name: 'posts',
  reducers: {
    add: (state, action) => ({
      ...state,
      data: action.payload.posts
    }),
    loading: (state, action) => ({ ...state, loading: action.payload }),
    error: (state, action) => ({ ...state, error: action.payload }),
    next: (state, action) => ({
      ...state,
      start: action.payload
    })
  },
  initialState: {
    error: null,
    loading: false,
    data: {},
    start: ''
  }
});

const baseQuery = () =>
  firebase
    .firestore()
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .limit(pageSize);

const fetchPosts = () => async (dispatch, getState) => {
  dispatch(postSlice.actions.loading(true));
  const {
    posts: { start }
  } = getState();

  try {
    let query = baseQuery();
    if (start) query = query.startAt(String(start));
    const data = await query.get();

    const postData = data.docs.map(doc => doc.data());
    const normData = normalize(postData, [postSchema]);

    dispatch(postSlice.actions.add(normData.entities));
    dispatch(postSlice.actions.loading(false));
  } catch (err) {
    console.error(err);
    dispatch(postSlice.actions.error('An unexpected error has occured'));
  }
};

export const posts = {
  ...postSlice,
  actions: {
    ...postSlice.actions,
    fetchPosts
  }
};
