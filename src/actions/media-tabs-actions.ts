import { Constants } from "@/constants";

export const setMediaTab = (tab: string) => ({
  type: Constants.SET_CURRENT_TAB,
  payload: tab,
});
