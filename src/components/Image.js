import React, { useState, useEffect } from 'react';
import { Fade } from '~/components/transitions';

export const Image = ({ url }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const getImageUrl = async () => {
    var storage = window.firebase.storage();
    const temp = await storage.ref(url).getDownloadURL();
    setImageUrl(temp);
  };

  useEffect(() => {
    getImageUrl();
  }, [url]);

  return (
    imageUrl && (
      <Fade show={true} appear>
        <div
          className="w-full h-full bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </Fade>
    )
  );
};
