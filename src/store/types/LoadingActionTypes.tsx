export interface LoadingState {
    isDark?: boolean;
    isShow?: boolean;
}
  
export enum LoadingActionTypes {
    LOADING = "LOADING",
    UNLOADNIG = "UNLOADNIG",
}
  
interface Loading {
    type: LoadingActionTypes.LOADING;
    state: LoadingState;
}
  
interface Unloading {
    type: LoadingActionTypes.UNLOADNIG;
}
  
export type LoadingAction = Loading | Unloading;