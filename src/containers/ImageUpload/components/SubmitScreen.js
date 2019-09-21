import React, { useCallback } from 'react';
import { Post, Button, Image } from '~/components';
import { constants } from '../store';
import { useMappedState } from 'redux-react-hook';

var rotation = {
  1: 'rotate(0deg)',
  3: 'rotate(180deg)',
  6: 'rotate(90deg)',
  8: 'rotate(270deg)'
};

export const SubmitScreen = ({ state: { uploading }, dispatch, onSubmit }) => {
  const mapState = useCallback(
    state => ({
      imagePreview: state.imageFile.imagePreview,
      orientation: state.imageFile.orientation
    }),
    []
  );
  // add back in orientation
  const { imagePreview, orientation } = useMappedState(mapState);

  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex-auto flex items-center max-w-500 w-full px-8">
        <Post size={500}>
          <Image
            style={{ transform: rotation[orientation] }}
            url={imagePreview}
            noFetch
          />
        </Post>
      </div>

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
  );
};
