import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Redirect } from 'react-router-dom';

const getFirebaseToken = () => {
  window.firebase.auth().useDeviceLanguage();
  const provider = new window.firebase.auth.GoogleAuthProvider();
  window.firebase.auth().signInWithRedirect(provider);
};

export const Login = ({ user }) => {
  return user ? <Redirect to="/" /> : <LoginModal />;
};

const LoginModal = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="flex flex-col bg-grey-lightest p-4 sm:w-64 w-full shadow">
      <div className="text-xl pb-2">Please Login</div>
      <button
        onClick={() => getFirebaseToken()}
        className="flex items-baseline bg-red py-2 text-white"
      >
        <div>Login with Google</div>
      </button>
    </div>
  </div>
);

// <div className="px-3">
// <FontAwesomeIcon color="white" icon={faGoogle} />
// </div>
