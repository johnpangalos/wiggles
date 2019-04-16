import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './styles/loading-spinner.css';
import { Login } from './Login';
import { Loading } from './Loading';

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
          setLoading(false);
          const idToken = await window.firebase
            .auth()
            .currentUser.getIdTokenResult();
          setUser(idToken);
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
        <div className="flex items-center flex-shrink bg-grey-lighter w-full h-12 shadow">
          <div className="flex-grow" />
          <div onClick={() => signOut()} className="pr-5">
            {user && (
              <button className="bg-transparent hover:bg-grey-light py-2 px-4">
                Logout
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center flex-grow w-full">
          {loading ? (
            <Loading />
          ) : (
            <div className="h-full w-full">
              <PrivateRoute
                exact
                signOut={signOut}
                user={user}
                path="/"
                component={ConstructionMessage}
              />
              <Route path="/login" component={() => <Login user={user} />} />
            </div>
          )}
        </div>
      </Router>
    </div>
  );
};

const ConstructionMessage = () => (
  <div className="flex flex-col justify-center items-center h-full">
    <div className="bg-grey-lighter px-10 py-8 self-center rounded-lg">
      <div className="text-3xl font-bold pb-2">App under construction...</div>
      <div className="text-xl">Please comeback later to see more!</div>
    </div>
  </div>
);

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
