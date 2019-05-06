import React, { useState, useEffect } from 'react';
import { Image } from '~/components';

export const Feed = () => {
  const [images, setImages] = useState({});
  const callback = snapshot => setImages({ ...images, ...snapshot.val() });

  useEffect(() => {
    const imagesRef = window.firebase.database().ref('images/');
    imagesRef.on('value', callback);
    return () => {
      imagesRef.off('value', callback);
    };
  }, [images]);

  return (
    <div className="h-full w-full">
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll">
        <div className="px-8 py-6">
          {Object.keys(images).length > 0 &&
            Object.values(images)
              .filter(image => image.uploadFinished)
              .sort((a, b) => (a.timestamp - b.timestamp) * -1)
              .map((image, index) => (
                <div className="pb-4">
                  <Image
                    key={image.id}
                    url={image.web}
                    index={index}
                    size="100"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
