export interface PopupState {
    isShow: boolean;
    title?: string;
    contents: string;
    link?: string;
    isCenter: boolean;
}
  
export enum PopupActionTypes {
    SHOW_POPUP = "SHOW_POPUP",
    HIDE_POPUP = "HIDE_POPUP",
    SHOW_TOP_POPUP = "SHOW_TOP_POPUP",
    SHOW_CENTER_POPUP = "SHOW_CENTER_POPUP",
    SHOW_CENTER_LINK_POPUP = "SHOW_CENTER_LINK_POPUP"
}
  
interface ShowPopup {
    type: PopupActionTypes.SHOW_POPUP;
}
  
interface HidePopup {
    type: PopupActionTypes.HIDE_POPUP;
}

interface ShowTopPopup {
    type: PopupActionTypes.SHOW_TOP_POPUP;
    value: {
        contents: string
    };
}
  
interface ShowCenterPopup {
    type: PopupActionTypes.SHOW_CENTER_POPUP;
    value: {
        title: string,
        contents: string
    };
}

interface ShowCenterLinkPopup {
    type: PopupActionTypes.SHOW_CENTER_LINK_POPUP;
    value: {
        title: string,
        contents: string,
        link: string
    };
}
  
export type PopupAction = ShowPopup | HidePopup | ShowTopPopup | ShowCenterPopup | ShowCenterLinkPopup;