import React, { useState, useRef } from 'react';
import { Alert, CircleButton, Button, Loading, Image } from '~/components';
import { getExtenstion } from '~/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import EXIF from 'exif-js';

var rotation = {
  1: 'rotate(0deg)',
  3: 'rotate(180deg)',
  6: 'rotate(90deg)',
  8: 'rotate(270deg)'
};

const getOrientation = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const { Orientation } = EXIF.readFromBinaryFile(reader.result);
      resolve(Orientation);
    };

    reader.readAsArrayBuffer(file);
  });

const getUrlFromFile = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });

export const ImageUpload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const storageRef = window.firebase.storage().ref();
  const [alert, setAlert] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('Uploading Image');

  const handleImageChange = async event => {
    event.preventDefault();
    const eventFile = event.target.files[0];
    setFile(eventFile);
    const [url, direction] = await Promise.all([
      getUrlFromFile(eventFile),
      getOrientation(eventFile)
    ]);
    setImagePreview(url);
    setOrientation(direction);
  };

  const reset = () => {
    setImagePreview(null);
    setFile(null);
  };
  const onCancel = () => reset();

  const onSubmit = setUploading => async () => {
    setUploading(true);
    const timestamp = +new Date();
    const name = `${timestamp}.${getExtenstion(file.name)}`;
    const ref = storageRef.child(name);
    const metadata = {
      customMetadata: { userId: user.claims.sub },
      cacheControl: 'public,max-age=31536000'
    };

    const imageDataRef = window.firebase.database().ref('images/');
    const unsubscribe = () => imageDataRef.off('child_changed', endLoading);
    const endLoading = snapshot => {
      const val = snapshot.val();
      if (val.uploadFinished) {
        setUploading(false);
        reset();
        unsubscribe();
        return;
      }
      setUploadMessage(val.status);
    };

    imageDataRef
      .orderByChild('timestamp')
      .equalTo(timestamp.toString())
      .on('child_changed', endLoading);
    try {
      await ref.put(file, metadata);
      setAlert(true);
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  return imagePreview ? (
    <SubmitScreen
      uploadMessage={uploadMessage}
      imagePreview={imagePreview}
      onCancel={onCancel}
      onSubmit={onSubmit}
      orientation={orientation}
    />
  ) : (
    <UploadScreen
      alert={alert}
      setAlert={setAlert}
      handleImageChange={handleImageChange}
    />
  );
};

const SubmitScreen = ({
  imagePreview,
  onCancel,
  onSubmit,
  uploadMessage,
  orientation
}) => {
  const [uploading, setUploading] = useState(false);
  return uploading ? (
    <div className="h-full w-full">
      <Loading message={uploadMessage} />
    </div>
  ) : (
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
          <Button onClick={onCancel}>Cancel</Button>
        </div>
        <div>
          <Button
            onClick={onSubmit(setUploading)}
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

const UploadScreen = ({ handleImageChange, alert, setAlert }) => {
  const uploadImage = useRef(null);

  const handleClick = event => {
    event.preventDefault();
    uploadImage.current.click();
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
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
          color="primary"
          hoverColor="primary-light"
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
