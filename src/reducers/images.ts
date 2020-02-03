import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as firebase from 'firebase/app';
import { normalize, schema } from 'normalizr';

enum Status {
  GeneratingImages = 'Generating display images',
  Finished = 'Finished'
}

export type Image = {
  contentType: string;
  id: string;
  path: string;
  status: Status;
  thumbnail: string;
  timestamp: string;
  uploadFinished: boolean;
  userId: string;
  web: string;
};

const imageSchema = new schema.Entity('images');

type NormalizedImages = {
  [id: string]: Image;
};

type ImageState = {
  error: string;
  loading: boolean;
  data: NormalizedImages;
};

const initialState: ImageState = {
  error: null,
  loading: false,
  data: {}
};

const imageSlice = createSlice({
  name: 'images',
  reducers: {
    add: (state, action: PayloadAction<NormalizedImages>) => ({
      ...state,
      data: {
        ...state.data,
        ...action.payload
      }
    }),
    loading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload
    }),
    error: (state, action: PayloadAction<string>) => ({
      ...state,
      error: action.payload
    })
  },
  initialState
});

const fetchImages = () => async (dispatch, getState) => {
  dispatch(imageSlice.actions.loading(true));

  const {
    posts: { currentImageIds }
  } = getState();

  try {
    if (currentImageIds.length === 0) {
      dispatch(imageSlice.actions.loading(false));
      return;
    }
    const data = await firebase
      .firestore()
      .collection('images')
      .where('id', 'in', currentImageIds)
      .get();

    const imageData = data.docs.map(doc => doc.data());
    const normData = normalize(imageData, [imageSchema]);
    dispatch(imageSlice.actions.add(normData.entities.images));
    dispatch(imageSlice.actions.loading(false));
  } catch (err) {
    console.error(err);
    dispatch(imageSlice.actions.error('An unexpected error has occured'));
  }
};

export const images = {
  ...imageSlice,
  actions: {
    ...imageSlice,
    fetchImages
  }
};
