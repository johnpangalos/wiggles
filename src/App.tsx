import React from 'react';
import { BottomNav, Button } from './lib';
import { BrowserRouter as Router, useRouteMatch } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import { Provider, useDispatch } from 'react-redux';

import { store, user } from './reducers';
import { FeedRoute } from './views/Feed';

export const AppWrapper = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col h-screen">
          <App />
        </div>
      </Router>
    </Provider>
  );
};

const App = () => {
  const [currUser, initialising, error] = useAuthState(firebase.auth());
  const dispatch = useDispatch();
  if (error) return <div>uhhh....</div>;
  if (initialising) return <div>Loading...</div>;
  if (currUser)
    return (
      <>
        <div className="h-0 flex-auto">
          <FeedRoute />
          <Upload />
        </div>
        <div>
          <BottomNav />
        </div>
      </>
    );
  return <Button onClick={() => dispatch(user.actions.login())}>Log in</Button>;
};

const Upload = () => {
  let match = useRouteMatch('/upload');
  if (!match) return <div />;
  return <div>Upload?</div>;
};
