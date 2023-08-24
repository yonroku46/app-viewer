import { UserState, UserAction, UserActionTypes } from "../types/UserActionTypes";

const initialState: UserState = {
  userId: undefined,
  userName: undefined,
  mail: undefined,
  token: undefined,
  refreshToken: undefined,
  mailAuth: undefined
}

export default function userReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionTypes.USER_LOGIN:
      return { ...state, userId: action.state.userId, userName: action.state.userName, mail: action.state.mail, token: action.state.token, refreshToken: action.state.refreshToken, mailAuth: action.state.mailAuth };
    case UserActionTypes.USER_LOGOUT:
      return { ...state, userId: undefined, userName: undefined, mail: undefined, token: undefined, refreshToken: undefined, mailAuth: undefined };
    default:
      return state;
  }
}