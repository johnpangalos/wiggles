import { Constants } from "@/constants";
import { Image } from "@/types";

export const addImages = (payload: Record<string, Image>) => ({
  type: Constants.ADD_IMAGES,
  payload,
});

export const addImage = (image: Image) => ({
  type: Constants.ADD_IMAGES,
  payload: { [image.id]: image },
});

export const removeImage = (id: string) => ({
  type: Constants.REMOVE_IMAGE,
  payload: id,
});
