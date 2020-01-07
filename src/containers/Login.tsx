import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Redirect, withRouter } from 'react-router-dom';

import { Loading } from 'components';

const getFirebaseToken = () => {
  window.firebase.auth().useDeviceLanguage();
  const provider = new window.firebase.auth.GoogleAuthProvider();
  window.firebase.auth().signInWithRedirect(provider);
};

export const Login = withRouter(({ user, location }) => {
  const { from } = location.state || { from: { pathname: '/' } };
  return user ? <Redirect to={from} /> : <LoginModal />;
});

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    getFirebaseToken();
  };

  return loading ? (
    <div className="flex flex-col items-center flex-grow h-full w-full">
      <Loading />
    </div>
  ) : (
    <div className="flex justify-center items-center h-full w-full px-5 bg-secondary-dark">
      <div className="flex flex-col bg-grey-lightest p-4 sm:w-64 w-full shadow">
        <div className="font-bold text-2xl pb-2">Please Login</div>
        <div className="text-xl pb-2 pb-6">
          Right now only Google login is supported.
        </div>
        <button
          onClick={() => handleClick()}
          className="flex items-baseline bg-red py-2 text-xl text-white"
        >
          <div className="px-3">
            <FontAwesomeIcon color="white" icon={faGoogle} />
          </div>
          <div>Login with Google</div>
        </button>
      </div>
    </div>
  );
};
