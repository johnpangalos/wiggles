import React, { useState, useEffect } from 'react';

export const Feed = () => {
  const [images, setImages] = useState({});
  const callback = snapshot => setImages({ ...images, ...snapshot.val() });

  useEffect(() => {
    const imagesRef = window.firebase.database().ref('images/');
    imagesRef.on('value', callback);
    return () => {
      imagesRef.off('value', callback);
    };
  }, []);

  return (
    <div className="h-full pb-16">
      <div className="h-full overflow-y-scroll">
        <div className="p-8">
          {Object.keys(images).length > 0 &&
            Object.values(images)
              .sort((a, b) => (a.timestamp - b.timestamp) * -1)
              .map(image => <Image key={image.id} image={image} />)}
        </div>
      </div>
    </div>
  );
};

const Image = ({ image }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const getImageUrl = async () => {
    var storage = window.firebase.storage();
    const url = await storage.ref(image.path).getDownloadURL();
    setImageUrl(url);
  };

  useEffect(() => {
    getImageUrl();
  }, []);

  return (
    <div className="flex items-center justify-center py-5">
      <div
        className="bg-grey-light"
        style={{
          height: '500px',
          width: '500px'
        }}
      >
        <div className="flex justify-center items-center h-full w-full">
          <img className="max-h-full" src={imageUrl} alt={image.path} />
        </div>
      </div>
    </div>
  );
};
