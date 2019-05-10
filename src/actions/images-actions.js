import { constants } from '~/constants';

export const addImage = image => ({
  type: constants.ADD_IMAGES,
  payload: { [image.id]: image }
});

export const removeImage = id => ({
  type: constants.REMOVE_IMAGE,
  payload: id
});
