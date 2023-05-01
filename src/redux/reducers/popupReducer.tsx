import { PopupState, PopupAction, PopupActionTypes } from "../ReducersTypes";

const initialState: PopupState = {
  isShow: false,
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
      return { ...state, isShow: true };
    case PopupActionTypes.HIDE_POPUP:
      return { ...state, isShow: false };
    case PopupActionTypes.SHOW_TOP_POPUP:
      return { ...state, isShow: true,  isCenter: false, contents: action.value.contents };
    case PopupActionTypes.SHOW_CENTER_POPUP:
      return { ...state, isShow: true,  isCenter: true, title: action.value.title, contents: action.value.contents };
    default:
      return state;
  }
}