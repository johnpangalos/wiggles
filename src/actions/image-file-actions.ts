import { constants } from 'constants/index';

export const setFile = ({ orientation, imagePreview, file }) => ({
  type: constants.SET_FILE,
  orientation,
  imagePreview,
  file
});
