import { Account } from "@/types";
import { Constants } from "@/constants";

export const addAccount = (account: Account) => ({
  type: Constants.ADD_ACCOUNTS,
  payload: { [account.id]: account },
});

export const removeAccount = (id: string) => ({
  type: Constants.REMOVE_ACCOUNT,
  payload: id,
});
