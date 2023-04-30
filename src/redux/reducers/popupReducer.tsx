import { PopupState, PopupAction, PopupActionTypes } from "../ReducersTypes";

const initialState: PopupState = {
  isVisible: false,
  title: 'Title',
  contents: 'Contents',
  isCenter: false,
};

export default function popupReducer(
  state = initialState,
  action: PopupAction
): PopupState {
  switch (action.type) {
    case PopupActionTypes.SHOW_POPUP:
      return { ...state, isVisible: true };
    case PopupActionTypes.HIDE_POPUP:
      return { ...state, isVisible: false };
    case PopupActionTypes.SET_TITLE:
      return { ...state, title: action.value };
    case PopupActionTypes.SET_CONTENTS:
      return { ...state, contents: action.value };
    case PopupActionTypes.SET_TOP:
      return { ...state, isCenter: false };
    case PopupActionTypes.SET_CENTER:
      return { ...state, isCenter: true };
    default:
      return state;
  }
}