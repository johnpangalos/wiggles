import React, { useCallback } from "react";
import { useMappedState } from "redux-react-hook";
import { Image } from "../components";

export const ImageWrapper = ({
  id,
  thumb = false,
}: {
  id: string;
  thumb?: boolean;
}) => {
  const mapState = useCallback(
    (state) => ({
      image: state.images[id],
    }),
    [id]
  );

  const { image } = useMappedState(mapState);

  if (!image) return <></>;
  return <Image url={thumb ? image.thumbnail : image.web} />;
};
