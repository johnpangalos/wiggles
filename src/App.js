import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Fade } from '~/components/transitions';

import { Loading, Button } from '~/components';
import { Login, ImageUpload } from '~/containers';

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

  return (
    <div
      id="App"
      className="flex flex-col h-screen w-full items-center text-grey-darkest"
    >
      <Router>
        <div className="z-10 flex items-center flex-shrink bg-grey-lighter w-full h-16 shadow absolute">
          <div className="flex-grow" />
          {user && (
            <div className="pr-5">
              <Button onClick={() => signOut()}>Logout</Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center flex-grow h-full w-full">
          <Fade in={loading} className="h-full">
            <Loading />
          </Fade>
          <Fade in={!loading} className="h-full">
            <>
              <PrivateRoute
                exact
                signOut={signOut}
                user={user}
                path="/"
                component={ImageUpload}
              />
              <Route path="/login" component={() => <Login user={user} />} />
            </>
          </Fade>
        </div>
      </Router>
    </div>
  );
};

const PrivateRoute = ({ component: Component, user, signOut, ...rest }) => {
  if (user && user.claims && !user.claims.authorized) signOut();
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
};
