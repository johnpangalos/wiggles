import { constants } from 'constants/index';

export const setMediaTab = tab => ({
  type: constants.SET_CURRENT_TAB,
  payload: tab
});
