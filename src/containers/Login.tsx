import React, { useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

import { Loading } from "../components";

const provider = new GoogleAuthProvider();

async function getFirebaseToken() {
  const auth = getAuth();
  await signInWithRedirect(auth, provider);
}

export const Login = withRouter<any, any>(({ user, location }: any) => {
  const { from } = location.state || { from: { pathname: "/" } };
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
    <div className="flex justify-center items-center h-full w-full px-5 bg-gray-600">
      <div className="flex flex-col bg-gray-100 p-4 sm:w-64 w-full shadow">
        <div className="font-bold text-2xl pb-2">Please Login</div>
        <div className="text-xl pb-6">
          Right now only Google login is supported.
        </div>
        <button
          onClick={() => handleClick()}
          className="flex items-baseline bg-red-400 py-2 text-xl text-white"
        >
          <div>Login with Google</div>
        </button>
      </div>
    </div>
  );
};
