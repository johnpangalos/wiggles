import React, { useState, useRef } from 'react';
import { Alert, CircleButton, Button, Loading } from '~/components';
import { getExtenstion } from '~/utils';
import { Fade } from '~/components/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

export const ImageUpload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const storageRef = window.firebase.storage().ref();
  const [alert, setAlert] = useState(false);

  const handleImageChange = event => {
    event.preventDefault();
    const reader = new FileReader();
    const eventFile = event.target.files[0];
    reader.onloadend = () => {
      setFile(eventFile);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(eventFile);
  };

  const reset = () => {
    setImagePreview(null);
    setFile(null);
  };
  const onCancel = () => reset();

  const onSubmit = setUploading => async () => {
    setUploading(true);
    const name = `${+new Date()}.${getExtenstion(file.name)}`;
    const ref = storageRef.child(name);
    const metadata = { customMetadata: { userId: user.claims.sub } };
    try {
      await ref.put(file, metadata);
      setAlert(true);
      setUploading(false);
      reset();
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  return (
    <>
      <Fade in={!!imagePreview}>
        <SubmitScreen
          imagePreview={imagePreview}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Fade>
      <Fade in={!imagePreview}>
        <UploadScreen
          alert={alert}
          setAlert={setAlert}
          handleImageChange={handleImageChange}
        />
      </Fade>
    </>
  );
};

const SubmitScreen = ({ imagePreview, onCancel, onSubmit }) => {
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <Fade in={uploading}>
        <div className="h-full w-full pb-16">
          <Loading message="Uploading Image" />
        </div>
      </Fade>

      <Fade in={!uploading}>
        <div className="flex flex-col justify-center items-center w-full h-full pb-16">
          <div className="flex w-full justify-center items-center flex-grow p-3">
            <div
              style={{ backgroundImage: `url(${imagePreview})` }}
              className="bg-no-repeat bg-center bg-contain w-full h-full"
            />
          </div>

          <div className="flex justify-end w-full py-3 pr-3">
            <Button onClick={onCancel} className="mr-2">
              Cancel
            </Button>
            <Button onClick={onSubmit(setUploading)} color="red" dark="true">
              Submit
            </Button>
          </div>
        </div>
      </Fade>
    </>
  );
};

const UploadScreen = ({ handleImageChange, alert, setAlert }) => {
  const uploadImage = useRef(null);

  const handleClick = event => {
    event.preventDefault();
    uploadImage.current.click();
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full pb-16">
      <div className="w-full">
        <Alert show={alert} onClose={() => setAlert(false)} type="success">
          Upload Successful
        </Alert>
      </div>

      <div className="flex flex-col justify-center items-center flex-grow max-w-xs w-full text-center">
        <div className="text-xl font-bold pb-2">Nothing to see here!</div>
        <div>When uploading an image a preview will show up here.</div>
      </div>

      <div className="flex justify-center w-full py-3">
        <CircleButton
          color="red"
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
          onChange={event => handleImageChange(event)}
        />
      </div>
    </div>
  );
};
