import { constants } from '~/constants';

export const setFile = ({ orientation, imagePreview, file }) => ({
  type: constants.SET_FILE,
  orientation,
  imagePreview,
  file
});
