import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Image } from '~/components';
import { addImage } from '~/actions';

export const ImageWrapper = ({ id }) => {
  const mapState = useCallback(
    state => ({
      image: state.images[id]
    }),
    [id]
  );

  const dispatch = useDispatch();

  const { image } = useMappedState(mapState);

  useEffect(() => {
    if (image) return;
    let didCancel = false;

    const fetchAccount = async () => {
      const image = await window.db
        .collection('images')
        .doc(id)
        .get();
      if (!didCancel) dispatch(addImage(image.data()));
    };

    fetchAccount();
    return () => {
      didCancel = true;
    };
  }, [dispatch, image, id]);

  return !!image && <Image url={image.web} />;
};
