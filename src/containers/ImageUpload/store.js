import EXIF from 'exif-js';
import { getExtenstion } from '~/utils';

export const initialState = {
  showSubmit: false,
  imagePreview: null,
  uploadMessage: 'Uploading Image',
  alert: false,
  orientation: null,
  file: null,
  uploading: false,
  timestamp: null,
  currentTab: 'images'
};

export const constants = {
  SHOW_SUBMIT: 'show-submit',
  SHOW_UPLOAD: 'show-upload',
  SET_IMAGE_PREVIEW: 'set-image-preview',
  SET_UPLOAD_MESSAGE: 'set-upload-message',
  HIDE_ALERT: 'hide-alert',
  SHOW_ALERT: 'show-alert',
  SET_ORIENTATION: 'set-orientation',
  SET_FILE: 'set-file',
  START_UPLOADING: 'start-uploading',
  END_UPLOADING: 'end-uploading',
  SET_TIMESTAMP: 'set-timestamp',
  RESET: 'reset',
  SET_CURRENT_TAB: 'set-current-tab'
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_IMAGE_PREVIEW: {
      return { ...state, imagePreview: action.payload };
    }
    case constants.SET_UPLOAD_MESSAGE: {
      return { ...state, uploadMessage: action.payload };
    }
    case constants.HIDE_ALERT: {
      return { ...state, alert: false };
    }
    case constants.SHOW_ALERT: {
      return { ...state, alert: true };
    }
    case constants.START_UPLOADING: {
      return { ...state, uploading: true };
    }
    case constants.END_UPLOADING: {
      return { ...state, uploading: false };
    }
    case constants.SET_ORIENTATION: {
      return { ...state, orientation: action.payload };
    }
    case constants.SET_FILE: {
      return { ...state, file: action.payload };
    }
    case constants.SET_TIMESTAMP: {
      return { ...state, timestamp: action.payload };
    }
    case constants.SHOW_SUBMIT: {
      return { ...state, showSubmit: true };
    }
    case constants.SHOW_UPLOAD: {
      return { ...state, showSubmit: false };
    }
    case constants.RESET: {
      return initialState;
    }
    case constants.SET_CURRENT_TAB: {
      return { ...state, currentTab: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const actions = {
  getOrientation: file =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const { Orientation } = EXIF.readFromBinaryFile(reader.result);
        resolve(Orientation);
      };

      reader.readAsArrayBuffer(file);
    }),

  getUrlFromFile: file =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    }),

  uploadListener: (timestamp, callback) => {
    const imageDataRef = window.firebase.database().ref('images/');

    imageDataRef
      .orderByChild('timestamp')
      .equalTo(timestamp.toString())
      .on('child_changed', callback);
    return () => imageDataRef.off('value', callback);
  },

  uploadImage: (file, user, timestamp) => {
    const metadata = {
      customMetadata: { userId: user.claims.sub },
      cacheControl: 'public,max-age=31536000'
    };
    const name = `${timestamp}.${getExtenstion(file.name)}`;
    const storageRef = window.firebase.storage().ref();
    const ref = storageRef.child(name);
    return ref.put(file, metadata);
  }
};
