import { Action } from "redux";
import { Constants } from "../constants";

const initialState = {
  currentTab: "images",
};

export const mediaTabs = (
  state = initialState,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.SET_CURRENT_TAB: {
      return { ...state, currentTab: action.payload };
    }
    default: {
      return state;
    }
  }
};
