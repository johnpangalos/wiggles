import React, { useState, useEffect } from 'react';
import { SlideUp } from '~/components/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const DeleteSnackbar = ({ selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const numImages = Object.values(selected).filter(item => item).length;

  const deleteImages = async () => {
    setLoading(true);
    try {
      await Promise.all(
        Object.keys(selected)
          .filter(id => selected[id])
          .map(id => deleteImage(id))
      );
      setSelected({});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <SlideUp height="60px" show={numImages > 0} appear>
        <div className="w-full h-full bg-red-light text-white">
          {loading ? (
            <div className="flex items-center w-full h-full">Loading...</div>
          ) : (
            <div className="flex items-center w-full h-full">
              <div className="flex-grow pl-4">{numImages} Images Selected</div>
              <div className="pr-4">
                <FontAwesomeIcon
                  role="button"
                  className={`text-2xl fill-current text`}
                  icon={faTrash}
                  onClick={() => deleteImages()}
                />
              </div>
            </div>
          )}
        </div>
      </SlideUp>
    </div>
  );
};

const deleteImage = id => {
  const imageRef = window.firebase.database().ref(`images/${id}`);
  return imageRef.remove();
};
