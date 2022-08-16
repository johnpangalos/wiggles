import React, { useEffect, CSSProperties } from "react";
import lozad from "lozad";

type ImageProps = {
  url: string;
  noFetch: boolean;
  style: CSSProperties;
};
export const Image = ({ url, noFetch, style }: ImageProps) => {
  useEffect(() => {
    const load = async (el: HTMLElement) => {
      const url = el.getAttribute("data-url");
      if (noFetch) {
        el.style.backgroundImage = `url('${url}')`;
        return;
      }
      var storage = window.firebase.storage();
      const image = await storage.ref(url).getDownloadURL();

      el.classList.add("fadeIn", "an-2s");
      el.style.backgroundImage = `url('${image}')`;
    };

    const observer = lozad(".lozad", {
      load,
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
