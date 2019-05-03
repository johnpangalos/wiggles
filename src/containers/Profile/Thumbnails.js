import React from 'react';
import { Image, Loading } from '~/components';

export const Thumbnails = ({ loading, images, selected, handleClick }) => {
  return (
    <div className="flex flex-col h-full py-5">
      <div className="text-xl font-bold pb-2">Images</div>
      {loading && (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      )}
      {!loading && (
        <div className="flex flex-wrap">
          {Object.values(images)
            .filter(image => image.uploadFinished)
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((image, index) => {
              let paddingClass = 'px-2';
              if ((index + 1) % 3 === 1) paddingClass = 'pr-2';
              if ((index + 1) % 3 === 0) paddingClass = 'pl-2';
              return (
                <div key={image.id} className={`w-1/3 ${paddingClass}`}>
                  <Image
                    handleClick={() => handleClick(image.id)}
                    selectable={true}
                    selected={selected[image.id]}
                    url={image.thumbnail}
                    index={index}
                    size="24"
                    lazyLoadStart={20}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
