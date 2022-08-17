import { Image } from "@/types";
import { Action } from "redux";
import { Constants } from "../constants";

const initialState: Record<string, Image> = {};

export const images = (
  state = initialState,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.ADD_IMAGES: {
      return { ...state, ...action.payload };
    }
    case Constants.REMOVE_IMAGE: {
      const { [action.payload as string]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
