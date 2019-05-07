import React, { useState, useEffect } from 'react';
import { Loading } from '~/components';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import Bowser from 'bowser';

import { BottomNavigation } from '~/components';
import { Login, ImageUpload, Feed, Profile } from '~/containers';

export default () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let callback = null;
    let metadataRef = null;

    const unsubscribe = window.firebase.auth().onAuthStateChanged(res => {
      if (callback) metadataRef.off('value', callback);

      if (res) {
        metadataRef = window.firebase
          .database()
          .ref('metadata/' + res.uid + '/refreshTime');
        callback = async snapshot => {
          res.getIdToken(true);
          const idToken = await window.firebase
            .auth()
            .currentUser.getIdTokenResult();
          setUser(idToken);
          setLoading(false);
        };
        metadataRef.on('value', callback);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signOut = () => {
    window.firebase.auth().signOut();
    setUser(null);
  };

  const browser = Bowser.getParser(window.navigator.userAgent);

  return (
    <div
      id="App"
      className="flex flex-col w-full items-center text-grey-darkest"
    >
      <Router>
        <div
          className={`h-screen flex flex-col w-full ${browser
            .getOS()
            .name.toLowerCase()}-${browser.getBrowser().name.toLowerCase()}`}
        >
          <div className="flex-grow w-full overflow-y-scroll">
            {loading ? (
              <Loading />
            ) : (
              <>
                <PrivateRoute
                  signOut={signOut}
                  user={user}
                  path="/camera"
                  component={() => <ImageUpload user={user} />}
                />
                <PrivateRoute
                  exact
                  signOut={signOut}
                  user={user}
                  path="/"
                  component={() => <Feed />}
                />
                <PrivateRoute
                  signOut={signOut}
                  user={user}
                  path="/profile"
                  component={() => <Profile signOut={signOut} user={user} />}
                />
                <PublicRoute
                  path="/login"
                  component={() => <Login user={user} />}
                />
              </>
            )}
          </div>
          {user && <BottomNavigation />}
        </div>
      </Router>
    </div>
  );
};

const PublicRoute = withRouter(
  ({ location, component: Component, user, ...rest }) => (
    <Route {...rest} render={props => <Component {...props} />} />
  )
);

const PrivateRoute = withRouter(
  ({ location, component: Component, user, signOut, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
);
