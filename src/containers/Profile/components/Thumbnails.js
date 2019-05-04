import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { Image, Loading, Menu } from '~/components';
import { constants } from '../reducer';

export const Thumbnails = ({
  loading,
  images,
  selected,
  handleClick,
  dispatch,
  selectMode
}) => {
  return (
    <div className="flex flex-col h-full py-5">
      <div className="flex items-center">
        <div className="flex-grow text-xl font-bold pb-2">Images</div>
        <div className="relative">
          {!selectMode && (
            <Menu
              id="images-menu"
              activator={() => (
                <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-grey-light p-1">
                  <FontAwesomeIcon
                    role="button"
                    className={`text-xl fill-current text`}
                    icon={faEllipsisV}
                  />
                </div>
              )}
              items={[
                ({ onClose }) => (
                  <div
                    className="w-32 px-4 py-2 hover:bg-grey-light cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: constants.SET_SELECT_MODE,
                        payload: true
                      });
                      onClose();
                    }}
                  >
                    Select Mode
                  </div>
                )
              ]}
            />
          )}
        </div>
      </div>
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
              let paddingClass = 'px-1';
              if ((index + 1) % 3 === 1) paddingClass = 'pr-2';
              if ((index + 1) % 3 === 0) paddingClass = 'pl-2';
              return (
                <div key={image.id} className={`w-1/3 ${paddingClass}`}>
                  <Image
                    handleClick={() => handleClick(image.id)}
                    selectable={selectMode}
                    selected={selected[image.id]}
                    url={image.thumbnail}
                    index={index}
                    size="32"
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
