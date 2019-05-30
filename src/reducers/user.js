import { constants } from '~/constants';

const initialState = {};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case constants.UPDATE_USER: {
      return { ...action.payload };
    }
    default: {
      return state;
    }
  }
};
