import React, { useReducer, useEffect } from 'react';
import { Image } from '~/components';

const constants = {
  ADD_IMAGES: 'add-images',
  ADD_ACCOUNT: 'add-account'
};
const initialState = {
  images: {},
  accounts: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case constants.ADD_IMAGES: {
      return { ...state, images: { ...state.images, ...action.payload } };
    }
    case constants.ADD_ACCOUNT: {
      return {
        ...state,
        accounts: { ...state.accounts, [action.payload.id]: action.payload }
      };
    }
    default: {
      return state;
    }
  }
};

export const Feed = () => {
  const [{ images, accounts }, dispatch] = useReducer(reducer, initialState);
  const callback = snapshot =>
    dispatch({ type: constants.ADD_IMAGES, payload: snapshot.val() });
  useEffect(() => {
    const imagesRef = window.firebase.database().ref('images/');
    imagesRef.on('value', callback);
    return () => {
      imagesRef.off('value', callback);
    };
  }, [images]);

  return (
    <div className="h-full w-full">
      <div className="px-8 py-6 max-w-500 m-auto">
        {Object.keys(images).length > 0 &&
          Object.values(images)
            .filter(image => image.uploadFinished)
            .sort((a, b) => (a.timestamp - b.timestamp) * -1)
            .map((image, index) => (
              <ImageWrapper
                key={image.id}
                index={index}
                image={image}
                account={accounts[image.userId]}
                dispatch={dispatch}
              />
            ))}
      </div>
    </div>
  );
};

const ImageWrapper = ({ image, index, account = {}, dispatch }) => {
  const callback = snap =>
    dispatch({ type: constants.ADD_ACCOUNT, payload: snap.val() });

  useEffect(() => {
    if (Object.keys(account) > 0) return;
    const accountRef = window.firebase
      .database()
      .ref(`accounts/${image.userId}`);
    accountRef.on('value', callback);
    return () => {
      accountRef.off('value', callback);
    };
  }, [image.url]);

  return (
    <div key={image.id} className="pb-4">
      <Image
        url={image.web}
        timestamp={image.timestamp}
        index={index}
        size="100"
        profile
        account={account}
      />
    </div>
  );
};
