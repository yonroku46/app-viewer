import { UserActionTypes, UserAction } from "./types/UserActionTypes";

export function showPopup(): UserAction {
  return {
    type: UserActionTypes.SHOW_POPUP,
  };
}

export function hidePopup(): UserAction {
  return {
    type: UserActionTypes.HIDE_POPUP,
  };
}