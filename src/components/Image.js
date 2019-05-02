import React, { useState, useRef, useEffect } from 'react';
import { Loading } from '~/components';

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
    setImageUrl(await storage.ref(url).getDownloadURL());
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
    <div className="flex items-center justify-center py-5 w-full">
      <div
        className={`bg-grey-darkest p-2 w-full h-${size} max-w-${size}${
          selectable ? ' cursor-pointer' : ''
        }${selected ? ' border-red-light border-2' : ''}`}
      >
        <div
          className={`flex  justify-center items-center h-full w-full`}
          onClick={() => handleClick()}
        >
          {loading && <Loading light />}
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
  );
};
