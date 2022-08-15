import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { StoreContext } from "redux-react-hook";
import { store } from "./store";
import lozad from "lozad";

declare global {
  interface Window {
    db: any;
    observer: any;
    lozad: any;
    firebase: any;
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
