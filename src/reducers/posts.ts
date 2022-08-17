import { Post } from "@/types";
import { Action } from "redux";
import { Constants } from "../constants";

const initialState: Record<string, Post> = {};

export const posts = (
  state = initialState,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.ADD_POSTS: {
      return { ...state, ...action.payload };
    }
    case Constants.REMOVE_POST: {
      const { [action.payload]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
