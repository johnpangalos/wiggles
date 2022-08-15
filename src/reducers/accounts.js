import { constants } from '../constants';

const initialState = {};

export const accounts = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_ACCOUNTS: {
      return { ...state, ...action.payload };
    }
    case constants.REMOVE_ACCOUNT: {
      const { [action.payload]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
