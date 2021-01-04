import { constants } from '../constants';

export const setMediaTab = tab => ({
  type: constants.SET_CURRENT_TAB,
  payload: tab
});
