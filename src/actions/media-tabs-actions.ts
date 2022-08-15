import { constants } from "@/constants";

export const setMediaTab = (tab: string) => ({
  type: constants.SET_CURRENT_TAB,
  payload: tab,
});
