import { UserState, UserAction, UserActionTypes } from "../actions/types/UserActionTypes";

interface User {
  id: number;
  name: string;
  email: string;
}

const initialState: UserState = {
  loading: false,
  title: 'Title',
  contents: 'Contents'
}

export default function popupReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionTypes.SHOW_POPUP:
      return { ...state, loading: true };
    case UserActionTypes.HIDE_POPUP:
      return { ...state, loading: false };
    default:
      return state;
  }
}