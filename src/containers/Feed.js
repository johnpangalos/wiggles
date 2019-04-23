import React, { useEffect } from 'react';

export const Feed = () => {
  const getImages = async () => {
    const imagesRef = window.firebase.database().ref('images/');
    const snapshot = await imagesRef.once('value');
    console.log(snapshot.val());
  };
  useEffect(() => {
    getImages();
  }, []);
  return <div>Cool stuff!</div>;
};
