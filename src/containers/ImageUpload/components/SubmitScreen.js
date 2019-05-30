import React, { useCallback } from 'react';
import { Post, Button, Loading, Image } from '~/components';
import { constants } from '../store';
import { Fade } from '~/components/transitions';
import { useMappedState } from 'redux-react-hook';

// var rotation = {
// 1: 'rotate(0deg)',
// 3: 'rotate(180deg)',
// 6: 'rotate(90deg)',
// 8: 'rotate(270deg)'
// };

export const SubmitScreen = ({
  state: { uploading, uploadMessage },
  dispatch,
  onSubmit
}) => {
  const mapState = useCallback(
    state => ({
      imagePreview: state.imageFile.imagePreview,
      orientation: state.imageFile.orientation
    }),
    []
  );
  // add back in orientation
  const { imagePreview } = useMappedState(mapState);

  return (
    <>
      <Fade unmountOnExit show={uploading}>
        <div className="h-full w-full">
          <Loading message={uploadMessage} />
        </div>
      </Fade>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-grow items-center h-full max-w-500 w-full px-8">
          <Post size={500}>
            <Image url={imagePreview} noFetch />
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
    </>
  );
};
