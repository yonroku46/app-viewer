import { PopupState, PopupAction, PopupActionTypes } from "../types/PopupActionTypes";

const initialState: PopupState = {
  isShow: false,
  title: 'Title',
  contents: 'Contents',
  link: '',
  isCenter: false,
};

export default function popupReducer(
  state = initialState,
  action: PopupAction
): PopupState {
  switch (action.type) {
    case PopupActionTypes.SHOW_POPUP:
      return { ...state, isShow: true };
    case PopupActionTypes.HIDE_POPUP:
      return { ...state, isShow: false, link: undefined };
    case PopupActionTypes.SHOW_TOP_POPUP:
      return { ...state, isShow: true,  isCenter: false, contents: action.value.contents };
    case PopupActionTypes.SHOW_CENTER_POPUP:
      return { ...state, isShow: true,  isCenter: true, title: action.value.title, contents: action.value.contents };
    case PopupActionTypes.SHOW_CENTER_LINK_POPUP:
      return { ...state, isShow: true,  isCenter: true, title: action.value.title, contents: action.value.contents, link: action.value.link };
    default:
      return state;
  }
}