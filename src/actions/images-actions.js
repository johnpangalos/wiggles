import { constants } from '../constants';

export const addImages = payload => ({
  type: constants.ADD_IMAGES,
  payload
});

export const addImage = image => ({
  type: constants.ADD_IMAGES,
  payload: { [image.id]: image }
});

export const removeImage = id => ({
  type: constants.REMOVE_IMAGE,
  payload: id
});
