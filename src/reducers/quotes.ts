import { constants } from 'constants/index';

const initialState = {};

export const quotes = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_QUOTES: {
      return { ...state, ...action.payload };
    }
    case constants.REMOVE_QUOTE: {
      const { [action.payload]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
