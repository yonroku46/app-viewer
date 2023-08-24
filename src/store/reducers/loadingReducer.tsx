import { LoadingState, LoadingAction, LoadingActionTypes } from "../types/LoadingActionTypes";

const initialState: LoadingState = {
  isDark: undefined,
  isShow: undefined
}

export default function loadingReducer(
  state = initialState,
  action: LoadingAction
): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.LOADING:
      return { ...state, isDark: action.state.isDark, isShow: action.state.isShow };
    case LoadingActionTypes.UNLOADNIG:
      return { ...state, isDark: undefined, isShow: undefined };
    default:
      return state;
  }
}