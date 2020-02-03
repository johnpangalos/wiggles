import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as firebase from 'firebase/app';
import { normalize, schema } from 'normalizr';

enum PostType {
  Image = 'image',
  Quote = 'quote',
  Video = 'video'
}

export type Post = {
  id: string;
  refId: string;
  timestamp: string;
  type: PostType;
  userId: string;
};

type NormalizedPosts = {
  [id: string]: Post;
};

type PostState = {
  error: string;
  loading: boolean;
  data: NormalizedPosts;
  start: string | null;
  currentImageIds: Array<string>;
};

const initialState: PostState = {
  error: null,
  loading: false,
  data: {},
  start: null,
  currentImageIds: []
};

const postSchema = new schema.Entity('posts');

export const pageSize = 10;

const postSlice = createSlice({
  name: 'posts',
  reducers: {
    add: (state, action: PayloadAction<NormalizedPosts>) => ({
      ...state,
      data: {
        ...state.data,
        ...action.payload
      }
    }),
    setCurrentImageIds: (state, action: PayloadAction<Array<string>>) => ({
      ...state,
      currentImageIds: action.payload
    }),
    loading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload
    }),
    error: (state, action: PayloadAction<string>) => ({
      ...state,
      error: action.payload
    }),
    next: (state, action: PayloadAction<string>) => ({
      ...state,
      start: action.payload
    })
  },
  initialState
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

    dispatch(postSlice.actions.add(normData.entities.posts));
    dispatch(
      postSlice.actions.setCurrentImageIds(
        Object.values(normData.entities.posts).map((post: Post) => post.refId)
      )
    );
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
