import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { SnackBar, CircleButton } from '~/components';
import { constants } from '../store';

export const UploadScreen = ({ handleImageChange, alert, dispatch }) => {
  const uploadImage = useRef(null);

  const handleClick = event => {
    event.preventDefault();
    uploadImage.current.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center flex-auto h-0 relative">
        <div className="max-w-xs w-full text-center">
          <div className="text-xl font-bold pb-2">Nothing to see here!</div>
          <div>When uploading an image a preview will show up here.</div>
        </div>

        <SnackBar
          show={alert}
          text="Upload Successful"
          action={() => dispatch({ type: constants.HIDE_ALERT })}
          actionText="Dismiss"
        />
      </div>

      <div className="flex justify-center w-full pb-3">
        <CircleButton
          color="purple-600"
          hoverColor="purple-500"
          dark="true"
          onClick={event => handleClick(event)}
        >
          <FontAwesomeIcon role="button" size="2x" icon={faCameraRetro} />
        </CircleButton>
        <input
          className="hidden"
          id="upload-image"
          ref={uploadImage}
          type="file"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};
