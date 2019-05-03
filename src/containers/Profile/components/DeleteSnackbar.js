import React, { useState } from 'react';
import { SlideUp } from '~/components/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { constants } from '../reducer';
import { deleteImages } from '../actions';

export const DeleteSnackbar = ({ selected, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const numImages = Object.values(selected).filter(item => item).length;

  const handleClick = async () => {
    setLoading(true);
    try {
      await deleteImages(Object.keys(selected));
      dispatch({ type: constants.RESET_SELECTED });
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
            <div className="flex items-center w-full h-full pl-4">
              Loading...
            </div>
          ) : (
            <div className="flex items-center w-full h-full">
              <div className="flex-grow pl-4">{numImages} Images Selected</div>
              <div className="pr-4">
                <FontAwesomeIcon
                  role="button"
                  className={`text-2xl fill-current text`}
                  icon={faTrash}
                  onClick={() => handleClick()}
                />
              </div>
            </div>
          )}
        </div>
      </SlideUp>
    </div>
  );
};
