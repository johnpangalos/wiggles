import React from 'react';
import { Button, Loading, Image } from '~/components';
import { constants } from '../store';
import { Fade } from '~/components/transitions';

var rotation = {
  1: 'rotate(0deg)',
  3: 'rotate(180deg)',
  6: 'rotate(90deg)',
  8: 'rotate(270deg)'
};

export const SubmitScreen = ({
  state: { uploading, uploadMessage, imagePreview, orientation },
  dispatch,
  onSubmit
}) => (
  <>
    <Fade unmountOnExit show={uploading}>
      <div className="h-full w-full">
        <Loading message={uploadMessage} />
      </div>
    </Fade>
    <div className="flex flex-col justify-center items-center w-full h-full">
      {imagePreview && (
        <div className="flex flex-grow items-center h-full max-w-500 w-full px-8">
          <Image
            style={{ transform: rotation[orientation] }}
            url={imagePreview}
            index={0}
            size="100"
            preloaded
          />
        </div>
      )}

      <div className="flex justify-end w-full py-3 pr-3">
        <div className="pr-2">
          <Button
            onClick={() => {
              dispatch({ type: constants.SHOW_UPLOAD });
            }}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            onClick={onSubmit()}
            color="primary"
            hoverColor="primary-dark"
            dark="true"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  </>
);
