import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { StoreContext } from "redux-react-hook";
import { store } from "./store";
import lozad from "lozad";

import { initializeApp } from "firebase/app";

const config = {
  apiKey: "AIzaSyDcx5xDlQS3ixEFF8mESoxUzTk9f56uQhA",
  authDomain: "wiggles-f0bd9.firebaseapp.com",
  databaseURL: "https://wiggles-f0bd9.firebaseio.com",
  projectId: "wiggles-f0bd9",
  storageBucket: "wiggles-f0bd9.appspot.com",
  messagingSenderId: "837754270874",
};

initializeApp(config);

declare global {
  interface Window {
    observer: any;
    lozad: any;
  }
}

window.observer = lozad();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
