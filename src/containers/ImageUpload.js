import React, { useState, useRef } from 'react';
import { Button } from '~/components';
import { Fade } from '~/components/transitions';
import { getExtenstion } from '~/utils';
export const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const storageRef = window.firebase.storage().ref();

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

  const onCancel = () => {
    setImagePreview(null);
    setFile(null);
  };

  const onSubmit = async () => {
    const name = `${+new Date()}.${getExtenstion(file.name)}`;
    debugger;
    // const ref = storageRef.child(`${+ new Date()}`);
    // const snapshot = await ref.put(file);
  };

  return (
    <div className="h-full">
      {imagePreview ? (
        <SubmitScreen
          imagePreview={imagePreview}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      ) : (
        <UploadScreen handleImageChange={handleImageChange} />
      )}
    </div>
  );
};

const SubmitScreen = ({ imagePreview, onCancel, onSubmit }) => (
  <Fade appear={true}>
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex justify-center items-center flex-grow p-3">
        <img alt="Preview" src={imagePreview} />
      </div>

      <div className="flex justify-end w-full py-3 pr-3">
        <Button onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="red" dark="true">
          Submit
        </Button>
      </div>
    </div>
  </Fade>
);

const UploadScreen = ({ handleImageChange }) => {
  const uploadImage = useRef(null);

  const handleClick = event => {
    event.preventDefault();
    uploadImage.current.click();
  };

  return (
    <Fade appear={true}>
      <div className="flex flex-col justify-center items-center h-full">
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
    </Fade>
  );
};
