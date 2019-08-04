import React, { useState, useEffect } from 'react';
import { Fade } from '~/components/transitions';

export const Image = ({ url, noFetch }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getImageUrl = async () => {
      var storage = window.firebase.storage();
      const temp = await storage.ref(url).getDownloadURL();
      setImageUrl(temp);
    };

    if (noFetch) {
      setImageUrl(url);
      return;
    }
    getImageUrl();
  }, [noFetch, url]);

  useEffect(() => window.observer.observe(), []);

  return (
    imageUrl && (
      <Fade show={true} appear>
        <div
          className="w-full h-full bg-no-repeat bg-contain bg-center lozad"
          data-background-image={imageUrl}
        />
      </Fade>
    )
  );
};
