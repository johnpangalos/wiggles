import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './tailwind.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreContext } from 'redux-react-hook';
import { store } from './store';

declare global {
  interface Window {
    db: any;
    observer: any;
    lozad: any;
    firebase: any;
  }
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://645ca46ead98408a94482c3f2bb4dcac@sentry.io/1890426'
  });
  window.db.enablePersistence().catch(function(err: any) {
    console.error('Not able to enable persistence.', err);
  });
}

window.observer = window.lozad();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
