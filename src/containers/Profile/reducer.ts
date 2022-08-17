import { Constants } from "@/constants";
import { Post, Account } from "@/types";
import { Action } from "redux";

type State = {
  account: Record<string, Account>;
  posts: Record<string, Post>;
  loading: boolean;
  selected: Record<string, Post>;
  selectMode: boolean;
};
export const initialState: State = {
  account: {},
  posts: {},
  loading: false,
  selected: {},
  selectMode: false,
};

export const reducer = (
  state: State,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.ADD_ACCOUNT: {
      return { ...state, account: action.payload };
    }
    case Constants.ADD_POSTS: {
      return { ...state, posts: action.payload };
    }
    case Constants.LOADING: {
      return { ...state, loading: true };
    }
    case Constants.NOT_LOADING: {
      return { ...state, loading: false };
    }
    case Constants.ADD_SELECTED: {
      return {
        ...state,
        selected: { ...state.selected, [action.payload]: true },
      };
    }
    case Constants.REMOVE_SELECTED: {
      const { [action.payload]: _, ...rest } = state.selected;
      return {
        ...state,
        selected: { ...rest },
      };
    }
    case Constants.RESET_SELECTED: {
      return {
        ...state,
        selected: initialState.selected,
      };
    }
    case Constants.SET_SELECT_MODE: {
      return {
        ...state,
        selectMode: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
