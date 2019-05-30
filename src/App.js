import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import { matchPath } from 'react-router';
import { useDispatch } from 'redux-react-hook';

import { constants } from '~/constants';
import { Loading, BottomNavigation } from '~/components';
import { Fade } from '~/components/transitions';
import { Login, Upload, Feed, Profile } from '~/containers';

export default () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const distpatch = useDispatch();
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
          distpatch({ type: constants.UPDATE_USER, payload: idToken });
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

  return (
    <div
      id="App"
      className="flex flex-col w-full items-center text-grey-darkest"
    >
      <Router>
        <div className="h-screen flex flex-col w-full">
          <div className="flex-grow w-full overflow-y-auto">
            {loading ? (
              <Fade appear in={loading}>
                <Loading />
              </Fade>
            ) : (
              <>
                <PrivateRoute
                  signOut={signOut}
                  user={user}
                  exact
                  path={['/upload', '/upload/:currentTab']}
                  component={args => <Upload user={user} {...args} />}
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

          {user && (
            <Fade appear in={!loading}>
              <BottomNavigation />
            </Fade>
          )}
        </div>
      </Router>
    </div>
  );
};

const PublicRoute = withRouter(
  ({ location, component: Component, user, ...rest }) => (
    <Fade
      mountOnEnter
      unmountOnExit
      appear
      in={locationEqualToPath(location.pathname, rest.path)}
    >
      <Route {...rest} render={props => <Component {...props} />} />
    </Fade>
  )
);

const locationEqualToPath = (name, path) => {
  if (typeof path === 'string') return name === path;
  return path.some(item => matchPath(name, item));
};

const PrivateRoute = withRouter(
  ({ location, component: Component, user, signOut, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          user ? (
            <Fade
              mountOnEnter
              unmountOnExit
              appear
              in={locationEqualToPath(location.pathname, rest.path)}
            >
              <Component {...props} />
            </Fade>
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
