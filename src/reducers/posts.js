import { constants } from '~/constants';

const initialState = {};

export const posts = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_POSTS: {
      return { ...state, ...action.payload };
    }
    case constants.REMOVE_POST: {
      const { [action.payload]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
