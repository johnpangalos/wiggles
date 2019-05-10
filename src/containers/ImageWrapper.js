import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Image } from '~/components';
import { addImage } from '~/actions';

export const ImageWrapper = ({ id }) => {
  const mapState = useCallback(
    state => ({
      image: state.images[id]
    }),
    []
  );

  const dispatch = useDispatch();

  const { image } = useMappedState(mapState);

  useEffect(() => {
    if (image) return;
    let didCancel = false;

    const fetchAccount = async () => {
      const imageRef = window.firebase.database().ref(`images/${id}`);
      const snap = await imageRef.once('value');
      const val = snap.val();
      if (!didCancel && val) dispatch(addImage(val));
    };

    fetchAccount();
    return () => {
      didCancel = true;
    };
  }, [id]);

  return !!image && <Image url={image.web} />;
};
