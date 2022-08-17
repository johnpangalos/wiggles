import { Action } from "redux";
import { Constants } from "../constants";

const initialState = {};

export const user = (
  state = initialState,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.UPDATE_USER: {
      return { ...action.payload };
    }
    default: {
      return state;
    }
  }
};
