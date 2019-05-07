import React, { useState, useRef, useEffect } from 'react';
import { Fade } from '~/components/transitions';

export const Image = ({
  url,
  index,
  size,
  lazyLoadStart = 2,
  preloaded = false,
  style = {},
  selected = false,
  selectable = false,
  handleClick = () => null
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const img = useRef(null);

  const getImageUrl = async () => {
    var storage = window.firebase.storage();
    const temp = await storage.ref(url).getDownloadURL();
    setImageUrl(temp);
  };

  const imageLoaded = () => setLoading(false);

  const imgLoadListener = () => {
    if (!img) return;
    img.current.addEventListener('load', imageLoaded);
    return () => img.current.removeEventListener('load', imageLoaded);
  };

  useEffect(() => {
    if (!preloaded) {
      getImageUrl();
      window.observer.observe();
    }
  }, []);

  useEffect(() => {
    if (preloaded) {
      setImageUrl(url);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!preloaded) {
      const unsubscribe = imgLoadListener();
      return () => {
        unsubscribe();
      };
    }
  }, [img]);

  return (
    <Fade appear show={!loading}>
      <div
        className={`flex items-center justify-center w-full${
          loading ? ' invisible w-0' : ''
        }`}
      >
        <div
          className={`bg-white shadow-lg rounded px-2 pt-3 pb-8 w-full h-${size} max-w-${size}${
            selectable ? ' cursor-pointer' : ''
          }${selected ? ' border-primary border-2' : ''}`}
        >
          <div
            className="flex bg-secondary-dark p-1 rounded justify-center items-center h-full w-full"
            onClick={() => handleClick()}
          >
            <img
              ref={img}
              className={`${index > lazyLoadStart ? 'lozad ' : ''}${
                loading ? 'invisible w-0 ' : ''
              }max-h-full`}
              src={index > lazyLoadStart ? '' : imageUrl}
              data-src={index > lazyLoadStart ? imageUrl : ''}
              alt={index}
              style={style}
            />
          </div>
        </div>
      </div>
    </Fade>
  );
};
