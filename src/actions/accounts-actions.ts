import { Account } from "@/types";
import { constants } from "@/constants";

export const addAccount = (account: Account) => ({
  type: constants.ADD_ACCOUNTS,
  payload: { [account.id]: account },
});

export const removeAccount = (id: string) => ({
  type: constants.REMOVE_ACCOUNT,
  payload: id,
});
