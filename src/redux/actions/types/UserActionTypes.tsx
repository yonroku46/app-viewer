export interface UserState {
    loading: boolean;
    title?: string;
    contents: string;
}
  
export enum UserActionTypes {
    SHOW_POPUP = "SHOW_POPUP",
    HIDE_POPUP = "HIDE_POPUP"
}
  
interface ShowPopup {
    type: UserActionTypes.SHOW_POPUP;
}
  
interface HidePopup {
    type: UserActionTypes.HIDE_POPUP;
}
  
export type UserAction = ShowPopup | HidePopup;