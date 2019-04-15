import React, { useState, useEffect } from 'react';
import './styles/loading-spinner.css';

const getFirebaseToken = () => {
  window.firebase.auth().useDeviceLanguage();
  const provider = new window.firebase.auth.GoogleAuthProvider();
  window.firebase.auth().signInWithRedirect(provider);
};

const firebaseResponseListener = async setLoading => {
  try {
    if (window.localStorage.getItem('token')) return setLoading(false);
    const result = await window.firebase.auth().getRedirectResult();
    if (result.credential) {
      window.localStorage.setItem('token', result.credential.accessToken);
      window.localStorage.setItem('user', JSON.stringify(result.user));
      return;
    }
    getFirebaseToken();
  } catch (error) {
    console.error(error);
    getFirebaseToken();
  }
};

export default () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebaseResponseListener(setLoading);
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {loading ? <Loading /> : <ConstructionMessage />}
    </div>
  );
};

const Loading = () => (
  <div className="loading">
    <div />
  </div>
);

const ConstructionMessage = () => (
  <div
    className="
      flex
      flex-col
      justify-center
      items-center
      bg-grey-lighter
      px-10
      py-8
      rounded-lg
      text-grey-darkest"
  >
    <div className="text-3xl font-bold pb-2">App under construction...</div>
    <div className="text-xl">Please comeback later to see more!</div>
  </div>
);
