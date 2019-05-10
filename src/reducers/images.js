import { constants } from '~/constants';

const initialState = {};

export const images = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_IMAGES: {
      return { ...state, ...action.payload };
    }
    case constants.REMOVE_IMAGE: {
      const { [action.payload]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
