export interface PopupState {
    isVisible: boolean;
    title?: String;
    contents: String;
    isCenter: boolean;
}
  
export enum PopupActionTypes {
    SHOW_POPUP = "SHOW_POPUP",
    HIDE_POPUP = "HIDE_POPUP",
    SET_TITLE = "SET_TITLE",
    SET_CONTENTS = "SET_CONTENTS",
    SET_TOP = "SET_TOP",
    SET_CENTER = "SET_CENTER",
}
  
interface ShowPopup {
    type: PopupActionTypes.SHOW_POPUP;
}
  
interface HidePopup {
    type: PopupActionTypes.HIDE_POPUP;
}

interface SetPopupTitle {
    type: PopupActionTypes.SET_TITLE;
    value: String;
}
  
interface SetPopupContents {
    type: PopupActionTypes.SET_CONTENTS;
    value: String;
}

interface SetPopupTop {
    type: PopupActionTypes.SET_TOP;
}

interface SetPopupCenter {
    type: PopupActionTypes.SET_CENTER;
}
  
export type PopupAction = ShowPopup | HidePopup | SetPopupTitle | SetPopupContents | SetPopupTop | SetPopupCenter;