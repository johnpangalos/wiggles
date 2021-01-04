import React, { useReducer, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { setFile } from '../../actions';
import { Fade } from '../../components/transitions';
import { Loading } from '../../components';
import { initialState, constants, reducer, actions } from './store';
import { UploadScreen, SubmitScreen } from './components';

export const ImageUpload = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mapState = useCallback(
    state => ({
      file: state.imageFile.file,
      user: state.user
    }),
    []
  );
  const dispatch2 = useDispatch();
  const { user, file } = useMappedState(mapState);

  const handleImageChange = async event => {
    event.preventDefault();
    dispatch({ type: constants.RESET });

    const eventFile = event.target.files[0];
    dispatch({ type: constants.SET_FILE, payload: eventFile });
    const [imagePreview, orientation] = await Promise.all([
      actions.getUrlFromFile(eventFile),
      actions.getOrientation(eventFile)
    ]);
    dispatch2(setFile({ imagePreview, orientation, file: eventFile }));
    dispatch({ type: constants.SHOW_SUBMIT });
    //dispatch({ type: constants.SET_IMAGE_PREVIEW, payload: url });
    //dispatch({ type: constants.SET_ORIENTATION, payload: direction });
  };

  const onSubmit = () => async () => {
    dispatch({ type: constants.START_UPLOADING });
    const timestamp = +new Date();

    try {
      dispatch({ type: constants.SET_TIMESTAMP, payload: timestamp });
      await actions.uploadImage(file, user, timestamp);
      dispatch({ type: constants.END_UPLOADING });
      dispatch({ type: constants.SHOW_UPLOAD });
      dispatch({ type: constants.SHOW_ALERT });
    } catch (error) {
      dispatch({ type: constants.END_UPLOADING });
      console.error(error);
    }
  };

  return (
    <div className="flex-auto h-0">
      {state.uploading && (
        <Fade appear in={state.uploading}>
          <div className="h-full w-full">
            <Loading />
          </div>
        </Fade>
      )}
      {state.showSubmit && (
        <Fade appear show={!state.uploading && state.showSubmit}>
          <SubmitScreen state={state} dispatch={dispatch} onSubmit={onSubmit} />
        </Fade>
      )}
      {!state.showSubmit && (
        <Fade appear show={!state.showSubmit && !state.uploading}>
          <UploadScreen
            alert={state.alert}
            dispatch={dispatch}
            handleImageChange={handleImageChange}
          />
        </Fade>
      )}
    </div>
  );
};
