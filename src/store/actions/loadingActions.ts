import { LoadingActionTypes, LoadingAction } from "../types/LoadingActionTypes";

export function loading(isDark: boolean, isShow: boolean): LoadingAction {
  return {
    type: LoadingActionTypes.LOADING,
    state: {
      isDark: isDark,
      isShow: isShow
    }
  };
}

export function unloading(): LoadingAction {
  return {
    type: LoadingActionTypes.UNLOADNIG,
  };
}