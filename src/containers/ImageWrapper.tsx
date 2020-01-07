import React, { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { Image } from 'components';

export const ImageWrapper = ({ id, thumb = false }) => {
  const mapState = useCallback(
    state => ({
      image: state.images[id]
    }),
    [id]
  );

  const { image } = useMappedState(mapState);

  return !!image && <Image url={thumb ? image.thumbnail : image.web} />;
};
