import { constants } from "@/constants";
import { Image } from "@/types";

export const addImages = (payload: Record<string, Image>) => ({
  type: constants.ADD_IMAGES,
  payload,
});

export const addImage = (image: Image) => ({
  type: constants.ADD_IMAGES,
  payload: { [image.id]: image },
});

export const removeImage = (id: string) => ({
  type: constants.REMOVE_IMAGE,
  payload: id,
});
