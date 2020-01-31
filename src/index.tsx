import React from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { AppWrapper } from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyDcx5xDlQS3ixEFF8mESoxUzTk9f56uQhA',
  authDomain: 'wiggles-f0bd9.firebaseapp.com',
  databaseURL: 'https://wiggles-f0bd9.firebaseio.com',
  projectId: 'wiggles-f0bd9',
  storageBucket: 'wiggles-f0bd9.appspot.com',
  messagingSenderId: '837754270874',
  appId: '1:837754270874:web:4760e51978d04dfb'
};

firebase.initializeApp(firebaseConfig);

render(<AppWrapper />, document.getElementById('app'));
