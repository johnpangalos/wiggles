import { Action } from "redux";
import { Constants } from "../constants";
import { Account } from "@/types";

const initialState: Record<string, Account> = {};

export const accounts = (
  state = initialState,
  action: Action<Constants> & { payload: any }
) => {
  switch (action.type) {
    case Constants.ADD_ACCOUNTS: {
      return { ...state, ...action.payload };
    }
    case Constants.REMOVE_ACCOUNT: {
      const { [action.payload as string]: _, ...rest } = state;
      return rest;
    }
    default: {
      return state;
    }
  }
};
