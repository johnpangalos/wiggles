import React, { useState, useEffect, useRef } from 'react';
import { Loading } from '~/components';

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
      <div className="h-full overflow-x-hidden overflow-y-scroll">
        <div className="p-8">
          {Object.keys(images).length > 0 &&
            Object.values(images)
              .sort((a, b) => (a.timestamp - b.timestamp) * -1)
              .map((image, index) => (
                <Image key={image.id} image={image} index={index} />
              ))}
        </div>
      </div>
    </div>
  );
};

const Image = ({ image, index }) => {
  const LAZY_LOAD_START = 1;
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const img = useRef(null);

  const getImageUrl = async () => {
    var storage = window.firebase.storage();
    const url = await storage.ref(image.web).getDownloadURL();
    setImageUrl(url);
  };

  const imageLoaded = () => setLoading(false);
  const imgLoadListener = () => {
    if (!img) return;
    img.current.addEventListener('load', imageLoaded);
    return () => img.current.removeEventListener('load', imageLoaded);
  };

  useEffect(() => {
    getImageUrl();
    window.observer.observe();
  }, []);
  useEffect(() => {
    const unsubscribe = imgLoadListener();
    return () => {
      unsubscribe();
    };
  }, img);

  return (
    <div className="flex items-center justify-center py-5">
      <div className="bg-grey-light w-full h-500 max-w-500">
        <div className="flex justify-center items-center h-full w-full">
          {loading && <Loading />}
          <img
            ref={img}
            className={`${index > LAZY_LOAD_START ? 'lozad ' : ''}${
              loading ? 'invisible w-0 ' : ''
            }max-h-full`}
            src={index > LAZY_LOAD_START ? '' : imageUrl}
            data-src={index > LAZY_LOAD_START ? imageUrl : ''}
            alt={image.path}
          />
        </div>
      </div>
    </div>
  );
};
