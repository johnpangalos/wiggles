import { constants } from '../constants';

export const initialState = {
  uploadMessage: 'Uploading Image',
  file: null,
  orientation: null,
  imagePreview: null,
  uploading: false
};

export const imageFile = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_UPLOAD_MESSAGE: {
      return { ...state, uploadMessage: action.payload };
    }
    case constants.START_UPLOADING: {
      return { ...state, uploading: true };
    }
    case constants.END_UPLOADING: {
      return { ...state, uploading: false };
    }
    case constants.SET_FILE: {
      return {
        ...state,
        orientation: action.orientation,
        imagePreview: action.imagePreview,
        file: action.file
      };
    }
    default: {
      return state;
    }
  }
};
