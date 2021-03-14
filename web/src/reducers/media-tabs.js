import { constants } from '../constants';

const initialState = {
  currentTab: 'images'
};

export const mediaTabs = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_TAB: {
      return { ...state, currentTab: action.payload };
    }
    default: {
      return state;
    }
  }
};
