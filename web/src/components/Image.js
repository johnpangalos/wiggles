/*global lozad*/
import React, { useEffect } from 'react';

export const Image = ({ url, noFetch, style }) => {
  useEffect(() => {
    const load = async el => {
      const url = el.getAttribute('data-url');
      if (noFetch) {
        el.style.backgroundImage = `url('${url}')`;
        return;
      }
      var storage = window.firebase.storage();
      const image = await storage.ref(url).getDownloadURL();

      el.classList.add('fadeIn', 'an-2s');
      el.style.backgroundImage = `url('${image}')`;
    };

    const observer = lozad('.lozad', {
      load
    });
    observer.observe();
  }, [noFetch, url]);

  return (
    <div
      data-url={url}
      style={style}
      className="w-full h-full bg-no-repeat bg-contain bg-center lozad"
    />
  );
};
