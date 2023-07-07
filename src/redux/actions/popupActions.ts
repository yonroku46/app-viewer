import { PopupActionTypes, PopupAction } from "../types/PopupActionTypes";

export function showPopup(): PopupAction {
  return {
    type: PopupActionTypes.SHOW_POPUP,
  };
}

export function hidePopup(): PopupAction {
  return {
    type: PopupActionTypes.HIDE_POPUP,
  };
}

export function showTopPopup(contents: string): PopupAction {
  return {
    type: PopupActionTypes.SHOW_TOP_POPUP,
    value: {
      contents: contents
    }
  };
}

export function showCenterPopup(title: string, contents: string): PopupAction {
  return {
    type: PopupActionTypes.SHOW_CENTER_POPUP,
    value: {
      title: title,
      contents: contents
    }
  };
}

export function showCenterLinkPopup(title: string, contents: string, link: string): PopupAction {
  return {
    type: PopupActionTypes.SHOW_CENTER_LINK_POPUP,
    value: {
      title: title,
      contents: contents,
      link: link
    }
  };
}