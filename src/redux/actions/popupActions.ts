import { PopupActionTypes, PopupAction } from "../ReducersTypes";

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

export function setPopupTitle(title: String): PopupAction {
  return {
    type: PopupActionTypes.SET_TITLE,
    value: title
  };
}

export function setPopupContents(contents: String): PopupAction {
  return {
    type: PopupActionTypes.SET_CONTENTS,
    value: contents
  };
}

export function setPopupTop(): PopupAction {
  return {
    type: PopupActionTypes.SET_TOP,
  };
}

export function setPopupCenter(): PopupAction {
  return {
    type: PopupActionTypes.SET_CENTER,
  };
}