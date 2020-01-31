import { createSlice } from '@reduxjs/toolkit';
import * as firebase from 'firebase/app';

export const user = createSlice({
  name: 'user',
  reducers: {
    login: () => {
      firebase.auth().useDeviceLanguage();
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    logout: () => {
      firebase.auth().signOut();
    }
  },
  initialState: {}
});
