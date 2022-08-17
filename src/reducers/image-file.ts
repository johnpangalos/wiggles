import { Action } from "redux";
import { Constants } from "../constants";

export const initialState = {
  uploadMessage: "Uploading Image",
  file: null,
  orientation: null,
  imagePreview: null,
  uploading: false,
};

export const imageFile = (
  state = initialState,
  action: Action<Constants> & {
    payload: any;
    orientation: any;
    imagePreview: string;
    file: string;
  }
) => {
  switch (action.type) {
    case Constants.SET_UPLOAD_MESSAGE: {
      return { ...state, uploadMessage: action.payload };
    }
    case Constants.START_UPLOADING: {
      return { ...state, uploading: true };
    }
    case Constants.END_UPLOADING: {
      return { ...state, uploading: false };
    }
    case Constants.SET_FILE: {
      return {
        ...state,
        orientation: action.orientation,
        imagePreview: action.imagePreview,
        file: action.file,
      };
    }
    default: {
      return state;
    }
  }
};
