import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Redirect, withRouter } from 'react-router-dom';
import { Loading } from './Loading';

const getFirebaseToken = () => {
  window.firebase.auth().useDeviceLanguage();
  const provider = new window.firebase.auth.GoogleAuthProvider();
  window.firebase.auth().signInWithRedirect(provider);
};

export const Login = withRouter(({ user, location }) => {
  const { from } = location.state || { from: { pathname: '/' } };
  console.log(from);
  return user ? <Redirect to={from} /> : <LoginModal />;
});

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    getFirebaseToken();
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col bg-grey-lightest p-4 sm:w-64 w-full shadow">
        <div className="text-xl pb-2">Please Login</div>
        <button
          onClick={() => handleClick()}
          className="flex items-baseline bg-red py-2 text-white"
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
