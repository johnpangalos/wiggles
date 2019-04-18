import React, { useState, useRef } from 'react';
import { Alert, Button, Loading } from '~/components';
import { getExtenstion } from '~/utils';
import { Fade } from '~/components/transitions';

export const ImageUpload = () => {
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
    try {
      await ref.put(file);
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
        <div className="h-full w-full pt-16">
          <Loading message="Uploading Image" />
        </div>
      </Fade>

      <Fade in={!uploading}>
        <div className="flex flex-col justify-center items-center w-full h-full pt-16">
          <div className="flex justify-center items-center flex-grow p-3">
            <img alt="Preview" src={imagePreview} />
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
    <div className="flex flex-col justify-center items-center h-full w-full pt-16">
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
        <Button color="red" dark="true" onClick={event => handleClick(event)}>
          Upload image
        </Button>
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
